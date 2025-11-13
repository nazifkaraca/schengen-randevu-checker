/**
 * Schengen Vize Randevu Modülü
 * 
 * ⚠️ YASAL UYARI:
 * Bu modül sadece eğitim ve bilgilendirme amaçlıdır.
 * Resmi konsolosluk ve vize merkezi sitelerine otomatik bot istekleri
 * göndermek hizmet şartlarına aykırı olabilir ve yasal sorunlara yol açabilir.
 * 
 * Kullanım Amacı:
 * - Vize merkezi iletişim bilgilerini listelemek
 * - Kişisel randevu kayıtlarını yönetmek
 * - Eğitim ve öğrenme
 * 
 * KULLANMAYIN:
 * - Otomatik randevu taraması için
 * - Sürekli site kontrolü için
 * - Bot/scraping amaçlı
 * 
 * Resmi randevu işlemleri için mutlaka resmi kanalları kullanın.
 */

const axios = require('axios');

class SchengenRandevu {
  constructor(options = {}) {
    this.ulke = options.ulke || null;
    this.sehir = options.sehir || 'ankara';
    this.randevular = [];
    
    // Veritabanı desteği (opsiyonel)
    this.database = null;
    this.useDatabase = options.database ? true : false;
    
    if (options.database) {
      const { DatabaseFactory } = require('./src/database');
      this.database = DatabaseFactory.create(
        options.database.type,
        options.database.config
      );
    }
    
    // Schengen ülkeleri
    this.schengenUlkeleri = [
      'almanya', 'avusturya', 'belcika', 'cekyarepublik', 'danimarka',
      'estonya', 'finlandiya', 'fransa', 'hollanda', 'isvec', 'isvicre',
      'ispanya', 'italya', 'izlanda', 'letonya', 'litvanya', 'luksemburg',
      'macaristan', 'malta', 'norveç', 'polonya', 'portekiz', 'slovakya',
      'slovenya', 'yunanistan'
    ];

    // Vize merkezleri - Tüm Schengen ülkeleri
    this.vizeMerkezleri = {
      almanya: {
        url: 'https://service2.diplo.de/rktermin/extern/choose_categoryList.do?locationCode=anka&request_locale=tr',
        tip: 'alman-konsoloslugu',
        sehirler: ['ankara', 'istanbul', 'izmir'],
        telefonlar: { ankara: '+90 312 455 5100', istanbul: '+90 212 334 6100' }
      },
      avusturya: {
        url: 'https://www.vfsvisaonline.com/Austria-Global-Online-Appointment_Zone2/AppScheduling/AppWelcome.aspx',
        tip: 'vfs-global',
        sehirler: ['ankara', 'istanbul'],
        telefonlar: { ankara: '+90 312 405 8190', istanbul: '+90 212 363 9900' }
      },
      belcika: {
        url: 'https://www.vfsvisaonline.com/Belgium-Global-Online-Appointment_Zone2/AppScheduling/AppWelcome.aspx',
        tip: 'vfs-global',
        sehirler: ['ankara', 'istanbul'],
        telefonlar: { ankara: '+90 312 405 6166', istanbul: '+90 212 243 3300' }
      },
      cekyarepublik: {
        url: 'https://www.vfsvisaonline.com/CzechRepublic-Global-Online-Appointment_Zone2/AppScheduling/AppWelcome.aspx',
        tip: 'vfs-global',
        sehirler: ['ankara', 'istanbul'],
        telefonlar: { ankara: '+90 312 405 6166' }
      },
      danimarka: {
        url: 'https://www.vfsvisaonline.com/Denmark-Global-Online-Appointment_Zone2/AppScheduling/AppWelcome.aspx',
        tip: 'vfs-global',
        sehirler: ['ankara', 'istanbul'],
        telefonlar: { ankara: '+90 312 446 0800' }
      },
      estonya: {
        url: 'https://www.vfsvisaonline.com/Estonia-Global-Online-Appointment_Zone2/AppScheduling/AppWelcome.aspx',
        tip: 'vfs-global',
        sehirler: ['ankara'],
        telefonlar: { ankara: '+90 312 405 6166' }
      },
      finlandiya: {
        url: 'https://www.vfsvisaonline.com/Finland-Global-Online-Appointment_Zone2/AppScheduling/AppWelcome.aspx',
        tip: 'vfs-global',
        sehirler: ['ankara', 'istanbul'],
        telefonlar: { ankara: '+90 312 405 6166', istanbul: '+90 212 393 5000' }
      },
      fransa: {
        url: 'https://france-visas.gouv.fr/web/france-visas/accueil',
        tip: 'vfs-global',
        sehirler: ['ankara', 'istanbul', 'izmir'],
        telefonlar: { ankara: '+90 312 455 4545', istanbul: '+90 212 334 8730' }
      },
      hollanda: {
        url: 'https://www.vfsvisaonline.com/Netherlands-Global-Online-Appointment_Zone2/AppScheduling/AppWelcome.aspx',
        tip: 'vfs-global',
        sehirler: ['ankara', 'istanbul'],
        telefonlar: { ankara: '+90 312 409 1800', istanbul: '+90 212 393 2121' }
      },
      isvec: {
        url: 'https://www.vfsvisaonline.com/Sweden-Global-Online-Appointment_Zone2/AppScheduling/AppWelcome.aspx',
        tip: 'vfs-global',
        sehirler: ['ankara', 'istanbul'],
        telefonlar: { ankara: '+90 312 455 6700', istanbul: '+90 212 334 0600' }
      },
      isvicre: {
        url: 'https://www.vfsvisaonline.com/Switzerland-Global-Online-Appointment_Zone2/AppScheduling/AppWelcome.aspx',
        tip: 'vfs-global',
        sehirler: ['ankara', 'istanbul'],
        telefonlar: { ankara: '+90 312 409 5500', istanbul: '+90 212 283 8131' }
      },
      ispanya: {
        url: 'https://blsspain-turkey.com/ankara/appointment.php',
        tip: 'bls-international',
        sehirler: ['ankara', 'istanbul', 'izmir'],
        telefonlar: { ankara: '+90 312 440 2169', istanbul: '+90 212 334 6915' }
      },
      italya: {
        url: 'https://prenotaonline.esteri.it/',
        tip: 'italyan-konsoloslugu',
        sehirler: ['ankara', 'istanbul', 'izmir'],
        telefonlar: { ankara: '+90 312 457 4200', istanbul: '+90 212 243 1024' }
      },
      izlanda: {
        url: 'https://www.vfsvisaonline.com/Iceland-Global-Online-Appointment_Zone2/AppScheduling/AppWelcome.aspx',
        tip: 'vfs-global',
        sehirler: ['ankara'],
        telefonlar: { ankara: '+90 312 405 6166' }
      },
      letonya: {
        url: 'https://www.vfsvisaonline.com/Latvia-Global-Online-Appointment_Zone2/AppScheduling/AppWelcome.aspx',
        tip: 'vfs-global',
        sehirler: ['ankara'],
        telefonlar: { ankara: '+90 312 405 6166' }
      },
      litvanya: {
        url: 'https://www.vfsvisaonline.com/Lithuania-Global-Online-Appointment_Zone2/AppScheduling/AppWelcome.aspx',
        tip: 'vfs-global',
        sehirler: ['ankara'],
        telefonlar: { ankara: '+90 312 405 6166' }
      },
      luksemburg: {
        url: 'https://www.vfsvisaonline.com/Luxembourg-Global-Online-Appointment_Zone2/AppScheduling/AppWelcome.aspx',
        tip: 'vfs-global',
        sehirler: ['ankara'],
        telefonlar: { ankara: '+90 312 405 6166' }
      },
      macaristan: {
        url: 'https://www.vfsvisaonline.com/Hungary-Global-Online-Appointment_Zone2/AppScheduling/AppWelcome.aspx',
        tip: 'vfs-global',
        sehirler: ['ankara', 'istanbul'],
        telefonlar: { ankara: '+90 312 442 0440', istanbul: '+90 212 246 8024' }
      },
      malta: {
        url: 'https://www.vfsvisaonline.com/Malta-Global-Online-Appointment_Zone2/AppScheduling/AppWelcome.aspx',
        tip: 'vfs-global',
        sehirler: ['ankara'],
        telefonlar: { ankara: '+90 312 405 6166' }
      },
      norvec: {
        url: 'https://www.vfsvisaonline.com/Norway-Global-Online-Appointment_Zone2/AppScheduling/AppWelcome.aspx',
        tip: 'vfs-global',
        sehirler: ['ankara', 'istanbul'],
        telefonlar: { ankara: '+90 312 405 6166' }
      },
      polonya: {
        url: 'https://www.vfsvisaonline.com/Poland-Global-Online-Appointment_Zone2/AppScheduling/AppWelcome.aspx',
        tip: 'vfs-global',
        sehirler: ['ankara', 'istanbul', 'trabzon'],
        telefonlar: { ankara: '+90 312 467 1919', istanbul: '+90 212 292 9100' }
      },
      portekiz: {
        url: 'https://www.vfsvisaonline.com/Portugal-Global-Online-Appointment_Zone2/AppScheduling/AppWelcome.aspx',
        tip: 'vfs-global',
        sehirler: ['ankara', 'istanbul'],
        telefonlar: { ankara: '+90 312 405 6166' }
      },
      slovakya: {
        url: 'https://www.vfsvisaonline.com/Slovakia-Global-Online-Appointment_Zone2/AppScheduling/AppWelcome.aspx',
        tip: 'vfs-global',
        sehirler: ['ankara'],
        telefonlar: { ankara: '+90 312 405 6166' }
      },
      slovenya: {
        url: 'https://www.vfsvisaonline.com/Slovenia-Global-Online-Appointment_Zone2/AppScheduling/AppWelcome.aspx',
        tip: 'vfs-global',
        sehirler: ['ankara'],
        telefonlar: { ankara: '+90 312 405 6166' }
      },
      yunanistan: {
        url: 'https://www.vfsvisaonline.com/Greece-Global-Online-Appointment_Zone2/AppScheduling/AppWelcome.aspx',
        tip: 'vfs-global',
        sehirler: ['ankara', 'istanbul', 'izmir', 'edirne', 'komotini', 'rodos'],
        telefonlar: { ankara: '+90 312 448 0647', istanbul: '+90 212 393 8290' }
      }
    };
  }

  /**
   * Schengen ülkesi kontrolü
   * @param {string} ulke - Ülke adı
   * @returns {boolean}
   */
  schengenMi(ulke) {
    return this.schengenUlkeleri.includes(ulke.toLowerCase());
  }

  /**
   * Müsait randevuları kontrol et (Gerçek HTTP istekleri)
   * @param {string} ulke - Schengen ülkesi
   * @param {Object} options - Ek seçenekler
   * @returns {Promise<Object>}
   */
  async musaitRandevuKontrol(ulke, options = {}) {
    if (!this.schengenMi(ulke)) {
      throw new Error(`${ulke} Schengen ülkesi değil!`);
    }

    const vizeMerkezi = this.vizeMerkezleri[ulke.toLowerCase()];
    
    if (!vizeMerkezi) {
      return {
        ulke,
        durum: 'bilgi-yok',
        mesaj: 'Bu ülke için otomatik kontrol henüz desteklenmiyor',
        url: null
      };
    }

    const sehir = options.sehir || this.sehir;
    const vizeTipi = options.vizeTipi || 'turist';

    try {
      // Gerçek HTTP isteği
      const response = await this.gercekRandevuKontrol(ulke, sehir, vizeTipi, vizeMerkezi);
      return response;
    } catch (error) {
      return {
        ulke,
        durum: 'hata',
        mesaj: `Kontrol sırasında hata: ${error.message}`,
        url: vizeMerkezi.url,
        kontrolTarihi: new Date()
      };
    }
  }

  /**
   * Gerçek randevu kontrolü (HTTP istekleri)
   * @param {string} ulke
   * @param {string} sehir
   * @param {string} vizeTipi
   * @param {Object} vizeMerkezi
   * @returns {Promise<Object>}
   */
  async gercekRandevuKontrol(ulke, sehir, vizeTipi, vizeMerkezi) {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
      'Connection': 'keep-alive'
    };

    try {
      // Timeout ile istek gönder
      const response = await axios.get(vizeMerkezi.url, {
        headers,
        timeout: 10000,
        maxRedirects: 5,
        validateStatus: (status) => status < 500
      });

      // Site erişilebilir mi kontrol et
      if (response.status === 200) {
        // HTML içeriğini kontrol et
        const html = response.data.toLowerCase();
        
        // Randevu durumu analizi
        const musaitAnahtarlar = ['available', 'müsait', 'musait', 'appointment', 'randevu'];
        const doluAnahtarlar = ['no appointment', 'randevu yok', 'dolu', 'full', 'not available'];
        
        let durum = 'bilinmiyor';
        let mesaj = 'Site erişilebilir ancak randevu durumu belirlenemedi';
        
        // Dolu kontrolü
        if (doluAnahtarlar.some(anahtar => html.includes(anahtar))) {
          durum = 'dolu';
          mesaj = 'Şu an müsait randevu bulunmuyor';
        }
        // Müsait kontrolü
        else if (musaitAnahtarlar.some(anahtar => html.includes(anahtar))) {
          durum = 'musait-olabilir';
          mesaj = 'Randevu sistemi aktif - Detaylı kontrol için siteyi ziyaret edin';
        }

        return {
          ulke,
          sehir,
          vizeTipi,
          durum,
          mesaj,
          url: vizeMerkezi.url,
          siteErisilebilir: true,
          httpDurum: response.status,
          kontrolTarihi: new Date(),
          not: 'Kesin bilgi için resmi siteyi kontrol edin'
        };
      } else {
        return {
          ulke,
          sehir,
          durum: 'site-erisim-sorunu',
          mesaj: `Site erişim sorunu (HTTP ${response.status})`,
          url: vizeMerkezi.url,
          siteErisilebilir: false,
          httpDurum: response.status,
          kontrolTarihi: new Date()
        };
      }
    } catch (error) {
      // Ağ hatası veya timeout
      if (error.code === 'ECONNABORTED') {
        return {
          ulke,
          sehir,
          durum: 'timeout',
          mesaj: 'Site yanıt vermiyor (timeout)',
          url: vizeMerkezi.url,
          siteErisilebilir: false,
          kontrolTarihi: new Date()
        };
      }

      throw error;
    }
  }

  /**
   * Toplu randevu kontrolü - Birden fazla ülke için
   * @param {Array} ulkeler - Ülke listesi
   * @param {Object} options - Ek seçenekler
   * @returns {Promise<Array>}
   */
  async topluRandevuKontrol(ulkeler, options = {}) {
    const sonuclar = [];
    
    for (const ulke of ulkeler) {
      try {
        console.log(`${ulke} kontrol ediliyor...`);
        const sonuc = await this.musaitRandevuKontrol(ulke, options);
        sonuclar.push(sonuc);
        
        // Rate limiting - siteler arasında 2 saniye bekle
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        sonuclar.push({
          ulke,
          durum: 'hata',
          mesaj: error.message,
          kontrolTarihi: new Date()
        });
      }
    }
    
    return sonuclar;
  }

  /**
   * Tüm Schengen ülkeleri için randevu kontrolü
   * @param {Object} options - Ek seçenekler
   * @returns {Promise<Array>}
   */
  async tumUlkelerKontrol(options = {}) {
    const desteklenenUlkeler = Object.keys(this.vizeMerkezleri);
    console.log(`${desteklenenUlkeler.length} ülke kontrol edilecek...`);
    return await this.topluRandevuKontrol(desteklenenUlkeler, options);
  }

  /**
   * ⚠️ KİŞİSEL RANDEVU KAYDI OLUŞTUR (RESMİ RANDEVU OLUŞTURMAZ!)
   * 
   * Bu fonksiyon resmi kanallardan aldığınız randevu bilgilerini
   * kişisel kayıtlarınızda saklamanız içindir.
   * 
   * RESMİ RANDEVU ALMAK İÇİN:
   * - Konsolosluk resmi web sitesini kullanın
   * - VFS Global resmi platformunu kullanın
   * - BLS International resmi platformunu kullanın
   * 
   * @param {Object} randevu - Resmi kanaldan aldığınız randevu bilgileri
   * @returns {Object} Kişisel kayıt bilgileri
   */
  randevuOlustur(randevu) {
    if (!this.schengenMi(randevu.ulke)) {
      throw new Error(`${randevu.ulke} Schengen ülkesi değil!`);
    }

    const yeniRandevu = {
      id: this.randevular.length + 1,
      ad: randevu.ad,
      soyad: randevu.soyad,
      pasaportNo: randevu.pasaportNo,
      dogumTarihi: randevu.dogumTarihi,
      ulke: randevu.ulke,
      sehir: randevu.sehir || this.sehir,
      vizeTipi: randevu.vizeTipi || 'turist',
      randevuTarihi: new Date(randevu.randevuTarihi),
      randevuSaati: randevu.randevuSaati,
      durum: 'beklemede',
      olusturmaTarihi: new Date(),
      referansNo: this.referansNoOlustur()
    };

    this.randevular.push(yeniRandevu);
    return yeniRandevu;
  }

  /**
   * Referans numarası oluştur
   * @returns {string}
   */
  referansNoOlustur() {
    return 'SCH' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 7).toUpperCase();
  }

  /**
   * Kişisel randevu kaydını sorgula
   * @param {number|string} idVeyaReferans - Kayıt ID veya referans no
   * @returns {Object|null} Kişisel kayıt bilgileri
   */
  randevuSorgula(idVeyaReferans) {
    if (typeof idVeyaReferans === 'number') {
      return this.randevular.find(r => r.id === idVeyaReferans) || null;
    }
    return this.randevular.find(r => r.referansNo === idVeyaReferans) || null;
  }

  /**
   * Tüm Schengen ülkelerini listele
   * @returns {Array}
   */
  schengenUlkeleriListele() {
    return this.schengenUlkeleri;
  }

  /**
   * Desteklenen vize merkezlerini listele
   * @returns {Object}
   */
  vizeMerkezleriListele() {
    return Object.keys(this.vizeMerkezleri).map(ulke => ({
      ulke,
      url: this.vizeMerkezleri[ulke].url,
      tip: this.vizeMerkezleri[ulke].tip,
      sehirler: this.vizeMerkezleri[ulke].sehirler,
      telefonlar: this.vizeMerkezleri[ulke].telefonlar
    }));
  }

  /**
   * Belirli bir ülke için vize merkezi bilgisi al
   * @param {string} ulke - Ülke adı
   * @returns {Object|null}
   */
  vizeMerkeziBilgisi(ulke) {
    const merkez = this.vizeMerkezleri[ulke.toLowerCase()];
    if (!merkez) {
      return null;
    }
    return {
      ulke,
      ...merkez
    };
  }

  /**
   * Şehre göre vize merkezlerini filtrele
   * @param {string} sehir - Şehir adı
   * @returns {Array}
   */
  sehreGoreVizeMerkezleri(sehir) {
    return Object.keys(this.vizeMerkezleri)
      .filter(ulke => this.vizeMerkezleri[ulke].sehirler.includes(sehir.toLowerCase()))
      .map(ulke => ({
        ulke,
        url: this.vizeMerkezleri[ulke].url,
        tip: this.vizeMerkezleri[ulke].tip,
        telefon: this.vizeMerkezleri[ulke].telefonlar[sehir.toLowerCase()]
      }));
  }

  /**
   * Ülkeye göre randevuları filtrele
   * @param {string} ulke
   * @returns {Array}
   */
  ulkeyeGoreFiltrele(ulke) {
    return this.randevular.filter(r => r.ulke.toLowerCase() === ulke.toLowerCase());
  }

  /**
   * Kişisel randevu kaydını iptal et
   * 
   * ⚠️ UYARI: Bu sadece bu sistemdeki kişisel kaydı iptal eder.
   * Resmi randevunuzu iptal etmek için resmi kanalları kullanın!
   * 
   * @param {number|string} idVeyaReferans - Kayıt ID veya referans no
   * @returns {boolean} İşlem başarılı mı
   */
  randevuIptal(idVeyaReferans) {
    const randevu = this.randevuSorgula(idVeyaReferans);
    if (randevu) {
      randevu.durum = 'iptal';
      randevu.iptalTarihi = new Date();
      return true;
    }
    return false;
  }

  /**
   * Randevuları JSON formatında export et
   * @returns {string} JSON string
   */
  exportJSON() {
    return JSON.stringify({
      version: '1.0',
      exportDate: new Date().toISOString(),
      randevular: this.randevular,
      sehir: this.sehir
    }, null, 2);
  }

  /**
   * JSON'dan randevuları import et
   * @param {string} jsonString - JSON string
   * @returns {Object} Import sonucu
   */
  importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      
      if (!data.randevular || !Array.isArray(data.randevular)) {
        throw new Error('Geçersiz JSON formatı');
      }

      const eskiSayi = this.randevular.length;
      
      // Tarihleri Date objesine çevir
      data.randevular.forEach(randevu => {
        if (randevu.randevuTarihi) {
          randevu.randevuTarihi = new Date(randevu.randevuTarihi);
        }
        if (randevu.olusturmaTarihi) {
          randevu.olusturmaTarihi = new Date(randevu.olusturmaTarihi);
        }
        if (randevu.iptalTarihi) {
          randevu.iptalTarihi = new Date(randevu.iptalTarihi);
        }
      });

      this.randevular = data.randevular;
      
      return {
        basarili: true,
        mesaj: `${data.randevular.length} randevu import edildi`,
        eskiSayi,
        yeniSayi: this.randevular.length
      };
    } catch (error) {
      return {
        basarili: false,
        mesaj: `Import hatası: ${error.message}`
      };
    }
  }

  /**
   * Randevuları CSV formatında export et
   * @returns {string} CSV string
   */
  exportCSV() {
    const headers = [
      'ID',
      'Referans No',
      'Ad',
      'Soyad',
      'Pasaport No',
      'Ülke',
      'Şehir',
      'Vize Tipi',
      'Randevu Tarihi',
      'Randevu Saati',
      'Durum',
      'Oluşturma Tarihi'
    ];

    const rows = this.randevular.map(r => [
      r.id,
      r.referansNo,
      r.ad,
      r.soyad,
      r.pasaportNo,
      r.ulke,
      r.sehir,
      r.vizeTipi,
      r.randevuTarihi.toISOString().split('T')[0],
      r.randevuSaati,
      r.durum,
      r.olusturmaTarihi.toISOString()
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csv;
  }

  /**
   * İstatistikleri getir
   * @returns {Object} İstatistikler
   */
  istatistikler() {
    const toplamRandevu = this.randevular.length;
    const aktifRandevu = this.randevular.filter(r => r.durum === 'beklemede').length;
    const iptalRandevu = this.randevular.filter(r => r.durum === 'iptal').length;
    const onaylananRandevu = this.randevular.filter(r => r.durum === 'onaylandı').length;

    // Ülkelere göre dağılım
    const ulkeDagilim = {};
    this.randevular.forEach(r => {
      ulkeDagilim[r.ulke] = (ulkeDagilim[r.ulke] || 0) + 1;
    });

    // En çok başvurulan ülke
    const enCokBasvurulan = Object.keys(ulkeDagilim).reduce((a, b) => 
      ulkeDagilim[a] > ulkeDagilim[b] ? a : b, null
    );

    return {
      toplamRandevu,
      aktifRandevu,
      iptalRandevu,
      onaylananRandevu,
      ulkeDagilim,
      enCokBasvurulan
    };
  }

  /**
   * Yaklaşan randevuları getir
   * @param {number} gunSayisi - Kaç gün içindeki randevular (default: 30)
   * @returns {Array} Yaklaşan randevular
   */
  yaklasanRandevular(gunSayisi = 30) {
    const bugun = new Date();
    const gelecek = new Date();
    gelecek.setDate(bugun.getDate() + gunSayisi);

    return this.randevular.filter(r => {
      const randevuTarih = new Date(r.randevuTarihi);
      return randevuTarih >= bugun && randevuTarih <= gelecek && r.durum !== 'iptal';
    }).sort((a, b) => new Date(a.randevuTarihi) - new Date(b.randevuTarihi));
  }

  /**
   * Randevu durumunu güncelle
   * @param {number|string} idVeyaReferans
   * @param {string} yeniDurum - 'beklemede', 'onaylandı', 'reddedildi', 'iptal'
   * @returns {Object|null}
   */
  durumGuncelle(idVeyaReferans, yeniDurum) {
    const randevu = this.randevuSorgula(idVeyaReferans);
    if (randevu) {
      randevu.durum = yeniDurum;
      randevu.durumGuncellemeTarihi = new Date();
      return randevu;
    }
    return null;
  }

  /**
   * Veritabanına bağlan
   * @returns {Promise<boolean>}
   */
  async connectDatabase() {
    if (!this.database) {
      throw new Error('Veritabanı konfigürasyonu yapılmamış');
    }
    return await this.database.connect();
  }

  /**
   * Veritabanı bağlantısını kapat
   * @returns {Promise<boolean>}
   */
  async disconnectDatabase() {
    if (!this.database) {
      throw new Error('Veritabanı konfigürasyonu yapılmamış');
    }
    return await this.database.disconnect();
  }

  /**
   * Randevuyu veritabanına kaydet
   * @param {Object} randevu
   * @returns {Promise<Object>}
   */
  async saveToDatabase(randevu) {
    if (!this.database) {
      throw new Error('Veritabanı konfigürasyonu yapılmamış');
    }
    return await this.database.saveRandevu(randevu);
  }

  /**
   * Veritabanından randevu getir
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async getFromDatabase(id) {
    if (!this.database) {
      throw new Error('Veritabanı konfigürasyonu yapılmamış');
    }
    return await this.database.getRandevu(id);
  }

  /**
   * Veritabanından tüm randevuları getir
   * @returns {Promise<Array>}
   */
  async getAllFromDatabase() {
    if (!this.database) {
      throw new Error('Veritabanı konfigürasyonu yapılmamış');
    }
    return await this.database.getAllRandevular();
  }

  /**
   * Veritabanındaki randevuyu güncelle
   * @param {string} id
   * @param {Object} data
   * @returns {Promise<Object|null>}
   */
  async updateInDatabase(id, data) {
    if (!this.database) {
      throw new Error('Veritabanı konfigürasyonu yapılmamış');
    }
    return await this.database.updateRandevu(id, data);
  }

  /**
   * Veritabanından randevu sil
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async deleteFromDatabase(id) {
    if (!this.database) {
      throw new Error('Veritabanı konfigürasyonu yapılmamış');
    }
    return await this.database.deleteRandevu(id);
  }

  /**
   * Lokal randevuları veritabanına senkronize et
   * @returns {Promise<Object>}
   */
  async syncToDatabase() {
    if (!this.database) {
      throw new Error('Veritabanı konfigürasyonu yapılmamış');
    }

    const results = {
      basarili: 0,
      basarisiz: 0,
      hatalar: []
    };

    for (const randevu of this.randevular) {
      try {
        await this.database.saveRandevu(randevu);
        results.basarili++;
      } catch (error) {
        results.basarisiz++;
        results.hatalar.push({
          randevu: randevu.referansNo,
          hata: error.message
        });
      }
    }

    return results;
  }

  /**
   * Veritabanından lokal'e senkronize et
   * @returns {Promise<Object>}
   */
  async syncFromDatabase() {
    if (!this.database) {
      throw new Error('Veritabanı konfigürasyonu yapılmamış');
    }

    const randevular = await this.database.getAllRandevular();
    this.randevular = randevular;

    return {
      basarili: true,
      sayi: randevular.length
    };
  }
}

module.exports = SchengenRandevu;
