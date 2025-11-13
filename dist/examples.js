"use strict";
/**
 * Schengen Randevu Checker - Swagger API Examples
 *
 * Bu dosya Swagger API'nin nasıl kullanılacağını gösterir.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.examples = examples;
const SchengenChecker_1 = require("./SchengenChecker");
async function examples() {
    const checker = new SchengenChecker_1.SchengenChecker({
        sehir: "ankara",
        rateLimit: 2000,
    });
    console.log("=== Schengen Randevu Checker API Examples ===\n");
    // 1. Schengen Kontrolü
    console.log("1. Schengen Kontrolü:");
    const isSchengen = checker.schengenMi("almanya");
    console.log(`   Almanya Schengen üyesi mi? ${isSchengen}\n`);
    // 2. Tek Ülke Randevu Kontrolü
    console.log("2. Tek Ülke Randevu Kontrolü:");
    try {
        const result = await checker.musaitRandevuKontrol("fransa", {
            sehir: "ankara",
            vizeTipi: "turist",
        });
        console.log("   Sonuç:", JSON.stringify(result, null, 2), "\n");
    }
    catch (error) {
        console.error("   Hata:", error.message, "\n");
    }
    // 3. Vize Merkezi Bilgisi
    console.log("3. Vize Merkezi Bilgisi:");
    const vizeMerkezi = checker.vizeMerkeziBilgisi("almanya");
    console.log("   Bilgi:", JSON.stringify(vizeMerkezi, null, 2), "\n");
    // 4. Tüm Vize Merkezleri
    console.log("4. Tüm Vize Merkezleri:");
    const tumMerkezler = checker.vizeMerkezleriListele();
    console.log(`   Toplam ${tumMerkezler.length} merkez bulundu`);
    console.log("   İlk 3:", tumMerkezler
        .slice(0, 3)
        .map((m) => m.ulke)
        .join(", "), "\n");
    // 5. Şehre Göre Vize Merkezleri
    console.log("5. Ankara'daki Vize Merkezleri:");
    const ankaraMerkezleri = checker.sehreGoreVizeMerkezleri("ankara");
    console.log(`   ${ankaraMerkezleri.length} merkez bulundu`);
    console.log("   Ülkeler:", ankaraMerkezleri.map((m) => m.ulke).join(", "), "\n");
    // 6. API Server
    console.log("6. API Server Kullanımı:");
    console.log("   Sunucuyu başlatmak için: npm run server");
    console.log("   Swagger UI: http://localhost:3000/api-docs");
    console.log("   Swagger JSON: http://localhost:3000/api-docs.json\n");
    console.log("=== Examples Complete ===");
}
// Run examples
if (require.main === module) {
    examples().catch(console.error);
}
