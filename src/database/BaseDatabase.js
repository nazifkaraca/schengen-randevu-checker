/**
 * Base Database Interface
 * Tüm veritabanı adaptörleri bu interface'i implement eder
 */

class BaseDatabase {
  constructor(config) {
    this.config = config;
    this.connected = false;
  }

  /**
   * Veritabanına bağlan
   * @returns {Promise<boolean>}
   */
  async connect() {
    throw new Error('connect() metodu implement edilmeli');
  }

  /**
   * Bağlantıyı kapat
   * @returns {Promise<boolean>}
   */
  async disconnect() {
    throw new Error('disconnect() metodu implement edilmeli');
  }

  /**
   * Randevu kaydet
   * @param {Object} randevu
   * @returns {Promise<Object>}
   */
  async saveRandevu(randevu) {
    throw new Error('saveRandevu() metodu implement edilmeli');
  }

  /**
   * Randevu getir
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async getRandevu(id) {
    throw new Error('getRandevu() metodu implement edilmeli');
  }

  /**
   * Tüm randevuları getir
   * @returns {Promise<Array>}
   */
  async getAllRandevular() {
    throw new Error('getAllRandevular() metodu implement edilmeli');
  }

  /**
   * Randevu güncelle
   * @param {string} id
   * @param {Object} data
   * @returns {Promise<Object|null>}
   */
  async updateRandevu(id, data) {
    throw new Error('updateRandevu() metodu implement edilmeli');
  }

  /**
   * Randevu sil
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async deleteRandevu(id) {
    throw new Error('deleteRandevu() metodu implement edilmeli');
  }

  /**
   * Ülkeye göre filtrele
   * @param {string} ulke
   * @returns {Promise<Array>}
   */
  async getRandevularByUlke(ulke) {
    throw new Error('getRandevularByUlke() metodu implement edilmeli');
  }

  /**
   * Tarih aralığına göre filtrele
   * @param {Date} baslangic
   * @param {Date} bitis
   * @returns {Promise<Array>}
   */
  async getRandevularByDateRange(baslangic, bitis) {
    throw new Error('getRandevularByDateRange() metodu implement edilmeli');
  }
}

module.exports = BaseDatabase;
