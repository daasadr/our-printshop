# Admin Panel - Dokumentácia

## 🎯 Prehľad

Admin panel je jednoduchá správa pre e-shop, určená pre vás a vašu kolegyňu. Implementovaný je s možnosťou rozšírenia.

## 🔐 Autentifikácia

### Aktuálne nastavenie:
- **URL:** `/admin`
- **Heslo:** `admin123` (nastavené v `.env.local`)
- **Typ:** Jednoduchá autentifikácia cez heslo

### Zmena hesla:
1. Upravte `NEXT_PUBLIC_ADMIN_PASSWORD` v `.env.local`
2. Reštartujte aplikáciu

## 📁 Štruktúra

```
src/
├── app/admin/
│   ├── page.tsx              # Hlavný dashboard
│   └── orders/
│       └── page.tsx          # Správa objednávok
├── components/admin/
│   └── AdminLayout.tsx       # Layout s navigáciou
└── middleware.ts             # Ochrana admin panelu
```

## 🚀 Funkcie

### ✅ Implementované:
- **Dashboard** - prehľad štatistík
- **Správa objednávok** - zobrazenie a zmena statusu
- **Responsive design** - mobilné aj desktop zobrazenie
- **Jednoduchá autentifikácia** - heslo v env
- **Navigácia** - sidebar s menu

### 🔄 Plánované rozšírenia:
- **Správa produktov** - CRUD operácie
- **Správa používateľov** - zobrazenie registrácií
- **Nastavenia** - konfigurácia e-shopu
- **Analytics** - pokročilé štatistiky
- **Plna autentifikácia** - cez Directus

## 🛠️ Technické detaily

### Autentifikácia:
```typescript
// Jednoduchá autentifikácia cez localStorage
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
```

### Middleware ochrana:
```typescript
// Povolenie /admin bez locale
if (pathname === '/admin') {
  return NextResponse.next();
}
```

### Mock dáta:
- Aktuálne používame mock dáta
- Neskôr napojíme na Directus API
- Štruktúra pripravená na skutočné dáta

## 📱 Používanie

### 1. Prihlásenie:
- Otvorte `/admin`
- Zadajte heslo: `admin123`
- Kliknite "Prihlásiť"

### 2. Navigácia:
- **Dashboard** - prehľad štatistík
- **Objednávky** - správa objednávok
- **Produkty** - (pripravované)
- **Používatelia** - (pripravované)
- **Nastavenia** - (pripravované)

### 3. Správa objednávok:
- Zobrazenie všetkých objednávok
- Filtrovanie podľa statusu
- Zmena statusu objednávky
- Zobrazenie detailov objednávky

## 🔧 Konfigurácia

### Environment premenné:
```bash
# .env.local
NEXT_PUBLIC_ADMIN_PASSWORD=vaše_heslo
```

### Bezpečnosť:
- Heslo je v `NEXT_PUBLIC_` - viditeľné v prehliadači
- Pre produkciu odporúčame plnú autentifikáciu
- Admin panel je chránený middleware

## 🚀 Nasadenie

### Lokálny vývoj:
```bash
npm run dev
# Otvorte http://localhost:3000/admin
```

### Produkcia:
1. Nastavte `NEXT_PUBLIC_ADMIN_PASSWORD` v Vercel
2. Deploy aplikácie
3. Admin panel bude dostupný na `/admin`

## 🔮 Budúce rozšírenia

### Fáza 2:
- [ ] Správa produktov (CRUD)
- [ ] Správa používateľov
- [ ] Nastavenia e-shopu
- [ ] Export dát

### Fáza 3:
- [ ] Plná autentifikácia cez Directus
- [ ] Pokročilé analytics
- [ ] Notifikácie
- [ ] API pre externé integrácie

## 📞 Podpora

Pre otázky alebo problémy:
1. Skontrolujte `.env.local` nastavenia
2. Overte či je aplikácia spustená
3. Skontrolujte konzolu pre chyby

---

**Admin panel je pripravený na použitie a rozšírenie!** 🎉

