import { ObjectId } from 'mongodb'
import hash from 'object-hash'

import DB from '../db'

class _UsersDAO {
  async getCollection() {
    const db = await DB.getDB();

    this.collection = db.collection('users');

    return this.collection;
  }

  async getByCredentials(email, password) {
    await this.getCollection();

    password = hash(password);

    return await this.collection.findOne({ 'email.address': email, password: password });
  }

  async getByEmail(email) {
    await this.getCollection();

    return await this.collection.findOne({ 'email.address': email });
  }

  async getById(userId) {
    await this.getCollection();

    return await this.collection.findOne({ _id: ObjectId(userId) });
  }

  async getByPasswordResetToken(token) {
    await this.getCollection();

    token = hash(token);

    return await this.collection.findOne({ 'passwordResetToken': token });
  }

  async getPassword(userId) {
    await this.getCollection();

    const user = await this.collection.findOne({ _id: ObjectId(userId) });

    return user.password;
  }

  async changePassword(userId, password) {
    await this.getCollection();

    password = hash(password);

    return this.collection.updateOne({ _id: ObjectId(userId) }, { $set: { password: password } });
  }

  async insert(user) {
    await this.getCollection();

    user.password = hash(user.password);
    user.email.verified = false;

    return await this.collection.insert(user);
  }

  async setPasswordResetToken(email, token) {
    await this.getCollection();

    token = hash(token);

    return this.collection.updateOne({ 'email.address': email }, { $set: { 'passwordResetToken': token } });
  }

  async unsetPasswordResetToken(userId) {
    await this.getCollection();

    return this.collection.updateOne({ _id: ObjectId(userId) }, { $unset: { 'passwordResetToken': '' } });
  }

  async setSecret(userId, secret) {
    await this.getCollection();

    return this.collection.updateOne({ _id: ObjectId(userId) }, { $set: { 'session.secret': secret } });
  }
}

const UsersDAO = new _UsersDAO();
export default UsersDAO;