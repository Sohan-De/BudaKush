import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { quoteOrder } from '@/lib/pricing';

/**
 * Crée un PaymentIntent. Le montant est recalculé côté serveur à partir du
 * catalogue du store : le prix envoyé par le navigateur est ignoré.
 */
export async function POST(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: 'Paiement indisponible (configuration serveur)' }, { status: 500 });
    }
    const stripe = new Stripe(secretKey, { apiVersion: '2025-04-30.basil' });

    const body = await request.json();
    const { items, customer, shippingMethod, promoCode } = body ?? {};

    const email = typeof customer?.email === 'string' ? customer.email.trim() : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Adresse e-mail invalide' }, { status: 400 });
    }

    const quote = quoteOrder(items, shippingMethod || '', promoCode);
    if (!quote.ok) {
      return NextResponse.json({ error: quote.error }, { status: 400 });
    }

    const amountCents = Math.round(quote.total * 100);
    if (amountCents < 50) {
      return NextResponse.json({ error: 'Montant minimum non atteint' }, { status: 400 });
    }

    const summary = quote.items
      .map(i => `${i.id}${i.weight ? `:${i.weight}` : ''}${i.isSample ? ':sample' : ''}x${i.quantity}`)
      .join(',');

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      receipt_email: email,
      metadata: {
        customer_email: email,
        customer_name: String(customer?.name || '').slice(0, 100),
        shipping_method: shippingMethod || '',
        promo_code: quote.promoCode || '',
        items_summary: summary.slice(0, 480),
      },
    });

    if (!paymentIntent.client_secret) {
      throw new Error('No client secret received from Stripe');
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: amountCents,
      currency: 'eur',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('create-payment-intent error:', message);
    return NextResponse.json({ error: 'Erreur lors de la création du paiement' }, { status: 500 });
  }
}

