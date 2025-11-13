/**
 * MongoDB Database Adapter
 */

const BaseDatabase = require('./BaseDatabase');

class MongoDatabase extends BaseDatabase {
  constructor(config) {
    super(config);
    this.client = null;
    this.db = null;
    this.collection = null;
  }

  async connect() {
    try {
      const { MongoClient } = require('mongodb');
      
      const uri = this.config.uri || 'mongodb://localhost:27017';
      const dbName = this.config.database || 'schengen_randevu';
      const collectionName = this.config.collection || 'randevular';

      this.client = new MongoClient(uri);
      await this.client.connect();
      
      this.db = this.client.db(dbName);
      this.collection = this.db.collection(collectionName);
      
      this.connected = true;
      return true;
    } catch (error) {
      throw new Error(`MongoDB bağlantı hatası: ${error.message}`);
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.connected = false;
      return true;
    }
    return false;
  }

  async saveRandevu(randevu) {
    if (!this.connected) throw new Error('Veritabanı bağlantısı yok');
    
    const result = await this.collection.insertOne({
      ...randevu,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return {
      ...randevu,
      _id: result.insertedId
    };
  }

  async getRandevu(id) {
    if (!this.connected) throw new Error('Veritabanı bağlantısı yok');
    
    const { ObjectId } = require('mongodb');
    return await this.collection.findOne({ 
      $or: [
        { _id: new ObjectId(id) },
        { referansNo: id },
        { id: parseInt(id) }
      ]
    });
  }

  async getAllRandevular() {
    if (!this.connected) throw new Error('Veritabanı bağlantısı yok');
    return await this.collection.find({}).toArray();
  }

  async updateRandevu(id, data) {
    if (!this.connected) throw new Error('Veritabanı bağlantısı yok');
    
    const { ObjectId } = require('mongodb');
    const result = await this.collection.findOneAndUpdate(
      { 
        $or: [
          { _id: new ObjectId(id) },
          { referansNo: id },
          { id: parseInt(id) }
        ]
      },
      { 
        $set: {
          ...data,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );
    
    return result.value;
  }

  async deleteRandevu(id) {
    if (!this.connected) throw new Error('Veritabanı bağlantısı yok');
    
    const { ObjectId } = require('mongodb');
    const result = await this.collection.deleteOne({
      $or: [
        { _id: new ObjectId(id) },
        { referansNo: id },
        { id: parseInt(id) }
      ]
    });
    
    return result.deletedCount > 0;
  }

  async getRandevularByUlke(ulke) {
    if (!this.connected) throw new Error('Veritabanı bağlantısı yok');
    return await this.collection.find({ ulke }).toArray();
  }

  async getRandevularByDateRange(baslangic, bitis) {
    if (!this.connected) throw new Error('Veritabanı bağlantısı yok');
    
    return await this.collection.find({
      randevuTarihi: {
        $gte: new Date(baslangic),
        $lte: new Date(bitis)
      }
    }).toArray();
  }
}

module.exports = MongoDatabase;
