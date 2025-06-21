import { Prisma, Product, Variant, Design, Category, Collection } from '@prisma/client';

// Exporujeme základné typy priamo z Prisma klienta
export type { Product, Variant, Design, Category, Collection };

/**
 * Typ produktu rozšírený o všetky potrebné relácie (vzťahy) z databázy.
 * Používa sa na strane servera pri načítavaní dát.
 */
export type ProductWithRelations = Product & {
  variants: Variant[];
  designs: Design[];
  category: Category | null;
  collection: Collection | null;
};

/**
 * Typ produktu naformátovaný pre použitie na frontende.
 * Toto je štruktúra, ktorú očakávajú komponenty.
 */
export type FormattedProduct = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  image?: string;
  variants?: Variant[];
  designs?: Omit<Design, 'productId'>[];
  category?: Category | null;
  collection?: Collection | null;
  collectionId?: string | null;
  shippingPrice?: {
    min: number;
    max: number;
  } | null;
  currency?: string;
};