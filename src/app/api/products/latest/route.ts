import { NextResponse } from "next/server";
import { readProducts } from "@/lib/directus";

export async function GET() {
  try {
    const response = await readProducts({
      fields: ['*', 'variants.*'],
      sort: ['-date_created'],
      limit: 8
    });
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching latest products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest products' },
      { status: 500 }
    );
  }
}