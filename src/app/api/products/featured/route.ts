import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { product, productCategory, category, variant, design } from "@/db/schema";

export async function GET() {
  try {
    // Získání 4 "featured" produktů (zatím všechny, protože není isFeatured)
    const products = await db.select().from(product).limit(4);
    const productCategories = await db.select().from(productCategory);
    const categories = await db.select().from(category);
    const variants = await db.select().from(variant);
    const designs = await db.select().from(design);

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
    console.error("Error fetching featured products:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}