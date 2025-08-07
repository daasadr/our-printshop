export interface ProductTemplate {
  category: string;
  templateKey: string;
}

export const PRODUCT_DESCRIPTION_TEMPLATES: ProductTemplate[] = [
  {
    category: 'men',
    templateKey: 'product.description.men'
  },
  {
    category: 'women',
    templateKey: 'product.description.women'
  },
  {
    category: 'kids',
    templateKey: 'product.description.kids'
  },
  {
    category: 'unisex',
    templateKey: 'product.description.unisex'
  },
  {
    category: 'home-decor',
    templateKey: 'product.description.home-decor'
  }
];

export const generateProductDescription = async (
  productName: string,
  category: string,
  locale: string = 'cs',
  dictionary?: any
): Promise<string> => {
  const template = PRODUCT_DESCRIPTION_TEMPLATES.find(t => t.category === category);
  
  if (!template || !dictionary) {
    // Fallback template
    return `Kvalitní ${productName} s originálním designem. Vyrobeno s péčí a láskou k detailu.`;
  }
  
  const templateText = dictionary[template.templateKey] || 
                      dictionary['product.description.fallback'] || 
                      `Kvalitní {product_name} s originálním designem.`;
  
  return templateText.replace('{product_name}', productName);
};

// Špecifické šablóny pre rôzne typy produktov
export const PRODUCT_TYPE_TEMPLATES: Record<string, ProductTemplate> = {
  't-shirt': {
    category: 'clothing',
    templateKey: 'product.description.t-shirt'
  },
  'hoodie': {
    category: 'clothing',
    templateKey: 'product.description.hoodie'
  },
  'poster': {
    category: 'home-decor',
    templateKey: 'product.description.poster'
  }
};

export const generateDescriptionByProductType = async (
  productName: string,
  productType: string,
  locale: string = 'cs',
  dictionary?: any
): Promise<string> => {
  const template = PRODUCT_TYPE_TEMPLATES[productType.toLowerCase()];
  
  if (!template || !dictionary) {
    return generateProductDescription(productName, 'unisex', locale, dictionary);
  }
  
  const templateText = dictionary[template.templateKey] || 
                      dictionary['product.description.fallback'] || 
                      `Kvalitní {product_name} s originálním designem.`;
  
  return templateText.replace('{product_name}', productName);
}; 