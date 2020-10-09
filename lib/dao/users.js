import { ObjectId } from 'mongodb'
import hash from 'object-hash'

import DB from './db'

class UsersDAO {
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

  async getById(userId) {
    await this.getCollection();

    return await this.collection.findOne({ _id: ObjectId(userId) });
  }

  async getPassword(userId) {
    await this.getCollection();

    const user = await this.collection.findOne({ _id: ObjectId(userId) });

    return user.password;
  }

  async changePassword(userId, password) {
    await this.getCollection();

    password = hash(password);

    return await this.collection.update({ _id: ObjectId(userId) }, { $set: { password: password } });
  }

  async checkEmailExists(email) {
    await this.getCollection();

    const user = await this.collection.findOne({ 'email.address': email });

    return !!user;
  }

  async insert(user) {
    await this.getCollection();

    user.password = hash(user.password);
    user.email.verified = false;

    return await this.collection.insert(user);
  }

  async setSecret(userId, secret) {
    await this.getCollection();

    return await this.collection.update({ _id: ObjectId(userId) }, { $set: { 'session.secret': secret } });
  }
}

export default new UsersDAO();