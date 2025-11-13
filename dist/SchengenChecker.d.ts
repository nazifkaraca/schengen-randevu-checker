import { SchengenCheckerOptions, KontrolOptions, RandevuKontrolSonuc, VizeMerkezi } from "./types";
/**
 * @swagger
 * components:
 *   schemas:
 *     SchengenChecker:
 *       type: object
 *       description: Schengen vize randevu kontrol sınıfı
 */
export declare class SchengenChecker {
    private sehir;
    private rateLimit;
    private randevular;
    constructor(options?: SchengenCheckerOptions);
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
    schengenMi(ulke: string): boolean;
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
    musaitRandevuKontrol(ulke: string, options?: KontrolOptions): Promise<RandevuKontrolSonuc>;
    /**
     * Gerçek HTTP kontrolü
     */
    private gercekRandevuKontrol;
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
    topluRandevuKontrol(ulkeler: string[], options?: KontrolOptions): Promise<RandevuKontrolSonuc[]>;
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
    tumUlkelerKontrol(options?: KontrolOptions): Promise<RandevuKontrolSonuc[]>;
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
    vizeMerkeziBilgisi(ulke: string): (VizeMerkezi & {
        ulke: string;
    }) | null;
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
    vizeMerkezleriListele(): {
        url: string;
        tip: "vfs-global" | "bls-international" | "konsolosluk";
        sehirler: string[];
        telefonlar: Record<string, string>;
        ulke: string;
    }[];
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
    sehreGoreVizeMerkezleri(sehir: string): {
        ulke: string;
        url: string;
        tip: "vfs-global" | "bls-international" | "konsolosluk";
        telefon: string;
    }[];
    private bekle;
}
