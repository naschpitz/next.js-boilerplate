import Mongoose from 'mongoose';

import hash from '../hash';
import randomString from '../randomString';
import Sessions from '../sessions/dao';
import _Users from './class';

Mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
  if (error)
    console.log(error);
});

const schema = new Mongoose.Schema({
  email: {
    address: {
      type: String,
      unique: true,
      required: [true, "E-mail address is required."],
      validate: {
        validator: (value) => (_Users.validateEmail(value)),
        message: "Invalid e-mail."
      }
    },
    verified: {
      type: Boolean,
      default: false,
      required: [true, "E-mail verified flag is required."]
    },
    token: {
      type: String,
      default: () => (randomString(30))
    }
  },
  password: {
    hash: {
      type: String,
      required: [true, "Password is required."],
      validate: {
        validator: function (value) {
          const isValid = _Users.validatePassword(value);

          if (!isValid)
            return false;

          else {
            this.password.hash = hash(value);
            return true;
          }
        },
        message: "The password does not meet the requirements."
      }
    },
    token: {
      type: String
    }
  }
});

schema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    const error = new Error("There is already a registered user with this e-mail.");
    error.code = 400;

    next(error);
  }

  else {
    next();
  }
});

schema.post('save', async function (doc, next) {
  await Sessions.genSession(doc._id);

  next();
});

schema.query.byEmail = function (email) {
  return this.where({ 'email.address': email });
};

schema.query.byEmailPassword = function (email, password) {
  return this.where({ 'email.address': email, 'password.hash': hash(password) });
}

schema.query.byEmailVerificationToken = function (token) {
  return this.where({ 'email.token': token });
}

schema.query.byPasswordRecoveryToken = function (token) {
  return this.where({ 'password.token': token });
}

schema.methods.comparePassword = function (password) {
  return hash(password) === this.password.hash;
}

schema.methods.genEmailVerificationToken = async function () {
  const token = randomString(30);

  this.email.token = token;
  await this.save({ validateBeforeSave: false });

  return token;
}

schema.methods.genPasswordRecoveryToken = async function () {
  const token = randomString(30);

  this.password.token = token;
  await this.save({ validateBeforeSave: false });

  return token;
}

schema.methods.resetPassword = async function (password) {
  this.password.hash = password;
  this.password.token = undefined;

  return this.save();
}

schema.methods.validateEmail = async function () {
  this.email.verified = true;
  this.email.token = undefined;

  return this.save({ validateBeforeSave: false });
}

schema.statics.checkEmailExists = async function (email) {
  const user = await this.findOne().byEmail(email);

  return !!user;
}

const Users = Mongoose.models.users || Mongoose.model('users', schema);
export default Users;