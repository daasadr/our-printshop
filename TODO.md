# TODO 

## [vetev feat/synchronizace-produktu] 1.1 Synchronizace produktů z Printful do Directusu 
       (správné načtení + rozdělení do kategorií)

## 1.2 Zajistit, ať se na homepage zobrazuje v nejnovějších pouze 4 poslední přidané produkty. (hotovo)
## 1.3 Zobrazení stránek kategorií a detailu - sránky jednoho produktu(Well done)
ujištění se, že se produkty správně zobrazují v kategoriích(Done), tránce jednotlivého produktu, že jdou vložit do košíku, přejít k platbě, na všech místech funguje správně přepočet měn.


## 2. merge větve LuGo do main (newsletter a překlady) (Done)

## 3. kontrola překladů a newsletteru (newsletter možná nebude fungovat bez resend tokenu - zjistím) (Done)

## 4. User účty - Plně funkční uživatelské rozhraní

### 4.1 Databázový model (Directus Collections)
- [ ] **Rozšíření User kolekce**:
  - `email_verified` (boolean) - ověření emailu
  - `email_verification_token` (string) - token pro ověření
  - `password_reset_token` (string) - token pro reset hesla
  - `password_reset_expires` (datetime) - expirace reset tokenu
  - `role` (string) - 'customer' | 'admin'
  - `status` (string) - 'active' | 'inactive' | 'banned'
  - `last_login` (datetime) - poslední přihlášení
  - `avatar_url` (string) - profilový obrázek
  - `phone` (string) - telefonní číslo
  - `date_of_birth` (date) - datum narození
  - `newsletter_subscription` (boolean) - odběr newsletteru
  - `gdpr_consent` (boolean) - GDPR souhlas
  - `gdpr_consent_date` (datetime) - datum GDPR souhlasu

- [ ] **Nová kolekce UserAddress**:
  - `user` (FK to users) - vztah k uživateli
  - `type` (string) - 'billing' | 'shipping' | 'both'
  - `is_default` (boolean) - výchozí adresa
  - `first_name`, `last_name` (string) - jméno a příjmení
  - `company` (string) - firma (volitelné)
  - `address_line_1`, `address_line_2` (string) - adresa
  - `city`, `state`, `postal_code`, `country` (string) - město, stát, PSČ, země
  - `phone` (string) - telefon

- [ ] **Nová kolekce UserWishlist**:
  - `user` (FK to users) - vztah k uživateli
  - `product` (FK to products) - vztah k produktu
  - `variant` (FK to variants) - vztah k variantě (volitelné)
  - `added_at` (datetime) - datum přidání

- [ ] **Nová kolekce UserPreferences**:
  - `user` (FK to users) - vztah k uživateli
  - `currency` (string) - 'CZK' | 'EUR' | 'GBP'
  - `language` (string) - 'cs' | 'sk' | 'de' | 'en'
  - `email_notifications` (json) - nastavení notifikací

### 4.2 API Endpoints
- [ ] **Auth & Registration**:
  - `POST /api/auth/verify-email` - ověření emailu
  - `POST /api/auth/forgot-password` - žádost o reset hesla
  - `POST /api/auth/reset-password` - reset hesla
  - `POST /api/auth/resend-verification` - znovuodeslání ověření

- [ ] **User Profile**:
  - `GET /api/user/profile` - získání profilu
  - `PUT /api/user/profile` - aktualizace profilu
  - `GET /api/user/addresses` - seznam adres
  - `POST /api/user/addresses` - přidání adresy
  - `PUT /api/user/addresses/[id]` - aktualizace adresy
  - `DELETE /api/user/addresses/[id]` - smazání adresy
  - `PUT /api/user/addresses/default` - nastavení výchozí adresy
  - `GET /api/user/preferences` - uživatelské preference
  - `PUT /api/user/preferences` - aktualizace preferencí
  - `POST /api/user/avatar` - nahrání avataru

- [ ] **Wishlist**:
  - `GET /api/user/wishlist` - seznam oblíbených
  - `POST /api/user/wishlist/add` - přidání do oblíbených
  - `DELETE /api/user/wishlist/remove` - odebrání z oblíbených
  - `POST /api/user/wishlist/move-to-cart` - přesun do košíku

- [ ] **Orders**:
  - `GET /api/user/orders` - historie objednávek
  - `GET /api/user/orders/[id]` - detail objednávky
  - `POST /api/user/orders/[id]/cancel` - zrušení objednávky
  - `POST /api/user/orders/[id]/reorder` - opakování objednávky

### 4.3 Frontend Pages & Components
- [ ] **Stránky**:
  - `/[lang]/account/` - uživatelský dashboard
  - `/[lang]/account/profile` - správa profilu
  - `/[lang]/account/addresses` - správa adres
  - `/[lang]/account/orders` - historie objednávek
  - `/[lang]/account/wishlist` - oblíbené produkty
  - `/[lang]/account/settings` - nastavení účtu
  - `/[lang]/account/security` - bezpečnost

- [ ] **Komponenty**:
  - `AuthForm.tsx` - unifikovaný přihlašovací formulář
  - `EmailVerification.tsx` - ověření emailu
  - `PasswordReset.tsx` - reset hesla
  - `UserDashboard.tsx` - hlavní dashboard
  - `ProfileForm.tsx` - formulář profilu
  - `AddressForm.tsx` - formulář adresy
  - `AddressSelector.tsx` - výběr adresy
  - `OrderHistory.tsx` - historie objednávek
  - `WishlistItem.tsx` - položka oblíbených
  - `UserPreferences.tsx` - uživatelské preference

### 4.4 Email Services
- [ ] **Email templates**:
  - `welcome.tsx` - uvítací email
  - `verification.tsx` - ověření emailu
  - `password-reset.tsx` - reset hesla
  - `order-confirmation.tsx` - potvrzení objednávky
  - `order-updates.tsx` - aktualizace objednávky

- [ ] **Email service**:
  - Integrace s Resend
  - Template rendering
  - Email queuing
  - Spam protection

### 4.5 Security & Middleware
- [ ] **Middleware**:
  - Auth protection pro chráněné routy
  - Role-based access control
  - Rate limiting
  - CSRF protection

- [ ] **Security features**:
  - Password strength validation
  - Email verification flow
  - Session management
  - GDPR compliance
  - Data encryption

### 4.6 Integration s existujícími systémy
- [ ] **Checkout proces**:
  - Integrace s uživatelskými adresami
  - Automatické vyplnění údajů přihlášeného uživatele
  - Uložení objednávek do uživatelského profilu
  - Synchronizace košíku mezi zařízeními

- [ ] **Košík**:
  - Perzistentní košík pro přihlášené uživatele
  - Synchronizace lokálního a serverového košíku
  - Wishlist integrace

- [ ] **Notifikace**:
  - Email notifikace o objednávkách
  - Push notifikace (budoucí rozšíření)
  - In-app notifikace

### 4.7 UX/UI Features
- [ ] **Responsive design**:
  - Mobile-first approach
  - Tablet optimization
  - Desktop enhancement

- [ ] **Accessibility**:
  - WCAG 2.1 compliance
  - Keyboard navigation
  - Screen reader support
  - High contrast mode

- [ ] **Performance**:
  - Server-side rendering
  - Image optimization
  - Lazy loading
  - Caching strategies

### 4.8 Testing & Quality Assurance
- [ ] **Unit tests**:
  - API endpoints
  - Utility functions
  - Component logic

- [ ] **Integration tests**:
  - Auth flow
  - Checkout process
  - Email sending

- [ ] **E2E tests**:
  - User registration
  - Order placement
  - Profile management

### 4.9 Documentation
- [ ] **API documentation**:
  - OpenAPI/Swagger spec
  - Endpoint descriptions
  - Request/response examples

- [ ] **User documentation**:
  - User guides
  - FAQ
  - Troubleshooting

### 4.10 Deployment & Monitoring
- [ ] **Environment setup**:
  - Production configuration
  - Environment variables
  - Database migrations

- [ ] **Monitoring**:
  - Error tracking
  - Performance monitoring
  - User analytics

# USKUTEČNĚNÉ ZMĚNY

## Sk/Cz verze s možností EUR/CZK

## Implementace design_info pole pro produkty
- **Přidáno pole `design_info`** do produktů v Directus pro návrháře
- **Frontend zobrazení**: Nová vizuálně oddělená sekce s modrým borderem na stránce produktu
- **Logika**: Zobrazuje se design_info (pokud existuje) + description z Printful
- **Backend**: Upraveny TypeScript typy a synchronizace pro podporu nového pole