"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchengenChecker = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");
/**
 * @swagger
 * components:
 *   schemas:
 *     SchengenChecker:
 *       type: object
 *       description: Schengen vize randevu kontrol sınıfı
 */
class SchengenChecker {
    constructor(options = {}) {
        this.randevular = [];
        this.sehir = options.sehir || "ankara";
        this.rateLimit = options.rateLimit || 2000;
    }
    /**
     * @swagger
     * /api/schengen-kontrol:
     *   get:
     *     summary: Ülkenin Schengen üyesi olup olmadığını kontrol eder
     *     tags: [Ülkeler]
     *     parameters:
     *       - in: query
     *         name: ulke
     *         required: true
     *         schema:
     *           type: string
     *         description: Kontrol edilecek ülke adı
     *         example: almanya
     *     responses:
     *       200:
     *         description: Kontrol sonucu
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 ulke:
     *                   type: string
     *                 schengenMi:
     *                   type: boolean
     *       400:
     *         description: Hatalı istek
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    schengenMi(ulke) {
        return constants_1.SCHENGEN_ULKELERI.includes(ulke.toLowerCase());
    }
    /**
     * @swagger
     * /api/randevu-kontrol:
     *   post:
     *     summary: Belirtilen ülke için müsait randevu kontrolü yapar
     *     tags: [Randevu]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - ulke
     *             properties:
     *               ulke:
     *                 type: string
     *                 description: Ülke adı
     *                 example: almanya
     *               sehir:
     *                 type: string
     *                 description: Şehir adı (opsiyonel)
     *                 example: ankara
     *               vizeTipi:
     *                 type: string
     *                 description: Vize tipi (opsiyonel)
     *                 example: turist
     *     responses:
     *       200:
     *         description: Randevu kontrol sonucu
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/RandevuKontrolSonuc'
     *       400:
     *         description: Hatalı istek veya Schengen dışı ülke
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       500:
     *         description: Sunucu hatası
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    async musaitRandevuKontrol(ulke, options = {}) {
        if (!this.schengenMi(ulke)) {
            throw new Error(`${ulke} Schengen ülkesi değil!`);
        }
        const vizeMerkezi = constants_1.VIZE_MERKEZLERI[ulke.toLowerCase()];
        if (!vizeMerkezi) {
            return {
                ulke,
                durum: "bilinmiyor",
                mesaj: "Bu ülke için otomatik kontrol henüz desteklenmiyor",
                url: "",
                kontrolTarihi: new Date(),
            };
        }
        const sehir = options.sehir || this.sehir;
        const vizeTipi = options.vizeTipi || "turist";
        try {
            return await this.gercekRandevuKontrol(ulke, sehir, vizeTipi, vizeMerkezi);
        }
        catch (error) {
            return {
                ulke,
                durum: "hata",
                mesaj: `Kontrol sırasında hata: ${error.message}`,
                url: vizeMerkezi.url,
                kontrolTarihi: new Date(),
            };
        }
    }
    /**
     * Gerçek HTTP kontrolü
     */
    async gercekRandevuKontrol(ulke, sehir, vizeTipi, vizeMerkezi) {
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
        };
        try {
            const response = await axios_1.default.get(vizeMerkezi.url, {
                headers,
                timeout: 10000,
                maxRedirects: 5,
                validateStatus: (status) => status < 500,
            });
            if (response.status === 200) {
                const html = response.data.toLowerCase();
                const musaitAnahtarlar = [
                    "available",
                    "müsait",
                    "musait",
                    "appointment",
                ];
                const doluAnahtarlar = [
                    "no appointment",
                    "randevu yok",
                    "dolu",
                    "full",
                ];
                let durum = "bilinmiyor";
                let mesaj = "Site erişilebilir ancak randevu durumu belirlenemedi";
                if (doluAnahtarlar.some((anahtar) => html.includes(anahtar))) {
                    durum = "dolu";
                    mesaj = "Şu an müsait randevu bulunmuyor";
                }
                else if (musaitAnahtarlar.some((anahtar) => html.includes(anahtar))) {
                    durum = "musait";
                    mesaj =
                        "Randevu sistemi aktif - Detaylı kontrol için siteyi ziyaret edin";
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
                    not: "Kesin bilgi için resmi siteyi kontrol edin",
                };
            }
            return {
                ulke,
                sehir,
                durum: "hata",
                mesaj: `Site erişim sorunu (HTTP ${response.status})`,
                url: vizeMerkezi.url,
                siteErisilebilir: false,
                httpDurum: response.status,
                kontrolTarihi: new Date(),
            };
        }
        catch (error) {
            if (error.code === "ECONNABORTED") {
                return {
                    ulke,
                    sehir,
                    durum: "timeout",
                    mesaj: "Site yanıt vermiyor (timeout)",
                    url: vizeMerkezi.url,
                    siteErisilebilir: false,
                    kontrolTarihi: new Date(),
                };
            }
            throw error;
        }
    }
    /**
     * @swagger
     * /api/toplu-kontrol:
     *   post:
     *     summary: Birden fazla ülke için toplu randevu kontrolü yapar
     *     tags: [Randevu]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - ulkeler
     *             properties:
     *               ulkeler:
     *                 type: array
     *                 items:
     *                   type: string
     *                 description: Kontrol edilecek ülkeler listesi
     *                 example: ['almanya', 'fransa', 'ispanya']
     *               sehir:
     *                 type: string
     *                 description: Şehir adı (opsiyonel)
     *                 example: ankara
     *               vizeTipi:
     *                 type: string
     *                 description: Vize tipi (opsiyonel)
     *                 example: turist
     *     responses:
     *       200:
     *         description: Toplu kontrol sonuçları
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/RandevuKontrolSonuc'
     *       400:
     *         description: Hatalı istek
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    async topluRandevuKontrol(ulkeler, options = {}) {
        const sonuclar = [];
        for (const ulke of ulkeler) {
            try {
                console.log(`${ulke} kontrol ediliyor...`);
                const sonuc = await this.musaitRandevuKontrol(ulke, options);
                sonuclar.push(sonuc);
                await this.bekle(this.rateLimit);
            }
            catch (error) {
                sonuclar.push({
                    ulke,
                    durum: "hata",
                    mesaj: error.message,
                    url: "",
                    kontrolTarihi: new Date(),
                });
            }
        }
        return sonuclar;
    }
    /**
     * @swagger
     * /api/tum-ulkeler-kontrol:
     *   post:
     *     summary: Desteklenen tüm ülkeler için randevu kontrolü yapar
     *     tags: [Randevu]
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               sehir:
     *                 type: string
     *                 description: Şehir adı (opsiyonel)
     *                 example: ankara
     *               vizeTipi:
     *                 type: string
     *                 description: Vize tipi (opsiyonel)
     *                 example: turist
     *     responses:
     *       200:
     *         description: Tüm ülkeler için kontrol sonuçları
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/RandevuKontrolSonuc'
     *       500:
     *         description: Sunucu hatası
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    async tumUlkelerKontrol(options = {}) {
        const desteklenenUlkeler = Object.keys(constants_1.VIZE_MERKEZLERI);
        console.log(`${desteklenenUlkeler.length} ülke kontrol edilecek...`);
        return await this.topluRandevuKontrol(desteklenenUlkeler, options);
    }
    /**
     * @swagger
     * /api/vize-merkezi/{ulke}:
     *   get:
     *     summary: Belirtilen ülke için vize merkezi bilgilerini döndürür
     *     tags: [Vize Merkezleri]
     *     parameters:
     *       - in: path
     *         name: ulke
     *         required: true
     *         schema:
     *           type: string
     *         description: Ülke adı
     *         example: almanya
     *     responses:
     *       200:
     *         description: Vize merkezi bilgisi
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/VizeMerkezi'
     *       404:
     *         description: Ülke için vize merkezi bulunamadı
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    vizeMerkeziBilgisi(ulke) {
        const merkez = constants_1.VIZE_MERKEZLERI[ulke.toLowerCase()];
        if (!merkez)
            return null;
        return { ulke, ...merkez };
    }
    /**
     * @swagger
     * /api/vize-merkezleri:
     *   get:
     *     summary: Tüm desteklenen ülkeler için vize merkezi bilgilerini listeler
     *     tags: [Vize Merkezleri]
     *     responses:
     *       200:
     *         description: Vize merkezleri listesi
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/VizeMerkezi'
     */
    vizeMerkezleriListele() {
        return Object.keys(constants_1.VIZE_MERKEZLERI).map((ulke) => ({
            ulke,
            ...constants_1.VIZE_MERKEZLERI[ulke],
        }));
    }
    /**
     * @swagger
     * /api/vize-merkezleri/sehir/{sehir}:
     *   get:
     *     summary: Belirtilen şehirde hizmet veren vize merkezlerini listeler
     *     tags: [Vize Merkezleri]
     *     parameters:
     *       - in: path
     *         name: sehir
     *         required: true
     *         schema:
     *           type: string
     *         description: Şehir adı
     *         example: ankara
     *     responses:
     *       200:
     *         description: Şehre göre vize merkezleri
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   ulke:
     *                     type: string
     *                   url:
     *                     type: string
     *                   tip:
     *                     type: string
     *                   telefon:
     *                     type: string
     */
    sehreGoreVizeMerkezleri(sehir) {
        return Object.keys(constants_1.VIZE_MERKEZLERI)
            .filter((ulke) => constants_1.VIZE_MERKEZLERI[ulke].sehirler.includes(sehir.toLowerCase()))
            .map((ulke) => ({
            ulke,
            url: constants_1.VIZE_MERKEZLERI[ulke].url,
            tip: constants_1.VIZE_MERKEZLERI[ulke].tip,
            telefon: constants_1.VIZE_MERKEZLERI[ulke].telefonlar[sehir.toLowerCase()],
        }));
    }
    bekle(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
exports.SchengenChecker = SchengenChecker;
