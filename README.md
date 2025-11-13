# 🔍 Schengen Randevu Checker

[![npm version](https://img.shields.io/npm/v/schengen-randevu-checker.svg)](https://www.npmjs.com/package/schengen-randevu-checker)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Modern TypeScript library for checking Schengen visa appointment availability across 17+ countries. Built with type safety, rate limiting, and error handling.

## ⚠️ Legal Disclaimer

**This library is for educational and informational purposes only.**

- ❌ Does NOT create official appointments
- ❌ Does NOT automate booking systems
- ❌ Does NOT interfere with embassy systems

**Always use official channels for visa appointments!**

## 🚀 Installation

```bash
npm install schengen-randevu-checker
```

# Swagger API Dokümantasyonu - Hızlı Başlangıç

## 🚀 Kurulum ve Başlatma

### 1. Sunucuyu Başlat

```bash
npm run server
```

### 2. Swagger UI'ı Aç

Tarayıcınızda şu adresi açın:

```
http://localhost:3000/api-docs
```

## 📚 Swagger UI Kullanımı

### Endpoint Test Etme

1. Swagger UI'da test etmek istediğiniz endpoint'i seçin
2. "Try it out" butonuna tıklayın
3. Gerekli parametreleri doldurun
4. "Execute" butonuna tıklayın
5. Response'u inceleyin

### Örnek: Randevu Kontrolü

1. `POST /api/randevu-kontrol` endpoint'ini aç
2. "Try it out" tıkla
3. Request body'yi düzenle:

```json
{
  "ulke": "almanya",
  "sehir": "ankara",
  "vizeTipi": "turist"
}
```

4. "Execute" tıkla
5. Sonuçları gör

## 🔍 Mevcut Endpoint'ler

- **GET** `/api/schengen-kontrol` - Schengen kontrolü
- **POST** `/api/randevu-kontrol` - Tek ülke randevu kontrolü
- **POST** `/api/toplu-kontrol` - Çoklu ülke kontrolü
- **POST** `/api/tum-ulkeler-kontrol` - Tüm ülkeler
- **GET** `/api/vize-merkezi/{ulke}` - Vize merkezi bilgisi
- **GET** `/api/vize-merkezleri` - Tüm vize merkezleri
- **GET** `/api/vize-merkezleri/sehir/{sehir}` - Şehre göre merkezler

## 💡 İpuçları

- Her endpoint için örnek request/response görebilirsiniz
- Schema bilgileri otomatik gösterilir
- Direkt tarayıcıdan test edebilirsiniz
- JSON formatında response alırsınız

## 👨‍💻 Author

**İhsan Baki Doğan**

- Email: info@ihsanbakidogan.com
- GitHub: [@ibidi](https://github.com/ibidi)

## 👨‍💻 Contributor

**Nazif Karaca**

- Email: nazif808@gmail.com
- GitHub: [@nazif](https://github.com/nazifkaraca)

---

⭐ If you find this library helpful, please give it a star on GitHub!
