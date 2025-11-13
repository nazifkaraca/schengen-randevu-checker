/**
 * Supabase Database Adapter
 */

const BaseDatabase = require('./BaseDatabase');

class SupabaseDatabase extends BaseDatabase {
  constructor(config) {
    super(config);
    this.client = null;
    this.tableName = config.table || 'randevular';
  }

  async connect() {
    try {
      const { createClient } = require('@supabase/supabase-js');
      
      const supabaseUrl = this.config.url;
      const supabaseKey = this.config.key;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase URL ve Key gerekli');
      }

      this.client = createClient(supabaseUrl, supabaseKey);
      this.connected = true;
      
      return true;
    } catch (error) {
      throw new Error(`Supabase bağlantı hatası: ${error.message}`);
    }
  }

  async disconnect() {
    // Supabase otomatik bağlantı yönetimi yapar
    this.connected = false;
    return true;
  }

  async saveRandevu(randevu) {
    if (!this.connected) throw new Error('Veritabanı bağlantısı yok');
    
    const { data, error } = await this.client
      .from(this.tableName)
      .insert([{
        ...randevu,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw new Error(`Supabase kayıt hatası: ${error.message}`);
    
    return data;
  }

  async getRandevu(id) {
    if (!this.connected) throw new Error('Veritabanı bağlantısı yok');
    
    // Önce ID ile dene
    let { data, error } = await this.client
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    // Bulunamazsa referansNo ile dene
    if (error || !data) {
      const result = await this.client
        .from(this.tableName)
        .select('*')
        .eq('referansNo', id)
        .single();
      
      data = result.data;
      error = result.error;
    }

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Supabase sorgulama hatası: ${error.message}`);
    }
    
    return data;
  }

  async getAllRandevular() {
    if (!this.connected) throw new Error('Veritabanı bağlantısı yok');
    
    const { data, error } = await this.client
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Supabase sorgulama hatası: ${error.message}`);
    
    return data || [];
  }

  async updateRandevu(id, updateData) {
    if (!this.connected) throw new Error('Veritabanı bağlantısı yok');
    
    const { data, error } = await this.client
      .from(this.tableName)
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .or(`id.eq.${id},referansNo.eq.${id}`)
      .select()
      .single();

    if (error) throw new Error(`Supabase güncelleme hatası: ${error.message}`);
    
    return data;
  }

  async deleteRandevu(id) {
    if (!this.connected) throw new Error('Veritabanı bağlantısı yok');
    
    const { error } = await this.client
      .from(this.tableName)
      .delete()
      .or(`id.eq.${id},referansNo.eq.${id}`);

    if (error) throw new Error(`Supabase silme hatası: ${error.message}`);
    
    return true;
  }

  async getRandevularByUlke(ulke) {
    if (!this.connected) throw new Error('Veritabanı bağlantısı yok');
    
    const { data, error } = await this.client
      .from(this.tableName)
      .select('*')
      .eq('ulke', ulke);

    if (error) throw new Error(`Supabase sorgulama hatası: ${error.message}`);
    
    return data || [];
  }

  async getRandevularByDateRange(baslangic, bitis) {
    if (!this.connected) throw new Error('Veritabanı bağlantısı yok');
    
    const { data, error } = await this.client
      .from(this.tableName)
      .select('*')
      .gte('randevuTarihi', new Date(baslangic).toISOString())
      .lte('randevuTarihi', new Date(bitis).toISOString());

    if (error) throw new Error(`Supabase sorgulama hatası: ${error.message}`);
    
    return data || [];
  }
}

module.exports = SupabaseDatabase;
