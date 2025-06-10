import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

// Stripe instance pro server
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil', // aktuální verze API
});

// Stripe Promise pro klienta
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); 