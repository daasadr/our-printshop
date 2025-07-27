# Exchange Rates API

## Přehled

Toto API načítá reálné kurzy měn z externího API a poskytuje je pro použití v aplikaci. Kurzy se cacheují na 1 hodinu pro optimalizaci výkonu.

## Endpointy

### GET `/api/exchange-rates`

Načte aktuální kurzy měn.

**Response:**
```json
{
  "success": true,
  "rates": {
    "EUR": 1.0,
    "CZK": 24.54,
    "GBP": 0.873
  },
  "cached": false,
  "timestamp": 1753560762080
}
```

### POST `/api/exchange-rates`

Vymaže cache a načte nové kurzy.

**Response:**
```json
{
  "success": true,
  "message": "Cache cleared and rates refreshed",
  "data": {
    "success": true,
    "rates": {...},
    "cached": false,
    "timestamp": 1753560762080
  }
}
```

### GET `/api/test-exchange-rates`

Testovací endpoint pro ověření funkčnosti.

**Response:**
```json
{
  "success": true,
  "timestamp": "2025-07-26T20:12:55.171Z",
  "currentRates": {
    "EUR": 1,
    "CZK": 25,
    "GBP": 0.86
  },
  "individualRates": {
    "EUR": 1,
    "CZK": 25,
    "GBP": 0.86
  },
  "testConversions": {
    "originalPriceEur": 48.5,
    "convertedPrices": {
      "EUR": 48.5,
      "CZK": 1213,
      "GBP": 41.71
    },
    "example": "Produkt za 48.5 EUR se zobrazuje jako:",
    "examples": {
      "CZ": "1213 CZK",
      "SK": "48.5 EUR",
      "EN": "41.71 GBP",
      "DE": "48.5 EUR"
    }
  }
}
```

## Použití v aplikaci

### Import funkcí
```typescript
import { 
  getCurrentExchangeRates, 
  getExchangeRate, 
  convertCurrency 
} from '@/utils/currency';
```

### Získání aktuálních kurzů
```typescript
const rates = getCurrentExchangeRates();
console.log(rates); // { EUR: 1, CZK: 24.54, GBP: 0.873 }
```

### Získání kurzu konkrétní měny
```typescript
const czkRate = getExchangeRate('CZK');
console.log(czkRate); // 24.54
```

### Přepočet ceny
```typescript
const priceEur = 48.5;
const priceCzk = convertCurrency(priceEur, 'CZK');
console.log(priceCzk); // 1190 (zaokrouhleno)
```

## Konfigurace

### Environment Variables

Vytvořte `.env.local` soubor:

```env
# Exchange Rate API Key (volitelné - API funguje i bez klíče)
EXCHANGE_RATE_API_KEY=your_api_key_here
```

### Získání API klíče

1. Zaregistrujte se na [exchangerate-api.com](https://www.exchangerate-api.com/)
2. Získejte API klíč (zdarma až 1000 requestů/měsíc)
3. Přidejte klíč do `.env.local`

## Cache

- **Doba cache:** 1 hodina
- **Cache se automaticky obnovuje** při vypršení
- **Manuální obnovení:** POST request na `/api/exchange-rates`

## Fallback

Pokud API selže, použijí se výchozí kurzy:
- EUR: 1.0
- CZK: 25.0
- GBP: 0.86

## Podporované měny

- **EUR** - Euro (základní měna)
- **CZK** - Česká koruna
- **GBP** - Britská libra

## Příklad použití

```typescript
// V komponentě
import { useLocale } from '@/context/LocaleContext';
import { convertCurrency, formatPrice } from '@/utils/currency';

const MyComponent = () => {
  const { currency } = useLocale();
  
  const priceEur = 48.5;
  const convertedPrice = convertCurrency(priceEur, currency);
  const formattedPrice = formatPrice(convertedPrice, currency);
  
  return <div>Cena: {formattedPrice}</div>;
};
```

## Monitoring

API automaticky loguje:
- Úspěšné načtení kurzů
- Chyby při načítání
- Použití cache vs. nové načtení

## Troubleshooting

### API nefunguje
1. Zkontrolujte internetové připojení
2. Ověřte API klíč (pokud používáte)
3. Zkontrolujte console logy

### Kurzy se neaktualizují
1. Počkejte 1 hodinu nebo
2. Pošlete POST request na `/api/exchange-rates`

### Chybové hlášky
- `API request failed`: Problém s externím API
- `Invalid API response`: Neplatná odpověď z API
- `Using fallback rates`: Používají se výchozí kurzy 