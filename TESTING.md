# Testing Guide - Autentifikační Systém

## 🧪 Přehled Testů

Tento projekt obsahuje unit testy pro autentifikační systém založený na JWT tokenech.

## 📦 Instalace

Testovací prostředí je již nainstalováno. Použité knihovny:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest
```

## 🚀 Spouštění Testů

### Všechny testy
```bash
npm test
```

### Testy s coverage reportem
```bash
npm run test:coverage
```

### Testy v watch módu (pro vývoj)
```bash
npm run test:watch
```

### Konkrétní test soubor
```bash
npm test -- src/lib/__tests__/jwt-auth-simple.test.ts
```

## 📁 Struktura Testů

### 1. JWT Autentifikace (`src/lib/__tests__/jwt-auth-simple.test.ts`)
- ✅ Generování JWT tokenů
- ✅ Ověřování JWT tokenů
- ✅ Hashování hesel s Argon2
- ✅ Ověřování hesel

### 2. React Komponenty (`src/components/__tests__/LoginForm.test.tsx`)
- ✅ Renderování formuláře
- ✅ Validace formuláře
- ✅ Úspěšné přihlášení
- ✅ Zpracování chyb
- ✅ Loading stavy

### 3. API Endpointy (`src/app/api/auth/__tests__/login-directus.test.ts`)
- ✅ Login endpoint
- ✅ Validace vstupů
- ✅ Zpracování chyb

## 🎯 Pokrytí Testů

Aktuální pokrytí:
- **LoginForm**: 91.89% coverage ✅
- **JWT Auth**: Základní funkcionalita ✅
- **API Endpoints**: Základní testy ✅

## 🔧 Konfigurace

### Jest Configuration (`jest.config.js`)
- Nastaveno pro Next.js
- Podpora TypeScript
- Mock pro localStorage a fetch
- Coverage reporting

### Test Setup (`jest.setup.js`)
- Mock pro Next.js router
- Mock pro localStorage
- Mock pro environment variables

## 📝 Přidávání Nových Testů

### 1. Pro JWT Auth
```typescript
// src/lib/__tests__/new-feature.test.ts
import { JWTAuth } from '../jwt-auth'

describe('New Feature', () => {
  it('should work correctly', () => {
    // test implementation
  })
})
```

### 2. Pro React Komponenty
```typescript
// src/components/__tests__/NewComponent.test.tsx
import { render, screen } from '@testing-library/react'
import NewComponent from '../NewComponent'

describe('NewComponent', () => {
  it('should render correctly', () => {
    render(<NewComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

### 3. Pro API Endpointy
```typescript
// src/app/api/__tests__/new-endpoint.test.ts
import { NextRequest } from 'next/server'
import { POST } from '../new-endpoint/route'

describe('/api/new-endpoint', () => {
  it('should handle request correctly', async () => {
    // test implementation
  })
})
```

## 🐛 Řešení Problémů

### Časté chyby:

1. **"Cannot find module"**
   - Zkontrolujte, že cesta k modulu je správná
   - Použijte `@/` alias pro src složku

2. **"localStorage is not defined"**
   - Mock je již nastaven v `jest.setup.js`
   - Použijte `localStorage.setItem.mockClear()` v `beforeEach`

3. **"fetch is not defined"**
   - Mock je již nastaven v `jest.setup.js`
   - Použijte `(fetch as jest.Mock).mockResolvedValueOnce()`

## 📊 Coverage Report

Po spuštění `npm run test:coverage` se vygeneruje report v:
- `coverage/lcov-report/index.html` - HTML report
- `coverage/lcov.info` - LCOV format pro CI/CD

## 🚀 CI/CD Integrace

Pro automatické spouštění testů v CI/CD:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
```

## 🎯 Best Practices

1. **Pojmenování testů**: Používejte popisné názvy
2. **AAA Pattern**: Arrange, Act, Assert
3. **Mockování**: Mockujte externí závislosti
4. **Isolation**: Každý test by měl být nezávislý
5. **Coverage**: Snažte se dosáhnout alespoň 80% pokrytí

## 📚 Užitečné Odkazy

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js Testing](https://nextjs.org/docs/testing) 