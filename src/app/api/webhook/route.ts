import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

/**
 * Webhook Stripe. Signature obligatoire : sans elle, n'importe qui pourrait
 * forger un événement "paiement réussi".
 * Il n'y a plus de base de données : les commandes sont consultables dans le
 * tableau de bord Stripe (et par e-mail).
 */
export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !endpointSecret) {
    console.error('Webhook: STRIPE_SECRET_KEY ou STRIPE_WEBHOOK_SECRET manquant');
    return NextResponse.json({ error: 'Webhook non configuré' }, { status: 500 });
  }

  const stripe = new Stripe(secretKey);
  const body = await request.text();
  const sig = (await headers()).get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Signature manquante' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown webhook error';
    console.error(`Webhook signature invalide: ${message}`);
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent;
    console.log('Paiement réussi', {
      id: pi.id,
      amount: pi.amount / 100,
      currency: pi.currency,
      email: pi.metadata?.customer_email,
      items: pi.metadata?.items_summary,
    });
  }

  return NextResponse.json({ received: true });
}
