# Schengen Randevu Checker 🇪🇺

> Schengen visa center information and personal appointment record manager for Turkey - Educational tool for 25 countries

[![npm version](https://img.shields.io/npm/v/schengen-randevu-checker.svg)](https://www.npmjs.com/package/schengen-randevu-checker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚨 ÖNEMLİ UYARI - LÜTFEN OKUYUN!

**Bu modül resmi randevu OLUŞTURMAZ ve otomatik randevu ARAMAZ!**

✅ **Ne yapar:**
- Vize merkezi iletişim bilgilerini listeler (telefon, adres, URL)
- Aldığınız randevu bilgilerini kişisel kayıtlarınızda saklar
- Randevu takibi ve hatırlatma için kullanılır

❌ **Ne yapmaz:**
- Resmi randevu oluşturmaz
- Otomatik randevu aramaz
- Sitelere sürekli istek göndermez
- Bot/scraping yapmaz

**Resmi randevu almak için mutlaka resmi kanalları kullanın!**

---

Türkiye'deki Schengen ülkeleri vize merkezleri için bilgi yönetimi ve kişisel randevu takibi yapan Node.js modülü.

## ✨ Özellikler

- 🌍 **25 Schengen Ülkesi** - Tüm Schengen ülkeleri destekleniyor
- 🔍 **Gerçek Zamanlı Kontrol** - HTTP istekleri ile site erişilebilirlik kontrolü
- 📍 **Şehir Bazlı** - Ankara, İstanbul, İzmir ve diğer şehirler
- 📞 **İletişim Bilgileri** - Telefon numaraları ve URL'ler
- 🔄 **Toplu Kontrol** - Birden fazla ülkeyi aynı anda kontrol
- 📝 **Kişisel Kayıt Yönetimi** - Aldığınız randevu bilgilerini kaydetme, sorgulama (resmi randevu oluşturmaz!)
- 🗄️ **Veritabanı Desteği** - MongoDB ve Supabase entegrasyonu
- 📊 **İstatistikler** - Randevu analizi ve raporlama
- 💾 **Export/Import** - JSON ve CSV formatında veri aktarımı

## 📦 Kurulum

```bash
npm install schengen-randevu-checker
```

## 🚀 Hızlı Başlangıç

```javascript
const SchengenRandevu = require('schengen-randevu-checker');

const schengen = new SchengenRandevu({
  sehir: 'ankara'
});

// Schengen ülkelerini listele
const ulkeler = schengen.schengenUlkeleriListele();
console.log('Schengen Ülkeleri:', ulkeler);

// Gerçek randevu kontrolü
const sonuc = await schengen.musaitRandevuKontrol('almanya');
console.log('Durum:', sonuc.durum);
console.log('Site Erişilebilir:', sonuc.siteErisilebilir);
```

## 📖 Kullanım

### Temel Kontrol

```javascript
async function randevuKontrol() {
  const schengen = new SchengenRandevu();
  
  const sonuc = await schengen.musaitRandevuKontrol('almanya', {
    sehir: 'ankara',
    vizeTipi: 'turist'
  });
  
  console.log(sonuc);
  // {
  //   ulke: 'almanya',
  //   durum: 'musait-olabilir',
  //   mesaj: 'Randevu sistemi aktif',
  //   siteErisilebilir: true,
  //   url: 'https://...'
  // }
}
```

### Toplu Kontrol

```javascript
const ulkeler = ['almanya', 'fransa', 'ispanya', 'italya'];
const sonuclar = await schengen.topluRandevuKontrol(ulkeler);

sonuclar.forEach(sonuc => {
  console.log(`${sonuc.ulke}: ${sonuc.durum}`);
});
```

### Vize Merkezi Bilgileri

```javascript
// Belirli bir ülke için bilgi
const almanyaBilgi = schengen.vizeMerkeziBilgisi('almanya');
console.log(almanyaBilgi);

// Şehre göre filtrele
const istanbulMerkezleri = schengen.sehreGoreVizeMerkezleri('istanbul');
console.log(`İstanbul'da ${istanbulMerkezleri.length} ülke`);
```

### Kişisel Randevu Kayıt Yönetimi

⚠️ **ÖNEMLİ:** Bu özellik resmi randevu OLUŞTURMAZ! Sadece resmi kanallardan aldığınız randevu bilgilerinizi kaydetmeniz içindir.

```javascript
// ⚠️ UYARI: Bu fonksiyon resmi randevu OLUŞTURMAZ!
// Sadece resmi kanallardan aldığınız randevu bilgilerini 
// kişisel kayıtlarınızda saklamanız içindir.

// Aldığınız randevu bilgilerini kaydedin
const randevuKaydi = schengen.randevuOlustur({
  ad: 'Ahmet',
  soyad: 'Yılmaz',
  pasaportNo: 'U12345678',
  dogumTarihi: '1990-05-15',
  ulke: 'almanya',
  vizeTipi: 'turist',
  randevuTarihi: '2025-12-20', // Resmi siteden aldığınız tarih
  randevuSaati: '10:00'         // Resmi siteden aldığınız saat
});

console.log('Kayıt Referans No:', randevuKaydi.referansNo);

// Kayıtlarınızı sorgulayın
const kayit = schengen.randevuSorgula(randevuKaydi.referansNo);

// Kayıt iptal (sadece bu sistemdeki kaydı siler, resmi randevuyu iptal etmez!)
schengen.randevuIptal(randevuKaydi.referansNo);
```

**Resmi Randevu Almak İçin:**
- Konsolosluk resmi web sitesini kullanın
- VFS Global resmi platformunu kullanın
- BLS International resmi platformunu kullanın
- Telefon randevu hattını arayın

## 🌍 Desteklenen Ülkeler

Almanya, Avusturya, Belçika, Çek Cumhuriyeti, Danimarka, Estonya, Finlandiya, Fransa, Hollanda, İsveç, İsviçre, İspanya, İtalya, İzlanda, Letonya, Litvanya, Lüksemburg, Macaristan, Malta, Norveç, Polonya, Portekiz, Slovakya, Slovenya, Yunanistan

### Vize Merkezleri

- **VFS Global** - 20+ ülke
- **BLS International** - İspanya
- **Konsolosluk** - Almanya, İtalya

### Şehirler

- **Ankara** - 25 ülke
- **İstanbul** - 17 ülke
- **İzmir** - 5 ülke
- **Diğer** - Trabzon, Edirne, Komotini, Rodos

## 📋 API

### Constructor

```javascript
new SchengenRandevu(options)
```

**Parametreler:**
- `options.sehir` (string): Varsayılan şehir (default: 'ankara')

### Metodlar

#### `schengenUlkeleriListele()`
Tüm Schengen ülkelerini döner.

#### `schengenMi(ulke)`
Bir ülkenin Schengen üyesi olup olmadığını kontrol eder.

#### `async musaitRandevuKontrol(ulke, options)`
Gerçek HTTP isteği ile randevu kontrolü yapar.

**Dönen Değerler:**
- `durum`: 'musait-olabilir', 'dolu', 'bilinmiyor', 'hata', 'timeout'
- `siteErisilebilir`: boolean
- `mesaj`: string
- `url`: string

#### `async topluRandevuKontrol(ulkeler, options)`
Birden fazla ülke için sırayla kontrol yapar.

#### `vizeMerkeziBilgisi(ulke)`
Belirli bir ülke için vize merkezi bilgilerini döner.

#### `sehreGoreVizeMerkezleri(sehir)`
Belirtilen şehirdeki vize merkezlerini listeler.

#### `randevuOlustur(randevu)`
⚠️ **Yeni kişisel randevu kaydı oluşturur (resmi randevu OLUŞTURMAZ!)**

Bu fonksiyon sadece resmi kanallardan aldığınız randevu bilgilerini kişisel kayıtlarınızda saklamanız içindir. Resmi randevu almak için mutlaka resmi kanalları kullanın.

#### `randevuSorgula(idVeyaReferans)`
ID veya referans numarası ile randevu sorgular.

#### `randevuIptal(idVeyaReferans)`
Randevuyu iptal eder.

#### `exportJSON()`
Randevuları JSON formatında export eder.

#### `importJSON(jsonString)`
JSON'dan randevuları import eder.

#### `exportCSV()`
Randevuları CSV formatında export eder.

#### `istatistikler()`
Randevu istatistiklerini döner (toplam, aktif, iptal, ülke dağılımı).

#### `yaklasanRandevular(gunSayisi)`
Belirtilen gün sayısı içindeki randevuları döner (default: 30 gün).

#### `durumGuncelle(idVeyaReferans, yeniDurum)`
Randevu durumunu günceller ('beklemede', 'onaylandı', 'reddedildi', 'iptal').

### Veritabanı Metodları

#### `async connectDatabase()`
Veritabanına bağlanır (MongoDB veya Supabase).

#### `async disconnectDatabase()`
Veritabanı bağlantısını kapatır.

#### `async saveToDatabase(randevu)`
Randevuyu veritabanına kaydeder.

#### `async getFromDatabase(id)`
Veritabanından randevu getirir (ID veya referans no ile).

#### `async getAllFromDatabase()`
Veritabanından tüm randevuları getirir.

#### `async updateInDatabase(id, data)`
Veritabanındaki randevuyu günceller.

#### `async deleteFromDatabase(id)`
Veritabanından randevu siler.

#### `async syncToDatabase()`
Lokal randevuları veritabanına senkronize eder.

#### `async syncFromDatabase()`
Veritabanından lokal'e senkronize eder.

## 🎯 Örnek Kullanım

```bash
# Temel demo
npm test

# Yeni özellikler demo (Export/Import, İstatistikler)
npm run demo

# MongoDB örneği
npm run demo:mongodb

# Supabase örneği
npm run demo:supabase

# Gerçek site kontrolü
npm run kontrol

# Toplu kontrol
npm run toplu-kontrol
```

## 🆕 Yeni Özellikler (v1.2.0+)

### 🗄️ Veritabanı Desteği

MongoDB ve Supabase ile randevularınızı kalıcı olarak saklayın!

#### MongoDB Kullanımı

```javascript
const SchengenRandevu = require('schengen-randevu-checker');

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

// Bağlan
await schengen.connectDatabase();

// Randevu oluştur ve kaydet
const randevu = schengen.randevuOlustur({...});
await schengen.saveToDatabase(randevu);

// Veritabanından oku
const all = await schengen.getAllFromDatabase();

// Bağlantıyı kapat
await schengen.disconnectDatabase();
```

#### Supabase Kullanımı

```javascript
const schengen = new SchengenRandevu({
  database: {
    type: 'supabase',
    config: {
      url: 'https://your-project.supabase.co',
      key: 'your-anon-key',
      table: 'randevular'
    }
  }
});

await schengen.connectDatabase();
await schengen.saveToDatabase(randevu);
const all = await schengen.getAllFromDatabase();
```

**Kurulum:**
```bash
# MongoDB için
npm install mongodb

# Supabase için
npm install @supabase/supabase-js
```

**Örnekler:**
- `examples/mongodb-example.js` - MongoDB kullanım örneği
- `examples/supabase-example.js` - Supabase kullanım örneği

### Export/Import

```javascript
// JSON Export
const jsonData = schengen.exportJSON();
fs.writeFileSync('randevular.json', jsonData);

// JSON Import
const jsonString = fs.readFileSync('randevular.json', 'utf8');
const sonuc = schengen.importJSON(jsonString);

// CSV Export
const csvData = schengen.exportCSV();
fs.writeFileSync('randevular.csv', csvData);
```

### İstatistikler

```javascript
const stats = schengen.istatistikler();
console.log(stats);
// {
//   toplamRandevu: 5,
//   aktifRandevu: 3,
//   iptalRandevu: 1,
//   onaylananRandevu: 1,
//   ulkeDagilim: { almanya: 3, fransa: 2 },
//   enCokBasvurulan: 'almanya'
// }
```

### Yaklaşan Randevular

```javascript
// 30 gün içindeki randevular
const yaklasan = schengen.yaklasanRandevular(30);
yaklasan.forEach(r => {
  console.log(`${r.ad}: ${r.randevuTarihi}`);
});
```

### Durum Güncelleme

```javascript
// Randevu durumunu güncelle
schengen.durumGuncelle(randevuId, 'onaylandı');
// Durumlar: 'beklemede', 'onaylandı', 'reddedildi', 'iptal'
```

## ⚠️ ÖNEMLİ YASAL UYARI

**🚨 BU MODÜLÜ KULLANMADAN ÖNCE MUTLAKA OKUYUN:**

### Yasal Sorumluluk

Bu modül **sadece eğitim ve bilgilendirme amaçlıdır**. Resmi konsolosluk ve vize merkezi web sitelerine otomatik erişim yapmak:

- ❌ **Hizmet şartlarına aykırı olabilir**
- ❌ **Yasal sorunlara yol açabilir**
- ❌ **Hesap yasaklanmasına neden olabilir**
- ❌ **IP adresinizin engellenmesine sebep olabilir**

### Kullanım Kısıtlamaları

Bu modül:
- ✅ Vize merkezi bilgilerini (telefon, adres, URL) listelemek için kullanılabilir
- ✅ Kendi randevu kayıtlarınızı yönetmek için kullanılabilir
- ❌ **Resmi sitelere otomatik bot istekleri göndermek için KULLANILMAMALIDIR**
- ❌ **Randevu bulmak için sürekli site taraması yapmak için KULLANILMAMALIDIR**

### Önerilen Kullanım

1. **Bilgi Amaçlı:** Vize merkezi iletişim bilgilerini öğrenmek
2. **Kişisel Kayıt:** Kendi randevu bilgilerinizi kaydetmek
3. **Eğitim:** Node.js ve HTTP istekleri öğrenmek

### Resmi Randevu İçin

Randevu almak için **mutlaka** resmi kanalları kullanın:
- Konsolosluk resmi web siteleri
- VFS Global resmi platformu
- BLS International resmi platformu
- Telefon ile randevu hattı

## ⚠️ Teknik Notlar

- Bu modül site erişilebilirliğini kontrol eder
- Kesin randevu bilgisi için resmi siteleri ziyaret edin
- Bazı siteler bot koruması (CAPTCHA) kullanabilir
- Rate limiting nedeniyle toplu kontrollerde bekleme süreleri vardır
- Timeout süresi 10 saniyedir

## 🤝 Katkıda Bulunma

Pull request'ler kabul edilir. Büyük değişiklikler için önce bir issue açın.

## 📄 Lisans

MIT

## 🔗 Bağlantılar

- [GitHub Repository](https://github.com/ibidi/schengen-randevu-checker)
- [npm Package](https://www.npmjs.com/package/schengen-randevu-checker)
- [Issues](https://github.com/ibidi/schengen-randevu-checker/issues)

---

## 📜 Sorumluluk Reddi (Disclaimer)

**BU YAZILIM "OLDUĞU GİBİ" SAĞLANMAKTADIR.**

Yazar ve katkıda bulunanlar:
- Bu yazılımın kullanımından kaynaklanan hiçbir yasal sorumluluk kabul etmez
- Herhangi bir garanti vermez
- Kullanıcıların yerel yasalara ve hizmet şartlarına uygun hareket etmesini bekler

**Kullanıcı Sorumluluğu:**
- Bu modülü kullanarak, tüm yasal sorumluluğu kabul etmiş olursunuz
- Resmi web sitelerinin hizmet şartlarına uymak sizin sorumluluğunuzdadır
- Otomatik bot kullanımı yasak olan sitelere erişim yapmayın

**Önerilen Kullanım:**
Bu modülü sadece bilgi edinme, eğitim ve kişisel kayıt yönetimi için kullanın. Resmi randevu işlemleri için mutlaka resmi kanalları kullanın.

---

**Not:** Bu modül bilgilendirme ve eğitim amaçlıdır. Resmi vize başvuruları için ilgili konsolosluk ve vize merkezlerinin resmi sitelerini kullanın.
