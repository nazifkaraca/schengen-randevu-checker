import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import { SchengenChecker } from "./SchengenChecker";
import { KontrolOptions } from "./types";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Swagger JSON
app.get("/api-docs.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Ana sayfa
app.get("/", (req: Request, res: Response) => {
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

const checker = new SchengenChecker();

// Schengen kontrolü
app.get("/api/schengen-kontrol", (req: Request, res: Response) => {
  try {
    const { ulke } = req.query;
    if (!ulke || typeof ulke !== "string") {
      return res.status(400).json({ error: "Ülke parametresi gerekli" });
    }

    const schengenMi = checker.schengenMi(ulke);
    res.json({ ulke, schengenMi });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Randevu kontrolü
app.post("/api/randevu-kontrol", async (req: Request, res: Response) => {
  try {
    const { ulke, sehir, vizeTipi } = req.body;
    if (!ulke) {
      return res.status(400).json({ error: "Ülke parametresi gerekli" });
    }

    const options: KontrolOptions = {};
    if (sehir) options.sehir = sehir;
    if (vizeTipi) options.vizeTipi = vizeTipi;

    const sonuc = await checker.musaitRandevuKontrol(ulke, options);
    res.json(sonuc);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Toplu kontrol
app.post("/api/toplu-kontrol", async (req: Request, res: Response) => {
  try {
    const { ulkeler, sehir, vizeTipi } = req.body;
    if (!ulkeler || !Array.isArray(ulkeler)) {
      return res
        .status(400)
        .json({ error: "Ülkeler array olarak gönderilmeli" });
    }

    const options: KontrolOptions = {};
    if (sehir) options.sehir = sehir;
    if (vizeTipi) options.vizeTipi = vizeTipi;

    const sonuclar = await checker.topluRandevuKontrol(ulkeler, options);
    res.json(sonuclar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Tüm ülkeler kontrolü
app.post("/api/tum-ulkeler-kontrol", async (req: Request, res: Response) => {
  try {
    const { sehir, vizeTipi } = req.body || {};
    const options: KontrolOptions = {};
    if (sehir) options.sehir = sehir;
    if (vizeTipi) options.vizeTipi = vizeTipi;

    const sonuclar = await checker.tumUlkelerKontrol(options);
    res.json(sonuclar);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Vize merkezi bilgisi
app.get("/api/vize-merkezi/:ulke", (req: Request, res: Response) => {
  try {
    const { ulke } = req.params;
    const bilgi = checker.vizeMerkeziBilgisi(ulke);

    if (!bilgi) {
      return res
        .status(404)
        .json({ error: "Ülke için vize merkezi bulunamadı" });
    }

    res.json(bilgi);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Tüm vize merkezleri
app.get("/api/vize-merkezleri", (req: Request, res: Response) => {
  try {
    const merkezler = checker.vizeMerkezleriListele();
    res.json(merkezler);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Şehre göre vize merkezleri
app.get("/api/vize-merkezleri/sehir/:sehir", (req: Request, res: Response) => {
  try {
    const { sehir } = req.params;
    const merkezler = checker.sehreGoreVizeMerkezleri(sehir);
    res.json(merkezler);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server çalışıyor: http://localhost:${port}`);
  console.log(`📚 API Dokümantasyonu: http://localhost:${port}/api-docs`);
  console.log(`📄 Swagger JSON: http://localhost:${port}/api-docs.json`);
});

export default app;
