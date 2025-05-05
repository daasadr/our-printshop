import prisma from '@/lib/prisma';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

async function checkVariants() {
  try {
    const response = await fetch('https://api.printful.com/sync/variants', {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Printful variants:', data);
  } catch (error) {
    console.error('Error checking variants:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkVariants(); 