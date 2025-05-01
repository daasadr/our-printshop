import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validace vstupních dat
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Vyplňte prosím všechna pole' },
        { status: 400 }
      );
    }

    // Kontrola, zda uživatel již existuje
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Uživatel s tímto emailem již existuje' },
        { status: 400 }
      );
    }

    // Hashování hesla
    const hashedPassword = await bcrypt.hash(password, 12);

    // Vytvoření nového uživatele
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
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
  } finally {
    await prisma.$disconnect();
  }
} 