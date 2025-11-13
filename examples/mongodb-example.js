/**
 * MongoDB Kullanım Örneği
 * 
 * Kurulum:
 * npm install mongodb
 * 
 * MongoDB'nin çalışıyor olması gerekir:
 * mongod --dbpath /path/to/data
 */

const SchengenRandevu = require('../index');

async function mongodbOrnegi() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  MONGODB KULLANIM ÖRNEĞİ');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // MongoDB ile SchengenRandevu oluştur
  const schengen = new SchengenRandevu({
    sehir: 'ankara',
    database: {
      type: 'mongodb',
      config: {
        uri: 'mongodb://localhost:27017',
        database: 'schengen_randevu',
        collection: 'randevular'
      }
    }
  });

  try {
    // 1. Veritabanına bağlan
    console.log('1. MongoDB\'ye bağlanılıyor...');
    await schengen.connectDatabase();
    console.log('   ✓ Bağlantı başarılı\n');

    // 2. Randevu oluştur ve kaydet
    console.log('2. Randevu oluşturuluyor ve MongoDB\'ye kaydediliyor...');
    const randevu = schengen.randevuOlustur({
      ad: 'Ahmet',
      soyad: 'Yılmaz',
      pasaportNo: 'U12345678',
      dogumTarihi: '1990-05-15',
      ulke: 'almanya',
      vizeTipi: 'turist',
      randevuTarihi: '2025-12-20',
      randevuSaati: '10:00'
    });

    const saved = await schengen.saveToDatabase(randevu);
    console.log('   ✓ Randevu kaydedildi');
    console.log('   MongoDB ID:', saved._id);
    console.log('   Referans No:', saved.referansNo);
    console.log();

    // 3. Veritabanından oku
    console.log('3. Veritabanından randevu okunuyor...');
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
    all.forEach((r, i) => {
      console.log(`   ${i + 1}. ${r.ad} ${r.soyad} - ${r.ulke.toUpperCase()} (${r.durum})`);
    });
    console.log();

    // 6. Sil
    console.log('6. Randevu siliniyor...');
    await schengen.deleteFromDatabase(saved.referansNo);
    console.log('   ✓ Randevu silindi\n');

    // 7. Bağlantıyı kapat
    console.log('7. Bağlantı kapatılıyor...');
    await schengen.disconnectDatabase();
    console.log('   ✓ Bağlantı kapatıldı\n');

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  İŞLEMLER TAMAMLANDI');
    console.log('═══════════════════════════════════════════════════════════════');

  } catch (error) {
    console.error('Hata:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n⚠️  MongoDB çalışmıyor olabilir.');
      console.log('MongoDB\'yi başlatmak için:');
      console.log('  mongod --dbpath /path/to/data');
    }
  }
}

// Çalıştır
mongodbOrnegi();
