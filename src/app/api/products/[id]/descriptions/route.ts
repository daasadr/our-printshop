import { NextRequest, NextResponse } from 'next/server';
import { createDirectus, rest, staticToken, updateItem } from '@directus/sdk';

const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL!)
  .with(rest())
  .with(staticToken(process.env.DIRECTUS_TOKEN!));

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { description_cs, description_sk, description_en, description_de, icon_cs, icon_sk, icon_en, icon_de, name } = body;

    console.log('Updating product descriptions for ID:', params.id);
    console.log('Received data:', { description_cs, description_sk, description_en, description_de, icon_cs, icon_sk, icon_en, icon_de, name });

    const updateData: any = {};
    
    if (description_cs !== undefined) updateData.description_cs = description_cs;
    if (description_sk !== undefined) updateData.description_sk = description_sk;
    if (description_en !== undefined) updateData.description_en = description_en;
    if (description_de !== undefined) updateData.description_de = description_de;
    if (icon_cs !== undefined) updateData.icon_cs = icon_cs;
    if (icon_sk !== undefined) updateData.icon_sk = icon_sk;
    if (icon_en !== undefined) updateData.icon_en = icon_en;
    if (icon_de !== undefined) updateData.icon_de = icon_de;
    if (name !== undefined) updateData.name = name;

    const result = await directus.request(
      updateItem('products', params.id, updateData)
    );

    console.log('Update successful:', result);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating product descriptions:', error);
    return NextResponse.json(
      { error: 'Chyba pri ukladaní popiskov' },
      { status: 500 }
    );
  }
} 