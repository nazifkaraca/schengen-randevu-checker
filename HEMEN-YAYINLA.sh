#!/bin/bash

echo "═══════════════════════════════════════════════════════════════"
echo "  SCHENGEN RANDEVU CHECKER - YAYINLAMA SCRIPTI"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Renk kodları
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}1. GitHub'a Yükleme${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Önce GitHub'da yeni repo oluştur:"
echo "https://github.com/new"
echo ""
echo "Repo adı: schengen-randevu-checker"
echo "Public seç, README ekleme"
echo ""
read -p "GitHub'da repo oluşturdun mu? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo ""
    echo "GitHub'a yükleniyor..."
    git remote add origin https://github.com/ibidi/schengen-randevu-checker.git 2>/dev/null || git remote set-url origin https://github.com/ibidi/schengen-randevu-checker.git
    git branch -M main
    git push -u origin main
    
    echo ""
    echo -e "${GREEN}✓ GitHub'a yüklendi!${NC}"
    echo "https://github.com/ibidi/schengen-randevu-checker"
    echo ""
fi

echo ""
echo -e "${BLUE}2. NPM'e Yayınlama${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "NPM'e giriş yapman gerekiyor..."
echo ""
echo "Kullanıcı adı: npm kullanıcı adın"
echo "Email: info@ihsanbakidogan.com"
echo ""

npm login

if [ $? -eq 0 ]; then
    echo ""
    echo "NPM'e yayınlanıyor..."
    npm publish --access public
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✓✓✓ BAŞARILI! ✓✓✓${NC}"
        echo ""
        echo "Paket yayınlandı:"
        echo "https://www.npmjs.com/package/schengen-randevu-checker"
        echo ""
        echo "Kullanıcılar şöyle yükleyebilir:"
        echo -e "${YELLOW}npm install schengen-randevu-checker${NC}"
        echo ""
    else
        echo ""
        echo "Hata: NPM yayınlama başarısız"
        echo ""
        echo "Olası nedenler:"
        echo "- Paket adı zaten kullanılıyor"
        echo "- Email doğrulanmamış"
        echo "- İzin sorunu"
        echo ""
        echo "Çözüm: package.json'da farklı bir isim dene"
    fi
else
    echo ""
    echo "NPM giriş başarısız"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
