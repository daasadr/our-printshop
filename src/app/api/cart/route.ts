import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth/next'; // ODSTRANĚNO
// import { authOptions } from '@/lib/auth'; // ODSTRANĚNO
// import { Session } from 'next-auth'; // ODSTRANĚNO
import { jwtAuth } from '@/lib/jwt-auth';
import { readCart, createCart, readCartItems, createCartItem, updateCartItem, deleteCartItem, Cart, CartItem } from '@/lib/directus';

// Helper function to get user from JWT token
async function getUserFromRequest(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const user = await jwtAuth.getUserFromToken(token);
    return user;
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
}

// GET /api/cart - Get user's cart
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    
    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const response = await readCart({
      filter: {
        user: { _eq: user.id }
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
    const user = await getUserFromRequest(req);
    
    if (!user?.id) {
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
        user: { _eq: user.id }
      }
    });

    let cart = carts?.[0] as unknown as Cart | undefined;
    if (!cart) {
      const newCart = await createCart({
        user: user.id
      }) as unknown as Cart;
      // Po vytvoření znovu načíst
      const newCarts = await readCart({ user: { _eq: user.id } });
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
    console.error('Error adding item to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    
    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { itemId } = body;

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    // Zkontrolovat, zda položka patří uživateli
    const cart = await readCart({
      filter: {
        user: { _eq: user.id }
      }
    });

    if (!cart?.[0]?.id) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    const cartItems = await readCartItems({
      filter: {
        id: { _eq: itemId },
        cart: { _eq: cart[0].id }
      }
    });

    if (!cartItems?.[0]) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    await deleteCartItem(itemId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}

// PATCH /api/cart - Update item quantity
export async function PATCH(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    
    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { itemId, quantity } = body;

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Item ID and quantity are required' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      // Pokud je množství 0 nebo méně, smazat položku
      return DELETE(req);
    }

    // Zkontrolovat, zda položka patří uživateli
    const cart = await readCart({
      filter: {
        user: { _eq: user.id }
      }
    });

    if (!cart?.[0]?.id) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    const cartItems = await readCartItems({
      filter: {
        id: { _eq: itemId },
        cart: { _eq: cart[0].id }
      }
    });

    if (!cartItems?.[0]) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    await updateCartItem(itemId, { quantity });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
} 