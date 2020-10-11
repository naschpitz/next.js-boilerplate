import { ObjectId } from 'mongodb';
import hash from 'object-hash';

import DB from '../../db';
import Users from './class';

class _UsersDAO {
  async getCollection() {
    const db = await DB.getDB();

    this.collection = db.collection('users');

    return this.collection;
  }

  async getByCredentials(email, password) {
    await this.getCollection();

    password = hash(password);

    return this.collection.findOne({ 'email.address': email, password: password });
  }

  async getByEmail(email) {
    await this.getCollection();

    return this.collection.findOne({ 'email.address': email });
  }

  async getByEmailVerificationToken(token) {
    await this.getCollection();

    return this.collection.findOne({ 'emailVerificationToken': token });
  }

  async getById(userId) {
    await this.getCollection();

    return this.collection.findOne({ _id: ObjectId(userId) });
  }

  async getByPasswordRecoveryToken(token) {
    await this.getCollection();

    return this.collection.findOne({ passwordRecoveryToken: token });
  }

  async getPassword(userId) {
    await this.getCollection();

    const user = await this.collection.findOne({ _id: ObjectId(userId) });

    return user.password;
  }

  async setPassword(userId, password) {
    await this.getCollection();

    const isValid = Users.validatePassword(password);

    if (!isValid)
      throw new Error("The password does not meet the requirements.");

    password = hash(password);

    return this.collection.updateOne({ _id: ObjectId(userId) }, { $set: { password: password } });
  }

  async insert(user) {
    await this.getCollection();

    const isValidEmail = Users.validateEmail(user.email.address);

    if (!isValidEmail)
      throw new Error("Invalid e-mail.");

    const isValidPassword = Users.validatePassword(user.password);

    if (!isValidPassword)
      throw new Error("The password does not meet the requirements.");

    user.password = hash(user.password);
    user.email.verified = false;

    return this.collection.insert(user);
  }

  async setEmailVerificationToken(userId, token) {
    await this.getCollection();

    return this.collection.updateOne({ _id: ObjectId(userId) }, { $set: { emailVerificationToken: token } });
  }

  async setEmailVerified(userId, verified) {
    await this.getCollection();

    return this.collection.updateOne({ _id: ObjectId(userId) }, { $set: { 'email.verified': verified } });
  }

  async setPasswordRecoveryToken(email, token) {
    await this.getCollection();

    return this.collection.updateOne({ 'email.address': email }, { $set: { passwordRecoveryToken: token } });
  }

  async setSecret(userId, secret) {
    await this.getCollection();

    return this.collection.updateOne({ _id: ObjectId(userId) }, { $set: { 'session.secret': secret } });
  }

  async unsetPasswordRecoveryToken(userId) {
    await this.getCollection();

    return this.collection.updateOne({ _id: ObjectId(userId) }, { $unset: { passwordRecoveryToken: '' } });
  }

  async unsetEmailVerificationToken(userId) {
    await this.getCollection();

    return this.collection.updateOne({ _id: ObjectId(userId) }, { $unset: { emailVerificationToken: '' } });
  }
}

const UsersDAO = new _UsersDAO();
export default UsersDAO;