import { NextResponse } from 'next/server';

// Helper function to extract size and color from variant name
function extractSizeAndColor(variantName: string): { size: string | null; color: string | null } {
  // Pattern: "Product Name color / SIZE" or "Product Name / SIZE"
  const sizePattern = /\s+\/\s+([A-Z0-9]+)$/;
  
  const sizeMatch = variantName.match(sizePattern);
  const size = sizeMatch ? sizeMatch[1] : null;
  
  // Extract color: look for the last word before "/ SIZE"
  let color = null;
  if (sizeMatch) {
    const beforeSize = variantName.substring(0, sizeMatch.index);
    const parts = beforeSize.trim().split(' ');
    
    // Look for common color words at the end
    const colorWords = ['white', 'black', 'red', 'blue', 'green', 'yellow', 'pink', 'purple', 'orange', 'brown', 'gray', 'grey'];
    const lastWord = parts[parts.length - 1]?.toLowerCase();
    
    if (lastWord && colorWords.includes(lastWord)) {
      color = lastWord;
    } else {
      // If no common color found, try to extract the last word that's not part of the product name
      // For "Ancient Heroine Skater Dress white / XS", we want "white"
      const productNameParts = ['ancient', 'heroine', 'skater', 'dress'];
      const lastPart = parts[parts.length - 1]?.toLowerCase();
      
      if (lastPart && !productNameParts.includes(lastPart)) {
        color = lastPart;
      }
    }
  }
  
  return { size, color };
}

// Test Printful API directly
async function testPrintfulAPI() {
  const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
  
  if (!PRINTFUL_API_KEY) {
    return { error: 'PRINTFUL_API_KEY not found' };
  }

  try {
    // Fetch products first
    const productsResponse = await fetch('https://api.printful.com/store/products', {
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`
      }
    });
    
    if (!productsResponse.ok) {
      return { error: `Failed to fetch products: ${productsResponse.status}` };
    }
    
    const productsData = await productsResponse.json();
    const products = productsData.result || [];
    
    if (products.length === 0) {
      return { error: 'No products found' };
    }
    
    // Get first product details
    const firstProduct = products[0];
    const productDetailsResponse = await fetch(`https://api.printful.com/store/products/${firstProduct.id}`, {
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`
      }
    });
    
    if (!productDetailsResponse.ok) {
      return { error: `Failed to fetch product details: ${productDetailsResponse.status}` };
    }
    
    const productDetails = await productDetailsResponse.json();
    const syncVariants = productDetails.result?.sync_variants || [];
    
    return {
      success: true,
      product: {
        id: firstProduct.id,
        name: firstProduct.name
      },
      variants: syncVariants.map((variant: any) => ({
        id: variant.id,
        name: variant.name,
        size: variant.size,
        color: variant.color,
        retail_price: variant.retail_price,
        sku: variant.sku
      }))
    };
    
  } catch (error) {
    return { error: `API error: ${error}` };
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const variantName = searchParams.get('name');
    const testPrintful = searchParams.get('testPrintful');

    if (testPrintful) {
      const result = await testPrintfulAPI();
      return NextResponse.json(result);
    }

    if (!variantName) {
      return NextResponse.json({ error: 'Variant name is required' }, { status: 400 });
    }

    const result = extractSizeAndColor(variantName);

    return NextResponse.json({
      success: true,
      variantName,
      extracted: result
    });

  } catch (error) {
    console.error('Error testing extraction:', error);
    return NextResponse.json({ error: 'Failed to test extraction' }, { status: 500 });
  }
} 