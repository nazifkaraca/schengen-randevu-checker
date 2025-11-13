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

## 📖 Detaylı Dokümantasyon

Daha fazla bilgi için `API_DOCS.md` dosyasına bakın.
