import { ObjectId } from 'mongodb';
import hash from 'object-hash';

import DB from './db';

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

  async checkEmailExists(email) {
    await this.getCollection();

    const user = await this.collection.findOne({ 'email.address': email });

    return !!user;
  }

  async insert(user) {
    await this.getCollection();

    user.password = hash(user.password);
    user.email.verified = false;

    const result = await this.collection.insert(user);

    return result;
  }

  async setSecret(userId, secret) {
    await this.getCollection();

    const result = await this.collection.update({ _id: ObjectId(userId) }, { $set: { 'session.secret': secret } } );

    return result;
  }
}

export default new UsersDAO();