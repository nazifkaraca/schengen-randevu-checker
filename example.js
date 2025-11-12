/**
 * Schengen Vize Randevu Modülü Kullanım Örneği
 */

const SchengenRandevu = require('./index');

async function ornekKullanim() {
  console.log('=== Schengen Vize Randevu Sistemi ===\n');

  // Yeni randevu yöneticisi oluştur
  const schengen = new SchengenRandevu({
    sehir: 'ankara'
  });

  // 1. Schengen ülkelerini listele
  console.log('1. Schengen Ülkeleri:');
  console.log(schengen.schengenUlkeleriListele().join(', '));
  console.log();

  // 2. Desteklenen vize merkezlerini göster
  console.log('2. Tüm Vize Merkezleri (ilk 10):');
  schengen.vizeMerkezleriListele().slice(0, 10).forEach(merkez => {
    console.log(`   ${merkez.ulke.toUpperCase()}: ${merkez.tip} - ${merkez.sehirler.join(', ')}`);
  });
  console.log(`   ... ve ${schengen.vizeMerkezleriListele().length - 10} ülke daha`);
  console.log();

  // 3. Almanya için müsait randevu kontrolü
  console.log('3. Almanya için randevu kontrolü yapılıyor...');
  const almanyaRandevu = await schengen.musaitRandevuKontrol('almanya');
  console.log('   Durum:', almanyaRandevu.durum);
  console.log('   Mesaj:', almanyaRandevu.mesaj);
  if (almanyaRandevu.tarihler && almanyaRandevu.tarihler.length > 0) {
    console.log('   Müsait tarihler:');
    almanyaRandevu.tarihler.slice(0, 3).forEach(t => {
      console.log(`     - ${t.tarih} ${t.saat}`);
    });
  }
  console.log();

  // 4. İspanya için müsait randevu kontrolü
  console.log('4. İspanya için randevu kontrolü yapılıyor...');
  const ispanyaRandevu = await schengen.musaitRandevuKontrol('ispanya');
  console.log('   Durum:', ispanyaRandevu.durum);
  console.log('   Mesaj:', ispanyaRandevu.mesaj);
  console.log();

  // 5. Fransa için müsait randevu kontrolü
  console.log('5. Fransa için randevu kontrolü yapılıyor...');
  const fransaRandevu = await schengen.musaitRandevuKontrol('fransa');
  console.log('   Durum:', fransaRandevu.durum);
  console.log('   Mesaj:', fransaRandevu.mesaj);
  console.log();

  // 6. Randevu oluştur
  console.log('6. Almanya için randevu oluşturuluyor...');
  const randevu1 = schengen.randevuOlustur({
    ad: 'Ahmet',
    soyad: 'Yılmaz',
    pasaportNo: 'U12345678',
    dogumTarihi: '1990-05-15',
    ulke: 'almanya',
    sehir: 'ankara',
    vizeTipi: 'turist',
    randevuTarihi: '2025-12-20',
    randevuSaati: '10:00'
  });
  console.log('   Randevu oluşturuldu!');
  console.log('   Referans No:', randevu1.referansNo);
  console.log('   Tarih:', randevu1.randevuTarihi.toLocaleDateString('tr-TR'));
  console.log();

  // 7. İkinci randevu oluştur
  console.log('7. İspanya için randevu oluşturuluyor...');
  const randevu2 = schengen.randevuOlustur({
    ad: 'Ayşe',
    soyad: 'Demir',
    pasaportNo: 'U87654321',
    dogumTarihi: '1995-08-22',
    ulke: 'ispanya',
    vizeTipi: 'iş',
    randevuTarihi: '2025-12-25',
    randevuSaati: '14:00'
  });
  console.log('   Randevu oluşturuldu!');
  console.log('   Referans No:', randevu2.referansNo);
  console.log();

  // 8. Randevu sorgula (referans no ile)
  console.log('8. Referans no ile randevu sorgulama:');
  const sorgu = schengen.randevuSorgula(randevu1.referansNo);
  console.log(`   ${sorgu.ad} ${sorgu.soyad} - ${sorgu.ulke.toUpperCase()}`);
  console.log(`   Durum: ${sorgu.durum}`);
  console.log();

  // 9. Ülkeye göre filtrele
  console.log('9. Almanya randevuları:');
  const almanyaRandevulari = schengen.ulkeyeGoreFiltrele('almanya');
  almanyaRandevulari.forEach(r => {
    console.log(`   - ${r.ad} ${r.soyad} (${r.referansNo})`);
  });
  console.log();

  // 10. Schengen kontrolü
  console.log('10. Ülke Schengen kontrolü:');
  console.log('   İngiltere Schengen mi?', schengen.schengenMi('ingiltere') ? 'Evet' : 'Hayır');
  console.log('   Almanya Schengen mi?', schengen.schengenMi('almanya') ? 'Evet' : 'Hayır');
  console.log();

  // 11. Belirli bir ülke için vize merkezi bilgisi
  console.log('11. Almanya vize merkezi detayları:');
  const almanyaBilgi = schengen.vizeMerkeziBilgisi('almanya');
  console.log('   Tip:', almanyaBilgi.tip);
  console.log('   Şehirler:', almanyaBilgi.sehirler.join(', '));
  console.log('   Ankara Tel:', almanyaBilgi.telefonlar.ankara);
  console.log('   URL:', almanyaBilgi.url);
  console.log();

  // 12. Şehre göre vize merkezleri
  console.log('12. İstanbul\'da bulunan vize merkezleri:');
  const istanbulMerkezleri = schengen.sehreGoreVizeMerkezleri('istanbul');
  console.log(`   Toplam ${istanbulMerkezleri.length} ülke:`);
  istanbulMerkezleri.slice(0, 5).forEach(merkez => {
    console.log(`   - ${merkez.ulke.toUpperCase()}: ${merkez.telefon || 'Tel bilgisi yok'}`);
  });
  console.log(`   ... ve ${istanbulMerkezleri.length - 5} ülke daha`);
  console.log();

  console.log('=== İşlemler tamamlandı ===');
  console.log(`Toplam ${schengen.schengenUlkeleriListele().length} Schengen ülkesi destekleniyor!`);
}

// Örneği çalıştır
ornekKullanim().catch(console.error);
