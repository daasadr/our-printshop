import { NextResponse } from 'next/server';
import { readUsers, createUser } from '@/lib/directus';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    // Validace vstupních dat
    if (!name || !email) {
      return NextResponse.json(
        { message: 'Vyplňte prosím všechna pole' },
        { status: 400 }
      );
    }

    // Kontrola, zda uživatel již existuje
    const existingUsers = await readUsers({
      filter: { email: { _eq: email } }
    });

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: 'Uživatel s tímto emailem již existuje' },
        { status: 400 }
      );
    }

    // Vytvoření nového uživatele
    await createUser({
      name,
      email,
    });

    return NextResponse.json(
      { message: 'Uživatel byl úspěšně vytvořen' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Něco se pokazilo při vytváření účtu' },
      { status: 500 }
    );
  }
} 