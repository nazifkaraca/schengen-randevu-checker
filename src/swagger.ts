import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Schengen Randevu Checker API",
      version: "2.0.0",
      description:
        "Modern TypeScript library for checking Schengen visa appointment availability across 17+ countries. Educational and informational purposes only.",
      contact: {
        name: "İhsan Baki Doğan",
        email: "info@ihsanbakidogan.com",
        url: "https://github.com/ibidi/schengen-randevu-checker",
      },
      license: {
        name: "MIT",
        url: "https://github.com/ibidi/schengen-randevu-checker/blob/main/LICENSE",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "Randevu",
        description: "Randevu kontrol işlemleri",
      },
      {
        name: "Vize Merkezleri",
        description: "Vize merkezi bilgileri",
      },
      {
        name: "Ülkeler",
        description: "Schengen ülke işlemleri",
      },
    ],
    components: {
      schemas: {
        RandevuKontrolSonuc: {
          type: "object",
          properties: {
            ulke: {
              type: "string",
              description: "Ülke adı",
              example: "almanya",
            },
            sehir: {
              type: "string",
              description: "Şehir adı",
              example: "ankara",
            },
            vizeTipi: {
              type: "string",
              description: "Vize tipi",
              example: "turist",
            },
            durum: {
              type: "string",
              enum: ["musait", "dolu", "bilinmiyor", "hata", "timeout"],
              description: "Randevu durumu",
            },
            mesaj: {
              type: "string",
              description: "Durum mesajı",
              example: "Randevu sistemi aktif",
            },
            url: {
              type: "string",
              description: "Vize merkezi URL'si",
              example: "https://visa.vfsglobal.com/tur/tr/deu",
            },
            siteErisilebilir: {
              type: "boolean",
              description: "Site erişilebilir mi?",
            },
            httpDurum: {
              type: "number",
              description: "HTTP durum kodu",
              example: 200,
            },
            kontrolTarihi: {
              type: "string",
              format: "date-time",
              description: "Kontrol tarihi",
            },
            not: {
              type: "string",
              description: "Ek notlar",
            },
          },
          required: ["ulke", "durum", "mesaj", "url", "kontrolTarihi"],
        },
        VizeMerkezi: {
          type: "object",
          properties: {
            ulke: {
              type: "string",
              description: "Ülke adı",
              example: "almanya",
            },
            url: {
              type: "string",
              description: "Vize merkezi URL'si",
              example: "https://visa.vfsglobal.com/tur/tr/deu",
            },
            tip: {
              type: "string",
              enum: ["vfs-global", "bls-international", "konsolosluk"],
              description: "Vize merkezi tipi",
            },
            sehirler: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Hizmet verilen şehirler",
              example: ["ankara", "istanbul", "izmir"],
            },
            telefonlar: {
              type: "object",
              additionalProperties: {
                type: "string",
              },
              description: "Şehirlere göre telefon numaraları",
              example: {
                ankara: "+90 312 123 4567",
                istanbul: "+90 212 123 4567",
              },
            },
          },
        },
        KontrolOptions: {
          type: "object",
          properties: {
            sehir: {
              type: "string",
              description: "Şehir adı (varsayılan: ankara)",
              example: "ankara",
            },
            vizeTipi: {
              type: "string",
              description: "Vize tipi (varsayılan: turist)",
              example: "turist",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Hata mesajı",
            },
            message: {
              type: "string",
              description: "Detaylı açıklama",
            },
          },
        },
      },
    },
  },
  apis: ["./src/**/*.ts"], // Tüm TypeScript dosyalarını tara
};

export const swaggerSpec = swaggerJsdoc(options);
