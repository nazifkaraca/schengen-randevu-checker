/**
 * Supabase Kullanım Örneği
 * 
 * Kurulum:
 * npm install @supabase/supabase-js
 * 
 * Supabase Setup:
 * 1. https://supabase.com adresinde proje oluşturun
 * 2. SQL Editor'de tablo oluşturun:
 * 
 * CREATE TABLE randevular (
 *   id BIGSERIAL PRIMARY KEY,
 *   referansNo TEXT UNIQUE,
 *   ad TEXT,
 *   soyad TEXT,
 *   pasaportNo TEXT,
 *   dogumTarihi TEXT,
 *   ulke TEXT,
 *   sehir TEXT,
 *   vizeTipi TEXT,
 *   randevuTarihi TIMESTAMP,
 *   randevuSaati TEXT,
 *   durum TEXT,
 *   created_at TIMESTAMP DEFAULT NOW(),
 *   updated_at TIMESTAMP DEFAULT NOW()
 * );
 * 
 * 3. URL ve Key'i alın (Settings > API)
 */

const SchengenRandevu = require('../index');

async function supabaseOrnegi() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  SUPABASE KULLANIM ÖRNEĞİ');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // ⚠️ Kendi Supabase bilgilerinizi girin
  const SUPABASE_URL = 'https://your-project.supabase.co';
  const SUPABASE_KEY = 'your-anon-key';

  if (SUPABASE_URL === 'https://your-project.supabase.co') {
    console.log('⚠️  Lütfen Supabase URL ve Key\'i güncelleyin!');
    console.log('   Dosya: examples/supabase-example.js');
    console.log('   Satır: 32-33\n');
    return;
  }

  // Supabase ile SchengenRandevu oluştur
  const schengen = new SchengenRandevu({
    sehir: 'ankara',
    database: {
      type: 'supabase',
      config: {
        url: SUPABASE_URL,
        key: SUPABASE_KEY,
        table: 'randevular'
      }
    }
  });

  try {
    // 1. Veritabanına bağlan
    console.log('1. Supabase\'e bağlanılıyor...');
    await schengen.connectDatabase();
    console.log('   ✓ Bağlantı başarılı\n');

    // 2. Randevu oluştur ve kaydet
    console.log('2. Randevu oluşturuluyor ve Supabase\'e kaydediliyor...');
    const randevu = schengen.randevuOlustur({
      ad: 'Ayşe',
      soyad: 'Demir',
      pasaportNo: 'U87654321',
      dogumTarihi: '1995-08-22',
      ulke: 'fransa',
      vizeTipi: 'iş',
      randevuTarihi: '2025-11-25',
      randevuSaati: '14:00'
    });

    const saved = await schengen.saveToDatabase(randevu);
    console.log('   ✓ Randevu kaydedildi');
    console.log('   Supabase ID:', saved.id);
    console.log('   Referans No:', saved.referansNo);
    console.log();

    // 3. Veritabanından oku
    console.log('3. Supabase\'den randevu okunuyor...');
    const retrieved = await schengen.getFromDatabase(saved.referansNo);
    console.log('   ✓ Randevu bulundu');
    console.log('   Ad:', retrieved.ad, retrieved.soyad);
    console.log('   Ülke:', retrieved.ulke.toUpperCase());
    console.log();

    // 4. Güncelle
    console.log('4. Randevu güncelleniyor...');
    const updated = await schengen.updateInDatabase(saved.referansNo, {
      durum: 'onaylandı'
    });
    console.log('   ✓ Durum güncellendi:', updated.durum);
    console.log();

    // 5. Tüm randevuları listele
    console.log('5. Tüm randevular listeleniyor...');
    const all = await schengen.getAllFromDatabase();
    console.log(`   ✓ Toplam ${all.length} randevu bulundu`);
    all.slice(0, 5).forEach((r, i) => {
      console.log(`   ${i + 1}. ${r.ad} ${r.soyad} - ${r.ulke.toUpperCase()} (${r.durum})`);
    });
    if (all.length > 5) {
      console.log(`   ... ve ${all.length - 5} randevu daha`);
    }
    console.log();

    // 6. Ülkeye göre filtrele
    console.log('6. Fransa randevuları filtreleniyor...');
    const fransaRandevular = await schengen.database.getRandevularByUlke('fransa');
    console.log(`   ✓ ${fransaRandevular.length} Fransa randevusu bulundu\n`);

    // 7. Sil
    console.log('7. Randevu siliniyor...');
    await schengen.deleteFromDatabase(saved.referansNo);
    console.log('   ✓ Randevu silindi\n');

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  İŞLEMLER TAMAMLANDI');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('\n💡 İpucu: Supabase Dashboard\'dan verileri görüntüleyebilirsiniz');

  } catch (error) {
    console.error('Hata:', error.message);
    
    if (error.message.includes('Invalid API key')) {
      console.log('\n⚠️  Supabase API key hatalı.');
      console.log('Doğru key\'i Settings > API\'den alın.');
    }
  }
}

// Çalıştır
supabaseOrnegi();
