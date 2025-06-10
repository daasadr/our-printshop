import { NextResponse } from "next/server";
import { readProducts } from "@/lib/directus";

export async function GET() {
  try {
    const response = await readProducts({
      fields: ['*', 'categories.*', 'variants.*']
    });
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}