const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
});

async function getAllPrices() {
  try {
    console.log('🔍 Fetching all products and prices from your Stripe account...\n');

    // Get all prices
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
    });

    console.log('💰 PRICES:');
    console.log('===========');
    prices.data.forEach(price => {
      const product = price.product;
      const amount = price.unit_amount ? (price.unit_amount / 100) : 0;
      const currency = price.currency.toUpperCase();
      const interval = price.recurring ? `/${price.recurring.interval}` : ' (one-time)';

      console.log(`• ${price.id}`);
      console.log(`  Product: ${product.name}`);
      console.log(`  Amount: ${currency} ${amount}${interval}`);
      console.log(`  Active: ${price.active}`);
      console.log('');
    });

    console.log('🔧 COPY THESE TO YOUR .env.local FILE:');
    console.log('=====================================');

    // Show all price IDs for manual selection
    prices.data.forEach(price => {
      const product = price.product;
      const amount = price.unit_amount ? (price.unit_amount / 100) : 0;
      const interval = price.recurring ? price.recurring.interval : 'one-time';

      console.log(`# ${product.name} - $${amount} ${interval}`);
      console.log(`STRIPE_PRICE_ID=${price.id}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error fetching Stripe data:', error.message);
    console.log('\n🔧 Common solutions:');
    console.log('1. Check that your STRIPE_SECRET_KEY is correct');
    console.log('2. Make sure you have products and prices created in your Stripe dashboard');
    console.log('3. Verify you\'re using the correct Stripe account (test vs live mode)');
  }
}

getAllPrices();
