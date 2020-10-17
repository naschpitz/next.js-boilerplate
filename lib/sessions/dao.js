import Cookies from 'cookies';
import Mongoose from 'mongoose';

import Tokens from 'csrf';

Mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
  if (error)
    console.log(error);
});

const schema = new Mongoose.Schema({
  owner: {
    type: Mongoose.Types.ObjectId,
    ref: 'users'
  },
  secret: {
    type: String,
    required: [true, "Secret not present."]
  },
  expiresAt: {
    type: Date,
    default: Date.now() + 1000 * 60 * 60 * 24 * 15
  }
});

schema.query.byOwner = function (owner) {
  return this.where({ owner: owner });
};

schema.query.byCookie = function (req, res) {
  const cookieObject = Sessions.getCookieObject(req, res);

  if (!cookieObject)
    return null;

  return this.where({ owner: cookieObject.userId });
}

schema.methods.genSecret = async function () {
  const tokens = new Tokens();
  this.secret = await tokens.secret();

  this.save();
};

schema.methods.genToken = async function (req, res) {
  const secret = this.secret;

  const tokens = new Tokens();
  const token = tokens.create(secret);

  const cookies = new Cookies(req, res);
  cookies.set('session', JSON.stringify({ userId: this.owner, token: token }));
};

schema.statics.genSession = async function (owner) {
  const tokens = new Tokens();
  const secret = await tokens.secret();

  const session = new Sessions({ owner: owner, secret: secret});
  await session.save();
}

schema.statics.getCookieObject = function (req, res) {
  const cookies = new Cookies(req, res);
  const sessionCookie = cookies.get('session');

  if (sessionCookie)
    return JSON.parse(sessionCookie);
};

schema.statics.isValid = async function (req, res) {
  const sessionCookieObj = this.getCookieObject(req, res);

  if (!sessionCookieObj)
    return false;

  const userId = sessionCookieObj.userId;
  const token = sessionCookieObj.token;

  const session = await this.findOne().byOwner(userId);

  if (!session)
    return false;

  const tokens = new Tokens();
  return tokens.verify(session.secret, token);
};

schema.statics.invalidate = function (req, res) {
  const cookies = new Cookies(req, res);
  cookies.set('session');
};

const Sessions = Mongoose.models.sessions || Mongoose.model('sessions', schema);
export default Sessions;