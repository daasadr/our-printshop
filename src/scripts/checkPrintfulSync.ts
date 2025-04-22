import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const prisma = new PrismaClient();

async function checkPrintfulSync() {
  try {
    const response = await fetch('https://api.printful.com/sync/products', {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Printful sync status:', data);
  } catch (error) {
    console.error('Error checking Printful sync:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPrintfulSync(); 