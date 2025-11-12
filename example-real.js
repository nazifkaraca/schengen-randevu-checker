/**
 * Schengen Vize Randevu Modülü - Gerçek Kontrol Örneği
 */

const SchengenRandevu = require('./index');

async function gercekKontrolOrnegi() {
  console.log('=== Schengen Vize Randevu - Gerçek Kontrol ===\n');

  const schengen = new SchengenRandevu({
    sehir: 'ankara'
  });

  // 1. Tek bir ülke için gerçek kontrol
  console.log('1. Almanya için gerçek randevu kontrolü yapılıyor...');
  console.log('   (Bu işlem 10 saniye kadar sürebilir)\n');
  
  try {
    const almanya = await schengen.musaitRandevuKontrol('almanya', {
      sehir: 'ankara',
      vizeTipi: 'turist'
    });
    
    console.log('   Sonuç:');
    console.log('   - Ülke:', almanya.ulke.toUpperCase());
    console.log('   - Durum:', almanya.durum);
    console.log('   - Mesaj:', almanya.mesaj);
    console.log('   - Site Erişilebilir:', almanya.siteErisilebilir ? 'Evet' : 'Hayır');
    if (almanya.httpDurum) {
      console.log('   - HTTP Durum:', almanya.httpDurum);
    }
    console.log('   - URL:', almanya.url);
    console.log('   - Kontrol Zamanı:', almanya.kontrolTarihi.toLocaleString('tr-TR'));
    if (almanya.not) {
      console.log('   - Not:', almanya.not);
    }
    console.log();
  } catch (error) {
    console.log('   Hata:', error.message);
    console.log();
  }

  // 2. İspanya için kontrol
  console.log('2. İspanya için gerçek randevu kontrolü yapılıyor...\n');
  
  try {
    const ispanya = await schengen.musaitRandevuKontrol('ispanya', {
      sehir: 'ankara'
    });
    
    console.log('   Sonuç:');
    console.log('   - Ülke:', ispanya.ulke.toUpperCase());
    console.log('   - Durum:', ispanya.durum);
    console.log('   - Mesaj:', ispanya.mesaj);
    console.log('   - Site Erişilebilir:', ispanya.siteErisilebilir ? 'Evet' : 'Hayır');
    console.log('   - URL:', ispanya.url);
    console.log();
  } catch (error) {
    console.log('   Hata:', error.message);
    console.log();
  }

  // 3. Fransa için kontrol
  console.log('3. Fransa için gerçek randevu kontrolü yapılıyor...\n');
  
  try {
    const fransa = await schengen.musaitRandevuKontrol('fransa');
    
    console.log('   Sonuç:');
    console.log('   - Ülke:', fransa.ulke.toUpperCase());
    console.log('   - Durum:', fransa.durum);
    console.log('   - Mesaj:', fransa.mesaj);
    console.log('   - Site Erişilebilir:', fransa.siteErisilebilir ? 'Evet' : 'Hayır');
    console.log();
  } catch (error) {
    console.log('   Hata:', error.message);
    console.log();
  }

  console.log('=== Kontroller tamamlandı ===');
  console.log('\nÖNEMLİ NOTLAR:');
  console.log('- Bu kontroller site erişilebilirliğini test eder');
  console.log('- Kesin randevu bilgisi için resmi siteleri ziyaret edin');
  console.log('- Bazı siteler bot koruması kullanabilir');
  console.log('- Rate limiting nedeniyle kontroller yavaş olabilir');
}

// Toplu kontrol örneği
async function topluKontrolOrnegi() {
  console.log('\n\n=== Toplu Ülke Kontrolü ===\n');
  
  const schengen = new SchengenRandevu();
  
  const ulkeler = ['almanya', 'fransa', 'ispanya', 'italya', 'hollanda'];
  
  console.log(`${ulkeler.length} ülke kontrol edilecek...`);
  console.log('Her ülke arasında 2 saniye bekleniyor (rate limiting)\n');
  
  const sonuclar = await schengen.topluRandevuKontrol(ulkeler, {
    sehir: 'ankara'
  });
  
  console.log('\n=== Toplu Kontrol Sonuçları ===\n');
  
  sonuclar.forEach((sonuc, index) => {
    console.log(`${index + 1}. ${sonuc.ulke.toUpperCase()}`);
    console.log(`   Durum: ${sonuc.durum}`);
    console.log(`   Mesaj: ${sonuc.mesaj}`);
    console.log(`   Site: ${sonuc.siteErisilebilir ? '✓ Erişilebilir' : '✗ Erişim sorunu'}`);
    console.log();
  });
}

// Ana fonksiyon
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--toplu')) {
    await topluKontrolOrnegi();
  } else {
    await gercekKontrolOrnegi();
  }
}

// Çalıştır
main().catch(error => {
  console.error('Beklenmeyen hata:', error.message);
  process.exit(1);
});
