/**
 * Schengen Vize Randevu Modülü
 * Schengen ülkeleri için vize randevu kontrolü ve yönetimi
 */

const axios = require('axios');

class SchengenRandevu {
  constructor(options = {}) {
    this.ulke = options.ulke || null;
    this.sehir = options.sehir || 'ankara';
    this.randevular = [];
    
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
   * Randevu oluştur
   * @param {Object} randevu - Randevu bilgileri
   * @returns {Object}
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
   * Randevu sorgula
   * @param {number|string} idVeyaReferans - Randevu ID veya referans no
   * @returns {Object|null}
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
   * Randevu iptal et
   * @param {number|string} idVeyaReferans
   * @returns {boolean}
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
}

module.exports = SchengenRandevu;
