import { MongoClient } from 'mongodb';

class _DB {
  constructor() {
    const url = process.env.MONGO_URL;

    this.client = new MongoClient(url, {useNewUrlParser: true});
  }

  async getDB() {
    const dbName = process.env.MONGO_DB_NAME;

    if (!this.client.isConnected()) {
      try {
        await this.client.connect();

        this.db = this.client.db(dbName);
      }

      catch (err) {
        console.log(err.stack);
      }
    }

    return this.db;
  }
}

const DB = new _DB();
export default DB;