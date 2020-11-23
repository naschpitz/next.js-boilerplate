import Cookies from 'cookies'; // 'httponly' is the default for cookies => https://www.npmjs.com/package/cookies
import Mongoose from 'mongoose';
import Tokens from 'csrf'; // https://www.npmjs.com/package/csrf

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

schema.query.byOwner = function (userId) {
  return this.where({ owner: userId });
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

  return this.save();
};

schema.methods.genToken = async function (req, res) {
  const secret = this.secret;

  this.expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 15;
  await this.save();

  const tokens = new Tokens();
  const token = tokens.create(secret);

  const cookies = new Cookies(req, res);

  // 'this.owner._id' handles the case when 'owner' has been populated - in this case it would send the whole user
  // object in the cookie if only 'this.owner' was used instead.

  // https://mongoosejs.com/docs/populate.html
  // From Mongoose docs: "A common reason for checking whether a path is populated is getting the author id.
  // However, for your convenience, Mongoose adds a _id getter to ObjectId instances so you can use story.author._id
  // regardless of whether author is populated."
  cookies.set('session', JSON.stringify({ userId: this.owner._id, token: token }));
};

schema.statics.genSession = async function (userId) {
  const tokens = new Tokens();
  const secret = await tokens.secret();

  let session = await Sessions.findOne().byOwner(userId);

  if (session)
    return;

  session = new Sessions({ owner: userId, secret: secret });

  return session.save();
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

  if (session.expiresAt < new Date())
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