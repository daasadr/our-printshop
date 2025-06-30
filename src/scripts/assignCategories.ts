import dotenv from 'dotenv';
dotenv.config();
import { readProducts, readCategories, createProductCategory, readProductCategories } from '../lib/directus';

async function assignCategories() {
  const products = await readProducts();
  const categories = await readCategories();

  for (const product of products) {
    if (!product.name || typeof product.name !== 'string' || product.name.trim() === '') {
      console.warn(`Produkt bez jména: ID=${product.id}, printful_id=${product.printful_id}, cena=${product.price}`);
      continue;
    }
    // Urči kategorii podle názvu produktu
    let categoryName = '';
    if (product.printful_category) {
      categoryName = product.printful_category.toLowerCase();
    } else if (product.name) {
      const name = product.name.toLowerCase();
      if (name.includes('kids')) categoryName = 'kids';
      else if (name.includes('women')) categoryName = 'women';
      else if (name.includes('men')) categoryName = 'men';
      else if (name.includes('home')) categoryName = 'home-decor';
      else categoryName = 'other';
    }

    const category = categories.find((c: any) => c.name.toLowerCase() === categoryName);
    if (!category) {
      console.warn(`Kategorie ${categoryName} nenalezena pro produkt ${product.name}`);
      continue;
    }

    // Zkontroluj, zda už není přiřazeno
    const existing = await readProductCategories({
      filter: {
        productId: { _eq: product.id },
        categoryId: { _eq: category.id }
      }
    });
    if (existing && existing.length > 0) continue;

    // Vytvoř přiřazení
    await createProductCategory({
      productId: [product.id],
      categoryId: [category.id]
    });
    console.log(`Přiřazeno: ${product.name} -> ${categoryName}`);
  }
}

assignCategories().then(() => {
  console.log('Hotovo!');
  process.exit(0);
}).catch(e => {
  console.error('Chyba při přiřazování kategorií:', e);
  process.exit(1);
}); 