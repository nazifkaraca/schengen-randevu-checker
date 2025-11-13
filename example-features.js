/**
 * Schengen Randevu Checker - Yeni Özellikler Demo
 * v1.1.0 özellikleri
 */

const SchengenRandevu = require('./index');
const fs = require('fs');

async function yeniOzelliklerDemo() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  SCHENGEN RANDEVU CHECKER - YENİ ÖZELLİKLER DEMO');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const schengen = new SchengenRandevu({ sehir: 'ankara' });

  // ⚠️ NOT: Bu örnekler kişisel kayıt yönetimini gösterir
  // Resmi randevu oluşturmaz! Sadece aldığınız randevu bilgilerini kaydeder.
  console.log('1. Kişisel Randevu Kayıtları Oluşturuluyor...\n');
  console.log('   ⚠️  Bu resmi randevu OLUŞTURMAZ!');
  console.log('   ✓  Sadece aldığınız randevu bilgilerini kaydeder\n');

  const randevu1 = schengen.randevuOlustur({
    ad: 'Ahmet',
    soyad: 'Yılmaz',
    pasaportNo: 'U12345678',
    dogumTarihi: '1990-05-15',
    ulke: 'almanya',
    vizeTipi: 'turist',
    randevuTarihi: '2025-12-20',
    randevuSaati: '10:00'
  });

  const randevu2 = schengen.randevuOlustur({
    ad: 'Ayşe',
    soyad: 'Demir',
    pasaportNo: 'U87654321',
    dogumTarihi: '1995-08-22',
    ulke: 'fransa',
    vizeTipi: 'iş',
    randevuTarihi: '2025-11-25',
    randevuSaati: '14:00'
  });

  const randevu3 = schengen.randevuOlustur({
    ad: 'Mehmet',
    soyad: 'Kaya',
    pasaportNo: 'U11223344',
    dogumTarihi: '1988-03-10',
    ulke: 'almanya',
    vizeTipi: 'öğrenci',
    randevuTarihi: '2025-11-20',
    randevuSaati: '09:00'
  });

  console.log(`✓ ${schengen.randevular.length} kişisel kayıt oluşturuldu\n`);

  // 2. İstatistikler
  console.log('2. İstatistikler:\n');
  const stats = schengen.istatistikler();
  console.log('   Toplam Randevu:', stats.toplamRandevu);
  console.log('   Aktif Randevu:', stats.aktifRandevu);
  console.log('   İptal Edilen:', stats.iptalRandevu);
  console.log('   Onaylanan:', stats.onaylananRandevu);
  console.log('   En Çok Başvurulan:', stats.enCokBasvurulan?.toUpperCase() || 'Yok');
  console.log('   Ülke Dağılımı:', stats.ulkeDagilim);
  console.log();

  // 3. Yaklaşan randevular
  console.log('3. Yaklaşan Randevular (30 gün içinde):\n');
  const yaklasan = schengen.yaklasanRandevular(30);
  yaklasan.forEach(r => {
    const tarih = r.randevuTarihi.toLocaleDateString('tr-TR');
    console.log(`   - ${r.ad} ${r.soyad}: ${r.ulke.toUpperCase()} - ${tarih} ${r.randevuSaati}`);
  });
  console.log();

  // 4. Durum güncelleme
  console.log('4. Randevu Durumu Güncelleme:\n');
  schengen.durumGuncelle(randevu1.referansNo, 'onaylandı');
  console.log(`   ✓ ${randevu1.referansNo} durumu "onaylandı" olarak güncellendi`);
  console.log();

  // 5. JSON Export
  console.log('5. JSON Export:\n');
  const jsonData = schengen.exportJSON();
  fs.writeFileSync('randevular.json', jsonData);
  console.log('   ✓ Randevular "randevular.json" dosyasına kaydedildi');
  console.log(`   ✓ Dosya boyutu: ${(jsonData.length / 1024).toFixed(2)} KB`);
  console.log();

  // 6. CSV Export
  console.log('6. CSV Export:\n');
  const csvData = schengen.exportCSV();
  fs.writeFileSync('randevular.csv', csvData);
  console.log('   ✓ Randevular "randevular.csv" dosyasına kaydedildi');
  console.log(`   ✓ Satır sayısı: ${csvData.split('\n').length}`);
  console.log();

  // 7. JSON Import Test
  console.log('7. JSON Import Test:\n');
  const yeniSchengen = new SchengenRandevu();
  const importSonuc = yeniSchengen.importJSON(jsonData);
  console.log('   ✓', importSonuc.mesaj);
  console.log('   ✓ Eski sayı:', importSonuc.eskiSayi);
  console.log('   ✓ Yeni sayı:', importSonuc.yeniSayi);
  console.log();

  // 8. Güncellenmiş istatistikler
  console.log('8. Güncellenmiş İstatistikler:\n');
  const yeniStats = schengen.istatistikler();
  console.log('   Toplam:', yeniStats.toplamRandevu);
  console.log('   Aktif:', yeniStats.aktifRandevu);
  console.log('   Onaylanan:', yeniStats.onaylananRandevu);
  console.log();

  // 9. Dosya içeriği önizleme
  console.log('9. JSON Dosya İçeriği (İlk 5 satır):\n');
  const jsonLines = jsonData.split('\n').slice(0, 5);
  jsonLines.forEach(line => console.log('   ' + line));
  console.log('   ...\n');

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  YENİ ÖZELLİKLER:');
  console.log('  ✓ İstatistikler');
  console.log('  ✓ Yaklaşan randevular');
  console.log('  ✓ Durum güncelleme');
  console.log('  ✓ JSON Export/Import');
  console.log('  ✓ CSV Export');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('Oluşturulan dosyalar:');
  console.log('  - randevular.json');
  console.log('  - randevular.csv');
  console.log();
}

// Çalıştır
yeniOzelliklerDemo().catch(console.error);
