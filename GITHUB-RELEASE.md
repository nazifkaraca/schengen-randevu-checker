# GitHub Release Oluşturma

## Otomatik Yöntem (GitHub CLI ile)

Eğer GitHub CLI yüklüyse:

```bash
gh release create v1.0.1 \
  --title "v1.0.1 - Legal Disclaimers & Warnings" \
  --notes "## ⚠️ Important Legal Update

This release adds comprehensive legal disclaimers and warnings.

### What's Changed

- ✅ Added LEGAL.md with detailed legal information
- ✅ Updated README with prominent legal warnings
- ✅ Clarified educational purpose in package description
- ✅ Added code documentation about legal restrictions

### Important Notes

⚠️ **This module is for educational and information management purposes only.**

- ❌ NOT for automated booking
- ❌ NOT for continuous site scraping
- ✅ For learning Node.js and HTTP requests
- ✅ For managing personal appointment records
- ✅ For accessing visa center contact information

### Why This Update?

Following community feedback, we've made it crystal clear that:
1. Automated bot usage on official websites may violate terms of service
2. Users are responsible for compliance with laws
3. This is an educational tool, not a booking bot

### Installation

\`\`\`bash
npm install schengen-randevu-checker@1.0.1
\`\`\`

### Links

- 📦 [npm Package](https://www.npmjs.com/package/schengen-randevu-checker)
- 📖 [Documentation](https://github.com/ibidi/schengen-randevu-checker#readme)
- ⚖️ [Legal Information](https://github.com/ibidi/schengen-randevu-checker/blob/main/LEGAL.md)

**Full Changelog**: https://github.com/ibidi/schengen-randevu-checker/compare/v1.0.0...v1.0.1"
```

## Manuel Yöntem (GitHub Web Interface)

1. https://github.com/ibidi/schengen-randevu-checker/releases/new adresine git

2. **Tag version:** `v1.0.1` seç (dropdown'dan)

3. **Release title:** `v1.0.1 - Legal Disclaimers & Warnings`

4. **Description:** Aşağıdaki metni yapıştır:

```markdown
## ⚠️ Important Legal Update

This release adds comprehensive legal disclaimers and warnings.

### What's Changed

- ✅ Added LEGAL.md with detailed legal information
- ✅ Updated README with prominent legal warnings
- ✅ Clarified educational purpose in package description
- ✅ Added code documentation about legal restrictions

### Important Notes

⚠️ **This module is for educational and information management purposes only.**

- ❌ NOT for automated booking
- ❌ NOT for continuous site scraping
- ✅ For learning Node.js and HTTP requests
- ✅ For managing personal appointment records
- ✅ For accessing visa center contact information

### Why This Update?

Following community feedback, we've made it crystal clear that:
1. Automated bot usage on official websites may violate terms of service
2. Users are responsible for compliance with laws
3. This is an educational tool, not a booking bot

### Installation

```bash
npm install schengen-randevu-checker@1.0.1
```

### Links

- 📦 [npm Package](https://www.npmjs.com/package/schengen-randevu-checker)
- 📖 [Documentation](https://github.com/ibidi/schengen-randevu-checker#readme)
- ⚖️ [Legal Information](https://github.com/ibidi/schengen-randevu-checker/blob/main/LEGAL.md)

**Full Changelog**: https://github.com/ibidi/schengen-randevu-checker/compare/v1.0.0...v1.0.1
```

5. "Publish release" butonuna tıkla

---

## Sonraki Adımlar

Release oluşturduktan sonra:

1. ✅ npm'de yayınlandı: https://www.npmjs.com/package/schengen-randevu-checker
2. ✅ GitHub'da tag oluşturuldu: https://github.com/ibidi/schengen-randevu-checker/releases/tag/v1.0.1
3. 🔜 GitHub Release oluştur
4. 🔜 Sosyal medyada duyur (yasal uyarılarla birlikte)

---

## Gelecek Versiyonlar İçin

```bash
# Küçük değişiklikler (1.0.1 -> 1.0.2)
npm version patch -m "Release v%s - Bug fixes"

# Yeni özellikler (1.0.1 -> 1.1.0)
npm version minor -m "Release v%s - New features"

# Büyük değişiklikler (1.0.1 -> 2.0.0)
npm version major -m "Release v%s - Breaking changes"

# Sonra:
git push origin main --tags
npm publish
```
