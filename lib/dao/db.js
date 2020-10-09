import { MongoClient } from 'mongodb';

class DBDAO {
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

export default new DBDAO();