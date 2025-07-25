# Preklady produktov - Návod

## 🎯 Problém
Produkty z Printful majú názvy len v jednom jazyku (anglicky). Potrebujeme ich prekladať do všetkých podporovaných jazykov.

## ✅ Riešenie 1: Prekladové polia v Directus (Odporúčané)

### 1. Pridanie prekladových polí do Directus

V Directus admin paneli pridajte do kolekcie `products` tieto polia:

#### Pre názvy produktov:
- `name_cs` (Text) - Český názov
- `name_sk` (Text) - Slovenský názov  
- `name_en` (Text) - Anglický názov
- `name_de` (Text) - Nemecký názov

#### Pre popisy produktov:
- `description_cs` (Text) - Český popis
- `description_sk` (Text) - Slovenský popis
- `description_en` (Text) - Anglický popis
- `description_de` (Text) - Nemecký popis

### 2. Príklad prekladov

| Anglický názov | Český preklad | Slovenský preklad | Nemecký preklad |
|----------------|---------------|-------------------|-----------------|
| One-Piece Swimsuit | Celé plavky | Celé plavky | Einteiler-Badeanzug |
| Unisex Hoodie | Unisex mikina | Unisex mikina | Unisex Kapuze |
| Men's T-Shirt | Pánské tričko | Pánske tričko | Herren-T-Shirt |

### 3. Automatické preklady

#### Možnosť A: Google Translate API
```javascript
// Skript na automatické preklady
const translateProduct = async (product) => {
  const translations = {
    name_cs: await translate(product.name, 'en', 'cs'),
    name_sk: await translate(product.name, 'en', 'sk'),
    name_de: await translate(product.name, 'en', 'de'),
    description_cs: await translate(product.description, 'en', 'cs'),
    description_sk: await translate(product.description, 'en', 'sk'),
    description_de: await translate(product.description, 'en', 'de'),
  };
  
  return translations;
};
```

#### Možnosť B: ChatGPT API
```javascript
// Presnejšie preklady s kontextom
const translateWithGPT = async (text, targetLang) => {
  const prompt = `Prelož tento text do ${targetLang} jazyka, 
  berúc do úvahy že ide o názov oblečenia/produktu: "${text}"`;
  
  // Volanie ChatGPT API
  return await callChatGPT(prompt);
};
```

## 🔄 Riešenie 2: Externá prekladová databáza

### Vytvorenie samostatnej kolekcie `product_translations`:

```sql
CREATE TABLE product_translations (
  id INT PRIMARY KEY,
  product_id VARCHAR(255),
  locale VARCHAR(10),
  field_name VARCHAR(50),
  translated_value TEXT,
  UNIQUE(product_id, locale, field_name)
);
```

### Príklad dát:
```
product_id: "100"
locale: "cs"
field_name: "name"
translated_value: "Celé plavky"

product_id: "100"
locale: "sk" 
field_name: "name"
translated_value: "Celé plavky"
```

## 🚀 Riešenie 3: Hybridný prístup

### Kombinácia automatických a manuálnych prekladov:

1. **Automatické preklady** pri importe z Printful
2. **Manuálna kontrola** a úprava prekladov
3. **Fallback** na originálny text ak preklad neexistuje

### Implementácia:
```javascript
export const translateProduct = (product, locale) => {
  // 1. Skús preklad z databázy
  const translatedName = product[`name_${locale}`];
  if (translatedName) return translatedName;
  
  // 2. Fallback na originálny text
  return product.name;
};
```

## 📋 Implementačný plán

### Fáza 1: Základná infraštruktúra
- [x] Pridanie prekladových polí do TypeScript typov
- [x] Vytvorenie prekladových funkcií
- [x] Úprava API endpointov

### Fáza 2: Directus konfigurácia
- [ ] Pridanie prekladových polí do Directus
- [ ] Vytvorenie admin rozhrania pre preklady
- [ ] Import existujúcich produktov

### Fáza 3: Automatizácia
- [ ] Skript na automatické preklady
- [ ] Integrácia s Google Translate/ChatGPT
- [ ] Batch processing pre existujúce produkty

### Fáza 4: Optimalizácia
- [ ] Cachovanie prekladov
- [ ] Lazy loading prekladov
- [ ] Performance monitoring

## 💡 Tipy pre preklady

### 1. Konzistentnosť
- Používajte rovnaké termíny pre rovnaké typy oblečenia
- Vytvorte slovníček pojmov

### 2. SEO optimalizácia
- Preklady by mali obsahovať relevantné kľúčové slová
- Zohľadnite lokálne vyhľadávacie zvyky

### 3. Kultúrna citlivosť
- Niektoré produkty môžu mať rôzne názvy v rôznych krajinách
- Zohľadnite lokálne módy a trendy

## 🔧 Nástroje pre preklady

### Automatické preklady:
- Google Translate API
- DeepL API
- ChatGPT API
- Microsoft Translator

### Manuálne preklady:
- Directus admin panel
- Excel/CSV import
- Crowdin (pre väčšie projekty)

## 📊 Monitoring a analýza

### Metriky na sledovanie:
- Počet preložených produktov
- Kvalita prekladov (user feedback)
- Performance impact
- SEO ranking v rôznych jazykoch 