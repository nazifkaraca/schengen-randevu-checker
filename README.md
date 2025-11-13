# Schengen Randevu Checker 🇪🇺

> Schengen visa appointment checker and manager for Turkey - Real-time availability check for 25 countries

[![npm version](https://img.shields.io/npm/v/schengen-randevu-checker.svg)](https://www.npmjs.com/package/schengen-randevu-checker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Türkiye'deki Schengen ülkeleri vize merkezleri için randevu kontrolü ve yönetimi yapan Node.js modülü.

## ✨ Özellikler

- 🌍 **25 Schengen Ülkesi** - Tüm Schengen ülkeleri destekleniyor
- 🔍 **Gerçek Zamanlı Kontrol** - HTTP istekleri ile site erişilebilirlik kontrolü
- 📍 **Şehir Bazlı** - Ankara, İstanbul, İzmir ve diğer şehirler
- 📞 **İletişim Bilgileri** - Telefon numaraları ve URL'ler
- 🔄 **Toplu Kontrol** - Birden fazla ülkeyi aynı anda kontrol
- 📝 **Randevu Yönetimi** - Randevu oluşturma, sorgulama, iptal

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

### Randevu Yönetimi

```javascript
// Randevu oluştur
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

console.log('Referans No:', randevu.referansNo);

// Randevu sorgula
const bulunan = schengen.randevuSorgula(randevu.referansNo);

// Randevu iptal et
schengen.randevuIptal(randevu.referansNo);
```

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
Yeni randevu kaydı oluşturur.

#### `randevuSorgula(idVeyaReferans)`
ID veya referans numarası ile randevu sorgular.

#### `randevuIptal(idVeyaReferans)`
Randevuyu iptal eder.

## 🎯 Örnek Kullanım

```bash
# Demo
npm test

# Gerçek kontrol
npm run kontrol

# Toplu kontrol
npm run toplu-kontrol
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
