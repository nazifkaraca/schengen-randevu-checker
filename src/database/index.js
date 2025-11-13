/**
 * Database Factory
 * Veritabanı tipine göre uygun adapter'ı döner
 */

const MongoDatabase = require('./MongoDatabase');
const SupabaseDatabase = require('./SupabaseDatabase');

class DatabaseFactory {
  /**
   * Veritabanı instance oluştur
   * @param {string} type - 'mongodb' veya 'supabase'
   * @param {Object} config - Veritabanı konfigürasyonu
   * @returns {BaseDatabase}
   */
  static create(type, config) {
    switch (type.toLowerCase()) {
      case 'mongodb':
      case 'mongo':
        return new MongoDatabase(config);
      
      case 'supabase':
        return new SupabaseDatabase(config);
      
      default:
        throw new Error(`Desteklenmeyen veritabanı tipi: ${type}. Desteklenenler: mongodb, supabase`);
    }
  }
}

module.exports = {
  DatabaseFactory,
  MongoDatabase,
  SupabaseDatabase
};
