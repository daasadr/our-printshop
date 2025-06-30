# HappyWilderness Print Shop

Modern e-commerce platform for custom printed products with Directus CMS integration.

## Features

- Product catalog with categories managed through Directus CMS
- Shopping cart functionality
- Secure checkout with Stripe
- Printful integration for product fulfillment
- Automated product synchronization from Printful to Directus
- Responsive design
- Newsletter signup
- Order management
- Design upload functionality

## Prerequisites

- Node.js 18.x or later
- Directus CMS instance
- Stripe account
- Printful account

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Directus Configuration
NEXT_PUBLIC_DIRECTUS_URL=https://your-directus-url.com
DIRECTUS_TOKEN=your_directus_static_token

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Printful Configuration
PRINTFUL_API_KEY=your_printful_api_key

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## Directus Setup

### 1. Install Directus (if not already done)

```bash
npm create directus-project@latest my-directus-project
cd my-directus-project
npm start
```

### 2. Configure Collections

Create the following collections in your Directus instance:

#### Products Collection
- `id` (UUID, Primary Key)
- `name` (String, required)
- `description` (Text)
- `price` (Decimal)
- `thumbnail_url` (String)
- `mockup_images` (JSON)
- `printful_id` (Integer)
- `external_id` (String)
- `category` (Many-to-One relation to Categories)
- `date_created` (DateTime)

#### Categories Collection
- `id` (UUID, Primary Key)
- `name` (String, required)
- `slug` (String, required)
- `image_url` (String)

#### Variants Collection
- `id` (UUID, Primary Key)  
- `name` (String, required)
- `sku` (String)
- `price` (Decimal)
- `is_active` (Boolean)
- `printful_variant_id` (Integer)
- `product` (Many-to-One relation to Products)

#### Orders Collection
- `id` (UUID, Primary Key)
- `stripe_payment_intent_id` (String)
- `total_amount` (Decimal)
- `status` (String)
- `customer_email` (String)
- `date_created` (DateTime)

#### Order Items Collection
- `id` (UUID, Primary Key)
- `order` (Many-to-One relation to Orders)
- `product` (Many-to-One relation to Products)
- `variant` (Many-to-One relation to Variants)
- `quantity` (Integer)
- `price` (Decimal)

### 3. Set Permissions

Configure public permissions for the following collections:
- `products` (read)
- `categories` (read)
- `variants` (read)

## Development

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables in `.env.local`

3. Sync products from Printful to Directus:
```bash
# Via API endpoint
curl http://localhost:3000/api/sync-printful-to-wilderness
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Production Deployment

### Vercel Deployment

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Create a new project on Vercel and connect your repository

3. Configure environment variables in Vercel:
   - Add all variables from the environment variables section above
   - Set `NODE_ENV=production`
   - Update `NEXT_PUBLIC_BASE_URL` to your production URL
   - Update `NEXTAUTH_URL` to your production URL

4. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

5. Deploy your application

### Directus Setup for Production

1. Deploy your Directus instance (recommended: Docker, Railway, or dedicated server)

2. Update `NEXT_PUBLIC_DIRECTUS_URL` and `DIRECTUS_TOKEN` in your environment variables

3. Configure CORS settings in Directus to allow your production domain

4. Set up proper authentication and permissions

### Stripe Setup

1. Create a Stripe account and get your API keys

2. Set up webhook endpoints:
   - Go to Stripe Dashboard > Developers > Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`
   - Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

### Printful Setup

1. Create a Printful account and get your API key

2. Update `PRINTFUL_API_KEY` in your environment variables

3. Sync products from Printful to Directus:
```bash
# Via API endpoint
curl https://your-domain.com/api/sync-printful-to-wilderness
```

## API Endpoints

### Product Synchronization
- `GET /api/sync-printful-to-wilderness` - Sync products from Printful to Directus
- `GET /api/sync-printful-to-wilderness/test` - Test the sync functionality

### Products
- `GET /api/products` - Get all products
- `GET /api/products/latest` - Get latest products

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/[id]` - Get order details
- `POST /api/orders/[id]/fulfill` - Fulfill order with Printful

### Cart
- `GET /api/cart` - Get cart contents
- `POST /api/cart` - Add item to cart

### Checkout
- `POST /api/checkout` - Create checkout session
- `POST /api/create-payment-intent` - Create Stripe payment intent

## Maintenance

### Regular Tasks
- Sync products with Printful to keep inventory up to date
- Monitor Stripe webhook events for order processing
- Keep dependencies updated
- Monitor error logs and application performance
- Backup Directus database regularly

### Syncing Products
To sync products from Printful to Directus, you can:

1. Use the API endpoint: `GET /api/sync-printful-to-wilderness`
2. The sync will:
   - Fetch products from Printful
   - Create/update categories in Directus
   - Create/update products with variants in Directus
   - Handle product images and mockups

## Architecture

This application uses:
- **Next.js 14** - React framework with App Router
- **Directus** - Headless CMS for content management
- **Stripe** - Payment processing
- **Printful** - Print-on-demand fulfillment
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

## Support

For support, please contact support@happywilderness.cz
