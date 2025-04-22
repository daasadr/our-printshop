# HappyWilderness Print Shop

Modern e-commerce platform for custom printed products.

## Features

- Product catalog with categories
- Shopping cart functionality
- Secure checkout with Stripe
- Printful integration for product fulfillment
- Responsive design
- Newsletter signup
- Order management

## Prerequisites

- Node.js 18.x or later
- PostgreSQL database
- Stripe account
- Printful account

## Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
- `PRINTFUL_API_KEY`: Your Printful API key
- `NEXT_PUBLIC_BASE_URL`: Your application's base URL

## Development

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma migrate dev
```

3. Sync products with Printful:
```bash
npm run sync-printful
```

4. Start the development server:
```bash
npm run dev
```

## Production Deployment

### Vercel Deployment

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Create a new project on Vercel and connect your repository

3. Configure environment variables in Vercel:
   - Add all variables from `.env.example`
   - Set `NODE_ENV=production`
   - Update `NEXT_PUBLIC_BASE_URL` to your production URL

4. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

5. Deploy your application

### Database Setup

1. Create a PostgreSQL database (e.g., using Supabase, Railway, or your preferred provider)

2. Update the `DATABASE_URL` in your environment variables

3. Run migrations:
```bash
npx prisma migrate deploy
```

### Stripe Setup

1. Create a Stripe account and get your API keys

2. Set up webhook endpoints:
   - Go to Stripe Dashboard > Developers > Webhooks
   - Add endpoint: `https://your-domain.com/api/webhook`
   - Select events: `checkout.session.completed`
   - Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

### Printful Setup

1. Create a Printful account and get your API key

2. Update `PRINTFUL_API_KEY` in your environment variables

3. Sync products:
```bash
npm run sync-printful
```

## Maintenance

- Regularly sync products with Printful to keep inventory up to date
- Monitor Stripe webhook events for order processing
- Keep dependencies updated
- Monitor error logs and application performance

## Support

For support, please contact support@happywilderness.cz
