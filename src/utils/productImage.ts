export function getProductImages(product: any): { main: string; others: string[] } {
  // 1. Hlavní obrázek z Printful
  let main = '';
  if (product.printful_id) {
    main = `https://files.cdn.printful.com/files/${product.printful_id}-mockup.jpg`;
  }
  // 2. Další obrázky z mockup_images (Directus)
  let others: string[] = [];
  if (product.mockup_images) {
    if (Array.isArray(product.mockup_images)) {
      others = product.mockup_images.map((img: any) => {
        if (typeof img === 'string') {
          return `${process.env.NEXT_PUBLIC_DIRECTUS_URL || ''}/assets/${img}`;
        }
        if (img && img.url) {
          return img.url;
        }
        return '';
      }).filter(Boolean);
    } else if (typeof product.mockup_images === 'string') {
      others = [`${process.env.NEXT_PUBLIC_DIRECTUS_URL || ''}/assets/${product.mockup_images}`];
    }
  }
  // 3. Pokud není Printful obrázek, použij první mockup jako main
  if (!main && others.length > 0) {
    main = others[0];
    others = others.slice(1);
  }
  // 4. Pokud není nic, použij placeholder
  if (!main) {
    main = '/images/placeholder.jpg';
  }
  return { main, others };
} 