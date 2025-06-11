import { FormattedProduct } from '@/types/prisma';

// Poradie kolekcií podľa preferencie
const COLLECTION_ORDER = [
  'šnúrkové bikiny',
  'jednodielne plavky',
  'šaty',
  'detské plavky',
  'podobné dizajny',
  'nezaradené',
];

function getCollectionOrderIndex(collections: string[] | undefined): number {
  if (!collections || collections.length === 0) return COLLECTION_ORDER.length;
  // Nájde najvyššie poradie kolekcie, v ktorej sa produkt nachádza
  const indexes = collections.map(col => COLLECTION_ORDER.indexOf(col)).filter(idx => idx !== -1);
  return indexes.length > 0 ? Math.min(...indexes) : COLLECTION_ORDER.length;
}

function shuffle<T>(array: T[]): T[] {
  // Fisher-Yates shuffle
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Vyberie podobné produkty podľa kolekcií, zoradí podľa poradia kolekcií a v rámci kolekcie náhodne premieša.
 * @param allProducts - všetky produkty
 * @param currentProduct - aktuálny produkt
 * @param limit - maximálny počet podobných produktov (default 4)
 */
export function getSimilarProductsByCollections(
  allProducts: FormattedProduct[],
  currentProduct: FormattedProduct,
  limit: number = 4
): FormattedProduct[] {
  if (!currentProduct.collections || currentProduct.collections.length === 0) {
    // Ak produkt nemá kolekcie, vráť náhodné produkty (okrem seba)
    return shuffle(allProducts.filter(p => p.id !== currentProduct.id)).slice(0, limit);
  }

  // Vyber produkty, ktoré majú aspoň jednu spoločnú kolekciu
  const similar = allProducts.filter(p =>
    p.id !== currentProduct.id &&
    p.collections &&
    p.collections.some(col => currentProduct.collections!.includes(col))
  );

  // Ak je podobných produktov menej ako limit, doplň náhodné ďalšie
  if (similar.length < limit) {
    const others = allProducts.filter(p =>
      p.id !== currentProduct.id &&
      (!p.collections || !p.collections.some(col => currentProduct.collections!.includes(col)))
    );
    // Pridaj náhodné ďalšie produkty
    while (similar.length < limit && others.length > 0) {
      const idx = Math.floor(Math.random() * others.length);
      similar.push(others.splice(idx, 1)[0]);
    }
  }

  // Zoradíme podľa poradia kolekcií a v rámci každej kolekcie premiešame
  const grouped: Record<number, FormattedProduct[]> = {};
  for (const product of similar) {
    const idx = getCollectionOrderIndex(product.collections);
    if (!grouped[idx]) grouped[idx] = [];
    grouped[idx].push(product);
  }
  let result: FormattedProduct[] = [];
  for (let i = 0; i <= COLLECTION_ORDER.length; i++) {
    if (grouped[i]) {
      result = result.concat(shuffle(grouped[i]));
    }
  }
  return result.slice(0, limit);
} 