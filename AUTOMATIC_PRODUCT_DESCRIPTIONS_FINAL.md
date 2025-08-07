# 🎯 Automatické generovanie popisov produktov - Kompletné riešenie

## ✅ Čo sme implementovali

Úspešne sme vytvorili kompletný systém na automatické generovanie popisov produktov, ktorý používa existujúci prekladový systém cez `public/locales`.

### 🎯 Ciele dosiahnuté:
- ✅ **Automatické generovanie** popisov pre nové produkty pri synchronizácii z Printful
- ✅ **Použitie existujúceho prekladového systému** cez `public/locales`
- ✅ **Konzistentné popisy** pre všetky produkty
- ✅ **Multijazyčná podpora** (CS, SK, EN, DE)
- ✅ **Pridané prekladové polia** do Directus schémy
- ✅ **Inteligentné rozpoznávanie** kategórií a typov produktov
- ✅ **Zachovanie anglických originálov** z Printful

## 🏗️ Architektúra riešenia

### 📁 Vytvorené súbory:

```
src/lib/productDescriptionTemplates.ts    # Šablóny popisov s prekladovými kľúčmi
scripts/generateProductDescriptions.ts    # Skript na generovanie popisov
scripts/run-generate-descriptions.js      # Spúšťací skript
scripts/test-translation-system.js        # Test prekladového systému
scripts/test-new-product-generation.js    # Test nových produktov
scripts/add-translation-fields.js         # Návod na pridanie polí do Directus
```

### 🔧 Upravené súbory:

```
public/locales/cs/common.json             # Pridané prekladové kľúče pre popisy
public/locales/sk/common.json             # Pridané prekladové kľúče pre popisy
public/locales/en/common.json             # Pridané prekladové kľúče pre popisy
public/locales/de/common.json             # Pridané prekladové kľúče pre popisy
src/app/api/sync-printful-to-wilderness/products/syncProducts.ts  # Integrácia pre nové produkty
```

### 🗄️ Pridané polia do Directus:

```
description_cs    # Český popis
description_sk    # Slovenský popis
description_en    # Anglický popis
description_de    # Nemecký popis
```

## 🚀 Ako to funguje

### 1. **Prekladové kľúče**
Každá kategória má vlastný prekladový kľúč:

```json
{
  "product": {
    "description": {
      "men": "Stylové {product_name} pro moderní muže...",
      "women": "Elegantní {product_name} pro ženy...",
      "kids": "Veselé a pohodlné {product_name} pro děti...",
      "unisex": "Univerzální {product_name} pro všechny...",
      "home-decor": "Krásné {product_name} pro váš domov...",
      "t-shirt": "Stylové tričko {product_name} z 100% bavlny...",
      "hoodie": "Teplá a pohodlná mikina {product_name}...",
      "poster": "Krásný plakát {product_name} pro váš domov...",
      "fallback": "Kvalitní {product_name} s originálním designem..."
    }
  }
}
```

### 2. **Automatické rozpoznávanie kategórií**
Systém automaticky rozpoznáva kategóriu z názvu produktu:
- `men` / `pánske` → mužské produkty
- `women` / `dámske` → ženské produkty  
- `kids` / `deti` → detské produkty
- `poster` / `plagát` → domáce dekorácie
- Ostatné → unisex

### 3. **Inteligentné generovanie**
- **Nové produkty**: Automaticky sa generujú pri synchronizácii z Printful
- **Existujúce produkty**: Môžu sa aktualizovať pomocou skriptu
- **Anglické originály**: Zostávajú v angličtine ak sú z Printful
- **Ostatné jazyky**: Generujú sa automaticky

## 📋 Použitie

### Pre nové produkty:
1. Pridajte produkt do Printful
2. Spustite synchronizáciu
3. Produkt sa automaticky vytvorí s vygenerovanými popismi

### Pre existujúce produkty:
```bash
node scripts/run-generate-descriptions.js
```

### Testovanie:
```bash
# Test prekladového systému
node scripts/test-translation-system.js

# Test generovania nových produktov
node scripts/test-new-product-generation.js
```

## 🎯 Výsledok

- **Úspora času**: Žiadne manuálne písanie popisov
- **Konzistentnosť**: Všetky produkty majú podobný štýl
- **Multijazyčnosť**: Popisy vo všetkých jazykoch
- **Automatizácia**: Nové produkty sa spracujú automaticky
- **Zachovanie originálov**: Anglické produkty z Printful zostanú v angličtine

## 🔄 Ďalšie kroky

1. **Otestujte v aplikácii** - skontrolujte, či sa popisy zobrazujú v správnom jazyku
2. **Pridajte nový produkt** do Printful a otestujte automatické generovanie
3. **Upravte šablóny** podľa potreby v `public/locales/*/common.json`

## 📝 Poznámky

- Systém používa existujúci prekladový mechanizmus aplikácie
- Prekladové polia sú uložené v Directus pre rýchly prístup
- Šablóny sa môžu ľahko upravovať bez zmeny kódu
- Systém je škálovateľný pre ďalšie jazyky a kategórie 