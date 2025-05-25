import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { product, productCategory, category, variant, design } from "@/db/schema";

export async function GET(req: NextRequest) {
  try {
    // Získání všech produktů
    const products = await db.select().from(product);
    // Získání všech kategorií k produktům
    const productCategories = await db.select().from(productCategory);
    // Získání všech kategorií
    const categories = await db.select().from(category);
    // Získání všech variant
    const variants = await db.select().from(variant);
    // Získání všech designů
    const designs = await db.select().from(design);

    // Sestavení výsledku
    const result = products.map((prod) => {
      const prodCats = productCategories.filter(pc => pc.productId === prod.id);
      const prodCatNames = prodCats.map(pc => {
        const cat = categories.find(c => c.id === pc.categoryId);
        return cat?.name || "";
      });
      const prodCatIds = prodCats.map(pc => pc.categoryId);

      return {
        ...prod,
        categories: prodCatNames,
        categoryIds: prodCatIds,
        variants: variants.filter(v => v.productId === prod.id && v.isActive),
        designs: designs.filter(d => d.productId === prod.id),
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Chyba při načítání produktů:", error);
    return NextResponse.json({ message: "Chyba při načítání produktů" }, { status: 500 });
  }
}