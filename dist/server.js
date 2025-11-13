"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./swagger");
const SchengenChecker_1 = require("./SchengenChecker");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
// Swagger UI
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// Swagger JSON
app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swagger_1.swaggerSpec);
});
// Ana sayfa
app.get("/", (req, res) => {
    res.json({
        message: "Schengen Randevu Checker API",
        version: "2.0.0",
        documentation: "/api-docs",
        endpoints: {
            schengenKontrol: "GET /api/schengen-kontrol?ulke={ulke}",
            randevuKontrol: "POST /api/randevu-kontrol",
            topluKontrol: "POST /api/toplu-kontrol",
            tumUlkelerKontrol: "POST /api/tum-ulkeler-kontrol",
            vizeMerkezi: "GET /api/vize-merkezi/{ulke}",
            vizeMerkezleri: "GET /api/vize-merkezleri",
            sehreGoreVizeMerkezleri: "GET /api/vize-merkezleri/sehir/{sehir}",
        },
    });
});
const checker = new SchengenChecker_1.SchengenChecker();
// Schengen kontrolü
app.get("/api/schengen-kontrol", (req, res) => {
    try {
        const { ulke } = req.query;
        if (!ulke || typeof ulke !== "string") {
            return res.status(400).json({ error: "Ülke parametresi gerekli" });
        }
        const schengenMi = checker.schengenMi(ulke);
        res.json({ ulke, schengenMi });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Randevu kontrolü
app.post("/api/randevu-kontrol", async (req, res) => {
    try {
        const { ulke, sehir, vizeTipi } = req.body;
        if (!ulke) {
            return res.status(400).json({ error: "Ülke parametresi gerekli" });
        }
        const options = {};
        if (sehir)
            options.sehir = sehir;
        if (vizeTipi)
            options.vizeTipi = vizeTipi;
        const sonuc = await checker.musaitRandevuKontrol(ulke, options);
        res.json(sonuc);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Toplu kontrol
app.post("/api/toplu-kontrol", async (req, res) => {
    try {
        const { ulkeler, sehir, vizeTipi } = req.body;
        if (!ulkeler || !Array.isArray(ulkeler)) {
            return res
                .status(400)
                .json({ error: "Ülkeler array olarak gönderilmeli" });
        }
        const options = {};
        if (sehir)
            options.sehir = sehir;
        if (vizeTipi)
            options.vizeTipi = vizeTipi;
        const sonuclar = await checker.topluRandevuKontrol(ulkeler, options);
        res.json(sonuclar);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Tüm ülkeler kontrolü
app.post("/api/tum-ulkeler-kontrol", async (req, res) => {
    try {
        const { sehir, vizeTipi } = req.body || {};
        const options = {};
        if (sehir)
            options.sehir = sehir;
        if (vizeTipi)
            options.vizeTipi = vizeTipi;
        const sonuclar = await checker.tumUlkelerKontrol(options);
        res.json(sonuclar);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Vize merkezi bilgisi
app.get("/api/vize-merkezi/:ulke", (req, res) => {
    try {
        const { ulke } = req.params;
        const bilgi = checker.vizeMerkeziBilgisi(ulke);
        if (!bilgi) {
            return res
                .status(404)
                .json({ error: "Ülke için vize merkezi bulunamadı" });
        }
        res.json(bilgi);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Tüm vize merkezleri
app.get("/api/vize-merkezleri", (req, res) => {
    try {
        const merkezler = checker.vizeMerkezleriListele();
        res.json(merkezler);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Şehre göre vize merkezleri
app.get("/api/vize-merkezleri/sehir/:sehir", (req, res) => {
    try {
        const { sehir } = req.params;
        const merkezler = checker.sehreGoreVizeMerkezleri(sehir);
        res.json(merkezler);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.listen(port, () => {
    console.log(`🚀 Server çalışıyor: http://localhost:${port}`);
    console.log(`📚 API Dokümantasyonu: http://localhost:${port}/api-docs`);
    console.log(`📄 Swagger JSON: http://localhost:${port}/api-docs.json`);
});
exports.default = app;
