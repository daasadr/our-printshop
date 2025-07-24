# Implementace design_info pole pro produkty

## Přehled
Přidali jsme nové pole `design_info` do produktů, které umožňuje návrhářům přidat poutavý popis svého designu. Toto pole se zobrazuje na stránce produktu v nové vizuálně oddělené sekci.

## Co bylo implementováno

### 1. Databázové změny
- Přidáno pole `design_info` (TEXT) do tabulky `products`
- Přidány Directus metadata pro správné zobrazení v admin rozhraní
- Aktualizována sort čísla pro všechna pole

### 2. Backend změny
- **Typy**: Přidáno `design_info?: string` do `Product` interface
- **Synchronizace**: Upravena synchronizace z Printful pro načítání dlouhého popisu
- **API**: Automaticky zahrnuto v API endpointu (používá `'*'`)

### 3. Frontend změny
- **ProductDetail komponenta**: Nová sekce pro zobrazení design_info
- **Styling**: Vizuálně oddělená sekce s modrým borderem a šedým pozadím
- **Logika**: Zobrazuje se pouze pokud je design_info vyplněno

## Instrukce pro nasazení

### Krok 1: Spustit SQL skript
```bash
# Spustit v Directus databázi
mysql -u username -p database_name < add_design_info_field.sql
```

### Krok 2: Restartovat Directus
```bash
# Restartovat Directus server pro načtení nových metadat
```

### Krok 3: Synchronizovat produkty
```bash
# Spustit synchronizaci pro načtení dlouhých popisů z Printful
curl -X POST http://localhost:3000/api/sync-printful-to-wilderness/products
```

### Krok 4: Testovat
1. Jít na stránku produktu
2. Zkontrolovat, zda se zobrazuje design_info sekce (pokud existuje)
3. V Directus admin rozhraní přidat design_info k některému produktu
4. Zkontrolovat, zda se zobrazuje na frontendu

## Jak to funguje

### Zobrazení na stránce produktu
1. **Design info od návrháře** (pokud existuje)
   - Vizuálně oddělená sekce s modrým borderem
   - Šedé pozadí pro lepší čitelnost
   - Bez nadpisu - pouze text

2. **Základní popis produktu** (z Printful)
   - Standardní popis pod design_info
   - Zobrazuje se vždy, pokud existuje

3. **Detaily produktu** (pevně dané)
   - Materiál, potisk, výroba, expedice, doručení

### Logika zobrazení
- Pokud je `design_info` vyplněno: zobrazí se design_info + description
- Pokud není `design_info` vyplněno: zobrazí se pouze description
- Pokud není ani `description`: nezobrazí se žádný popis

## Technické detaily

### Pole v databázi
```sql
ALTER TABLE products ADD COLUMN design_info TEXT;
```

### TypeScript interface
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  design_info?: string; // Nové pole
  // ... ostatní pole
}
```

### Synchronizace
```typescript
const productData: ProductData = {
  // ... ostatní pole
  description: productDetail?.sync_product?.description || null,
  design_info: productDetail?.sync_product?.design_info || null, // Nové pole
  // ... ostatní pole
};
```

### Frontend zobrazení
```tsx
{/* Design info od návrháře */}
{product.design_info && (
  <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
    <p className="text-gray-700 leading-relaxed">{product.design_info}</p>
  </div>
)}

{/* Základní popis produktu */}
{product.description && (
  <p className="text-gray-600 mb-6">{product.description}</p>
)}
```

## Poznámky
- Pole `design_info` je volitelné (nullable)
- Synchronizace z Printful načítá dlouhý popis do `description` pole
- Návrháři mohou přidat `design_info` ručně v Directus admin rozhraní
- Vizuální oddělení pomáhá uživatelům rozlišit mezi design_info a technickým popisem 