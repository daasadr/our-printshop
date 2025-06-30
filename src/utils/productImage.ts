export function getProductImages(product: any): { main: string; others: string[] } {
  let main = '';
  let others: string[] = [];

  if (product.mockup_images) {
    if (Array.isArray(product.mockup_images)) {
      // Pokud je to pole URL nebo assetů
      const urls = product.mockup_images.map((img: any) => {
        if (typeof img === 'string' && img.startsWith('http')) {
          return img;
        }
        if (typeof img === 'string') {
          // Directus asset ID
          return `${process.env.NEXT_PUBLIC_DIRECTUS_URL || ''}/assets/${img}`;
        }
        if (img && img.url) {
          return img.url;
        }
        return '';
      }).filter(Boolean);
      if (urls.length > 0) {
        main = urls[0];
        others = urls.slice(1);
      }
    } else if (typeof product.mockup_images === 'string') {
      if (product.mockup_images.startsWith('http')) {
        main = product.mockup_images;
      } else {
        main = `${process.env.NEXT_PUBLIC_DIRECTUS_URL || ''}/assets/${product.mockup_images}`;
      }
    }
  }

  // Pokud není obrázek, použij placeholder
  if (!main) {
    main = '/images/placeholder.jpg';
  }
  return { main, others };
} 