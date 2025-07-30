import { NextResponse } from 'next/server';
import { syncProducts } from './syncProducts';

// Force dynamic rendering - don't generate static pages for this API
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    console.log('Starting product synchronization...');
    
    const result = await syncProducts();
    
    console.log('Product synchronization completed:', result);
    
    return NextResponse.json({
      success: true,
      message: 'Product synchronization completed successfully',
      stats: result.stats
    });
  } catch (error) {
    console.error('Error during product synchronization:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Product synchronization failed'
      },
      { status: 500 }
    );
  }
} 