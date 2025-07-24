# TODO 

## [vetev feat/synchronizace-produktu] 1.1 Synchronizace produktů z Printful do Directusu 
       (správné načtení + rozdělení do kategorií)

## 1.2 Zajistit, ať se na homepage zobrazuje v nejnovějších pouze 4 poslední přidané produkty. (hotovo)
## 1.3 Zobrazení stránek kategorií a detailu - sránky jednoho produktu(Well done)
ujištění se, že se produkty správně zobrazují v kategoriích(Done), tránce jednotlivého produktu, že jdou vložit do košíku, přejít k platbě, na všech místech funguje správně přepočet měn.


## 2. merge větve LuGo do main (newsletter a překlady)

## 3. kontrola překladů a newsletteru (newsletter možná nebude fungovat bez resend tokenu - zjistím)

## 4. User účty





# USKUTEČNĚNÉ ZMĚNY

## Sk/Cz verze s možností EUR/CZK

## Implementace design_info pole pro produkty
- **Přidáno pole `design_info`** do produktů v Directus pro návrháře
- **Frontend zobrazení**: Nová vizuálně oddělená sekce s modrým borderem na stránce produktu
- **Logika**: Zobrazuje se design_info (pokud existuje) + description z Printful
- **Backend**: Upraveny TypeScript typy a synchronizace pro podporu nového pole