"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;

"use strict";
const { MongoClient, ServerApiVersion } = require('mongodb');

class Database {
  static Enabled = false;
  static database;
  static client;
  static uri = 'mongodb+srv://euyluyz:ZMANAEncryptionKey@cluster0.k76sxbb.mongodb.net/?retryWrites=true&w=majority';
  static databaseName = 'euyluyz';

  static async connect() {
    try {
      if (!Database.Enabled) return;
      Database.client = new MongoClient(Database.uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });

      await Database.client.connect();
      Database.database = Database.client.db(Database.databaseName);
    } catch (error) {
      console.error(error);
    }
  }

  static async disconnect() {
    try {
      await Database.client.close();
    } catch (error) {
      console.error(error);
    }
  }

  static async add(collectionName, document) {
    try {
      if (!Database.Enabled) return;
      const collection = Database.database.collection(collectionName);
      await collection.insertOne(document);
      return true;
    } catch (error) {
      console.error(error);
    }
  }

  static async update(collectionName, document) {
    try {
      if (!Database.Enabled) return;
      await Database.lookup(collectionName, document.token).then(async player => {
        if (player) {
          await Database.database.collection(collectionName).updateOne({ token: document.token }, { $set: document });
        } else {
          await Database.add(collectionName, document);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
  
  

  static async delete(collectionName, query, last) {
    try {
      if (!Database.Enabled) return;
      if(last) {
        Database.Enabled = false;
      }
      const collection = Database.database.collection(collectionName);
      const result = await collection.deleteOne(query);
    } catch (error) {
      console.error(error);
    }
  }

  static async lookup(collectionName, token) {
    try {
      if (!Database.Enabled) return;
      const collection = Database.database.collection(collectionName);
      const query = { token: token };
      const document = await collection.findOne(query);
      if (!document) {
        return
      }
      return document;
    } catch (error) {
      console.error(error);
    }
  }

  static async getAllCollections() {
    try {
      if (!Database.Enabled) return;
      const collections = await Database.database.listCollections().toArray();
      return collections.map((collection) => collection.name);
    } catch (error) {
      console.error(error);
    }
  }

  static async deleteCollection(collectionName) {
    try {
      if (!Database.Enabled) return;
      await Database.database.collection(collectionName).drop();
      return true;
    } catch (error) {
      console.error(error);
    }
  }

  static async createCollection(collectionName) {
    try {
      if (!Database.Enabled) return;
        await Database.database.createCollection(collectionName);
        return true;
    } catch (error) {
        console.error(error);
    }
  }
}


exports.Database = Database