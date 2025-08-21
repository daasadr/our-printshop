import { createDirectus, rest, staticToken, readItems, createItem, updateItem, deleteItem, readItem } from '@directus/sdk';
import { Product, Variant, Category, Design, Order, OrderItem } from '@/types';

if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) {
  throw new Error('NEXT_PUBLIC_DIRECTUS_URL is not defined in environment variables');
}
if (!process.env.DIRECTUS_TOKEN) {
  throw new Error('DIRECTUS_TOKEN is not defined in environment variables');
}

// Připojení ke klientovi
export const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL!)
  .with(staticToken(process.env.DIRECTUS_TOKEN!))
  .with(rest());

// Typy podle skutečných kolekcí
export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
}

export interface Cart {
  id: string;
  user: string;
}

export interface CartItem {
  id: string;
  cart: string;
  product: string;
  variant: string;
  quantity: number;
}

// CRUD funkce pro každou kolekci
export const readUsers = (params?: any) => directus.request(readItems('app_users', params));
export const createUser = (data: Partial<User>) => directus.request(createItem('app_users', data));
export const updateUser = (id: string, data: Partial<User>) => directus.request(updateItem('app_users', id, data));
export const deleteUser = (id: string) => directus.request(deleteItem('app_users', id));

export const readProducts = (params?: any) => {
  console.log('Directus readProducts - params:', params);
  return directus.request(readItems('products', params));
};
export const createProduct = (data: Partial<Product>) => directus.request(createItem('products', data));
export const updateProduct = (id: string, data: Partial<Product>) => directus.request(updateItem('products', id, data));
export const deleteProduct = (id: string) => directus.request(deleteItem('products', id));

export const readVariants = (params?: any) => directus.request(readItems('variants', params));
export const createVariant = (data: Partial<Variant>) => directus.request(createItem('variants', data));
export const updateVariant = (id: string, data: Partial<Variant>) => directus.request(updateItem('variants', id, data));
export const deleteVariant = (id: string) => directus.request(deleteItem('variants', id));

export const readCategories = (params?: any) => directus.request(readItems('categories', params));
export const createCategory = (data: Partial<Category>) => directus.request(createItem('categories', data));
export const updateCategory = (id: string, data: Partial<Category>) => directus.request(updateItem('categories', id, data));
export const deleteCategory = (id: string) => directus.request(deleteItem('categories', id));

export const readDesigns = (params?: any) => directus.request(readItems('designs', params));
export const createDesign = (data: Partial<Design>) => directus.request(createItem('designs', data));
export const updateDesign = (id: string, data: Partial<Design>) => directus.request(updateItem('designs', id, data));
export const deleteDesign = (id: string) => directus.request(deleteItem('designs', id));

export const readCart = (params?: any) => directus.request(readItems('cart', params));
export const createCart = (data: Partial<Cart>) => directus.request(createItem('cart', data));
export const updateCart = (id: string, data: Partial<Cart>) => directus.request(updateItem('cart', id, data));
export const deleteCart = (id: string) => directus.request(deleteItem('cart', id));

export const readCartItems = (params?: any) => directus.request(readItems('cart_items', params));
export const createCartItem = (data: Partial<CartItem>) => directus.request(createItem('cart_items', data));
export const updateCartItem = (id: string, data: Partial<CartItem>) => directus.request(updateItem('cart_items', id, data));
export const deleteCartItem = (id: string) => directus.request(deleteItem('cart_items', id));

export const readOrders = (params?: any) => directus.request(readItems('orders', params));
export const createOrder = (data: Partial<Order>) => directus.request(createItem('orders', data));
export const updateOrder = (id: string, data: Partial<Order>) => directus.request(updateItem('orders', id, data));
export const deleteOrder = (id: string) => directus.request(deleteItem('orders', id));

export const readOrderItems = (params?: any) => directus.request(readItems('order_items', params));
export const createOrderItem = (data: Partial<OrderItem>) => directus.request(createItem('order_items', data));
export const updateOrderItem = (id: string, data: Partial<OrderItem>) => directus.request(updateItem('order_items', id, data));
export const deleteOrderItem = (id: string) => directus.request(deleteItem('order_items', id));

export const readOrder = (id: string, params?: any) => directus.request(readItem('orders', id, params));

export const readProductCategories = (params?: any) => directus.request(readItems('product_categories', params));
export const createProductCategory = (data: any) => directus.request(createItem('product_categories', data));
export const updateProductCategory = (id: string, data: any) => directus.request(updateItem('product_categories', id, data));
export const deleteProductCategory = (id: string) => directus.request(deleteItem('product_categories', id));

/**
 * Načíta odberateľov newsletteru z kolekcie newsletter_subscribers v Directuse.
 * @param params - Voliteľné parametre pre filtrovanie, zoradenie atď.
 * @returns Promise s poľom odberateľov
 */
export const readNewsletterSubscribers = (params?: any) =>
  directus.request(readItems('newsletter_subscribers', params));

/**
 * Vytvorí nového odberateľa newsletteru v kolekcii newsletter_subscribers v Directuse.
 * @param data - Objekt s emailom (napr. { email: 'test@example.com' })
 * @returns Promise s vytvoreným záznamom
 */
export const createNewsletterSubscriber = (data: { email: string }) =>
  directus.request(createItem('newsletter_subscribers', data));

/**
 * Odhlási odberateľa newsletteru z kolekcie newsletter_subscribers v Directuse.
 * @param email - Email adresa na odhlásenie
 * @returns Promise s výsledkom operácie
 */
export const deleteNewsletterSubscriber = (email: string) => {
  return directus.request(readItems('newsletter_subscribers', {
    filter: { email: { _eq: email } }
  })).then(subscribers => {
    if (subscribers && subscribers.length > 0) {
      return directus.request(deleteItem('newsletter_subscribers', subscribers[0].id));
    }
    throw new Error('Subscriber not found');
  });
};

export { readItem, updateItem };

// Get latest products sorted by creation date
export const getLatestProducts = async (limit: number = 41) => {
  console.log('getLatestProducts - called with limit:', limit);
  
  const result = await directus.request(readItems('products', {
    sort: ['-id'], // Změna na -id místo -date_created
    limit: limit,
    fields: [
      'id',
      'name',
      'description', 
      'price',
      'thumbnail_url',
      'mockup_images',
      'printful_id',
      'external_id',
      'main_category',
      'date_created',
      'category.id',
      'category.name',
      'variants.id',
      'variants.name',
      'variants.sku',
      'variants.price',
      'variants.is_active',
      'variants.printful_variant_id',
      'designs.id',
      'designs.name',
      'designs.previewUrl'
    ]
  }));
  
  console.log('getLatestProducts - result count:', result.length);
  if (result.length > 0) {
    console.log('getLatestProducts - first 3 products:', 
      result.slice(0, 3).map(p => ({ id: p.id, name: p.name, date_created: p.date_created }))
    );
  }
  
  return result;
};

// Get categories for category tiles
export const getCategories = async (lang: string = 'cs') => {
  // Načítanie prekladov z public/locales
  let translations;
  try {
    const dict = await import(`../../public/locales/${lang}/common.json`);
    translations = dict.default || dict;
  } catch (error) {
    // Fallback na české preklady ak sa nepodarí načítať
    const fallbackDict = await import(`../../public/locales/cs/common.json`);
    translations = fallbackDict.default || fallbackDict;
  }

  return [
    {
      id: 'men',
      name: translations.category_men || 'Pánská kolekce',
      slug: 'men',
      image_url: '/images/men.jpg'
    },
    {
      id: 'women', 
      name: translations.category_women || 'Stylově pro dámy',
      slug: 'women',
      image_url: '/images/women.jpeg'
    },
    {
      id: 'kids',
      name: translations.category_kids || 'Pro malé objevitele',
      slug: 'kids',
      image_url: '/images/kids.jpeg'
    },
    {
      id: 'home-decor',
      name: translations['category_home-decor'] || 'Domov a dekorace',
      slug: 'home-decor',
      image_url: '/images/home.jpg'
    }
  ];
};

// Pokud budeš chtít přidat další kolekce (např. product_categories), stačí přidat obdobné CRUD funkce. 

/**
 * Prekladá produkt podľa jazyka
 * @param product - Produkt z databázy
 * @param locale - Jazyk (cs, sk, en, de)
 * @returns Produkt s preloženými poliami
 */
export const translateProduct = (product: any, locale: string) => {
  const translatedProduct = { ...product };
  
  // Preklad názvu
  const nameKey = `name_${locale}`;
  if (product[nameKey] && product[nameKey].trim()) {
    translatedProduct.name = product[nameKey];
  }
  
  // Preklad popisu
  const descriptionKey = `description_${locale}`;
  if (product[descriptionKey] && product[descriptionKey].trim()) {
    translatedProduct.description = product[descriptionKey];
  }
  
  return translatedProduct;
};

/**
 * Prekladá pole produktov podľa jazyka
 * @param products - Pole produktov z databázy
 * @param locale - Jazyk (cs, sk, en, de)
 * @returns Pole produktov s preloženými poliami
 */
export const translateProducts = (products: any[], locale: string) => {
  return products.map(product => translateProduct(product, locale));
}; 