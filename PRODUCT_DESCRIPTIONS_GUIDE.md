# 🎯 Automatické generovanie popisov produktov - Kompletný návod

## 📋 Prehľad riešenia

Namiesto manuálneho písania popisov pre každý produkt sme implementovali **kategóriálne šablóny**, ktoré sa automaticky aplikujú na nové produkty a môžu sa použiť aj pre existujúce produkty.

## 🚀 Ako to funguje

### 1. **Kategóriálne šablóny**
- Každá kategória má vlastnú šablónu popisu
- Šablóny sú dostupné vo všetkých jazykoch (CS, SK, EN, DE)
- Automatické nahradenie `{product_name}` skutočným názvom produktu

### 2. **Automatické generovanie**
- **Nové produkty**: Popisy sa generujú automaticky pri synchronizácii z Printful
- **Existujúce produkty**: Môžete spustiť skript na generovanie popisov

### 3. **Inteligentné rozpoznávanie**
- Kategória sa určuje z názvu produktu
- Typ produktu sa rozpoznáva (t-shirt, hoodie, poster, atď.)
- Fallback na univerzálny popis ak sa kategória nerozpozná

## 📁 Štruktúra súborov

```
src/lib/productDescriptionTemplates.ts    # Šablóny popisov
scripts/generateProductDescriptions.ts    # Skript na generovanie
scripts/run-generate-descriptions.js      # Spúšťací skript
```

## 🛠️ Použitie

### Pre existujúce produkty:

```bash
# Spusti generovanie popisov pre všetky produkty bez popisu
node scripts/run-generate-descriptions.js
```

### Pre nové produkty:
Popisy sa generujú automaticky pri synchronizácii z Printful.

## 📝 Šablóny popisov

### Kategórie:

#### 👔 Pánske oblečenie (men)
```cs
Stylové {product_name} pro moderní muže. Vyrobeno z kvalitních materiálů pro maximální pohodlí a trvanlivost. Ideální pro každodenní nošení i speciální příležitosti.
```

#### 👗 Dámske oblečenie (women)
```cs
Elegantní {product_name} pro ženy, které chtějí vyjádřit svůj jedinečný styl. Kvalitní materiály a pečlivé zpracování zajišťují pohodlí a krásu.
```

#### 👶 Detské oblečenie (kids)
```cs
Veselé a pohodlné {product_name} pro děti. Bezpečné materiály a zábavné designy, které děti milují. Ideální pro aktivní děti.
```

#### 🏠 Domáce dekorácie (home-decor)
```cs
Krásné {product_name} pro váš domov. Přidejte osobní styl do vašeho interiéru s našimi originálními designy.
```

### Typy produktov:

#### 👕 Tričká (t-shirt)
```cs
Stylové tričko {product_name} z 100% bavlny. Měkký materiál a pohodlný střih zajišťují maximální pohodlí.
```

#### 🧥 Mikiny (hoodie)
```cs
Teplá a pohodlná mikina {product_name}. Ideální pro chladnější dny a relaxaci.
```

#### 🖼️ Plagáty (poster)
```cs
Krásný plakát {product_name} pro váš domov. Vytištěno na kvalitním papíru s živými barvami.
```

## 🔧 Konfigurácia

### Pridanie novej kategórie:

1. Otvorte `src/lib/productDescriptionTemplates.ts`
2. Pridajte novú kategóriu do `PRODUCT_DESCRIPTION_TEMPLATES`
3. Pridajte logiku rozpoznávania v synchronizačnom skripte

```typescript
{
  category: 'nová-kategória',
  templates: {
    cs: `Popis pre český jazyk {product_name}`,
    sk: `Popis pre slovenský jazyk {product_name}`,
    en: `Description for English {product_name}`,
    de: `Beschreibung für Deutsch {product_name}`
  }
}
```

### Pridanie nového typu produktu:

```typescript
'nový-typ': {
  category: 'kategória',
  templates: {
    cs: `Špecifický popis pre {product_name}`,
    // ... ostatné jazyky
  }
}
```

## 📊 Monitoring

### Skontrola generovaných popisov:

1. **Directus Admin Panel**:
   - Prejdite na kolekciu `products`
   - Skontrolujte polia `description_cs`, `description_sk`, `description_en`, `description_de`

2. **API Endpoint**:
   ```bash
   curl "http://localhost:3000/api/products?locale=cs"
   ```

## 🎯 Výhody tohto riešenia

### ✅ Pre vás:
- **Úspora času**: Žiadne manuálne písanie popisov
- **Konzistentnosť**: Všetky produkty majú podobný štýl popisu
- **Multijazyčnosť**: Automatické preklady do všetkých jazykov
- **Škálovateľnosť**: Funguje pre 100 aj 1000 produktov

### ✅ Pre zákazníkov:
- **Profesionálne popisy**: Každý produkt má kvalitný popis
- **Lokalizácia**: Popisy v ich jazyku
- **Konzistentnosť**: Rovnaký štýl pre všetky produkty

## 🔄 Workflow

### Pre nové produkty:
1. Pridajte produkt do Printful
2. Spustite synchronizáciu
3. Popis sa vygeneruje automaticky
4. Voliteľne upravte v Directus

### Pre existujúce produkty:
1. Spustite `node scripts/run-generate-descriptions.js`
2. Skontrolujte výsledky v Directus
3. Upravte podľa potreby

## 🚨 Riešenie problémov

### Chyba: "Cannot find module"
```bash
# Nainštalujte závislosti
npm install ts-node @types/node
```

### Chyba: "Directus connection failed"
- Skontrolujte Directus URL a token v `.env`
- Overte, či je Directus dostupné

### Produkty bez popisu:
- Spustite skript znovu
- Skontrolujte logy pre chyby
- Manuálne pridajte popisy pre problematické produkty

## 📈 Rozšírenia

### 1. **AI generované popisy**
```typescript
// Integrácia s ChatGPT API pre unikátne popisy
const aiDescription = await generateAIDescription(productName, category);
```

### 2. **SEO optimalizované popisy**
```typescript
// Pridanie kľúčových slov podľa kategórie
const seoDescription = addSEOKeywords(description, category);
```

### 3. **Dynamické šablóny**
```typescript
// Šablóny založené na sezónnosti, trendoch, atď.
const seasonalTemplate = getSeasonalTemplate(category, currentSeason);
```

## 💡 Tipy

1. **Pravidelne aktualizujte šablóny** podľa feedbacku zákazníkov
2. **Pridávajte kľúčové slová** relevantné pre vaše produkty
3. **Testujte popisy** na skutočných zákazníkoch
4. **Monitorujte SEO výkon** v rôznych jazykoch

---

**Toto riešenie vám ušetrí hodiny práce a zabezpečí konzistentné, profesionálne popisy pre všetky vaše produkty! 🎉** 