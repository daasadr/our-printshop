import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Session } from 'next-auth';
import { readCart, createCart, readCartItems, createCartItem, updateCartItem, deleteCartItem, Cart, CartItem } from '@/lib/directus';

// GET /api/cart - Get user's cart
export async function GET() {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const response = await readCart({
      filter: {
        user: { _eq: session.user.id }
      },
      fields: ['*', 'items.*', 'items.variant.*', 'items.variant.product.*']
    });

    const cart = response?.[0] as unknown as Cart | undefined;
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { variantId, quantity } = body;

    // 1. Najít nebo vytvořit košík
    const carts = await readCart({
      filter: {
        user: { _eq: session.user.id }
      }
    });

    let cart = carts?.[0] as unknown as Cart | undefined;
    if (!cart) {
      const newCart = await createCart({
        user: session.user.id
      }) as unknown as Cart;
      // Po vytvoření znovu načíst
      const newCarts = await readCart({ user: { _eq: session.user.id } });
      cart = newCarts?.[0] as unknown as Cart | undefined;
    }

    if (!cart?.id) {
      return NextResponse.json(
        { error: 'Failed to create or find cart' },
        { status: 500 }
      );
    }

    // 2. Zkontrolovat, zda už položka v košíku existuje
    const existingItems = await readCartItems({
      filter: {
        cart: { _eq: cart.id },
        variant: { _eq: variantId }
      }
    });

    const existingItem = existingItems?.[0] as unknown as CartItem | undefined;
    if (existingItem?.id) {
      // Aktualizovat množství
      await updateCartItem(existingItem.id, {
        quantity: existingItem.quantity + quantity
      });
    } else {
      // Přidat novou položku
      await createCartItem({
        cart: cart.id,
        variant: variantId,
        quantity
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    await deleteCartItem(itemId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}

// PATCH /api/cart - Update item quantity
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { variantId, quantity } = body;

    if (!variantId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Variant ID and quantity are required' },
        { status: 400 }
      );
    }

    // Najdi košík
    const carts = await readCart({
      filter: {
        user: { _eq: session.user.id }
      }
    });

    const cart = carts?.[0] as unknown as Cart | undefined;
    if (!cart?.id) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    // Najdi položku
    const existingItems = await readCartItems({
      filter: {
        cart: { _eq: cart.id },
        variant: { _eq: variantId }
      }
    });

    const cartItem = existingItems?.[0] as unknown as CartItem | undefined;
    if (!cartItem?.id) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    // Aktualizuj množství
    await updateCartItem(cartItem.id, {
      quantity
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
} 