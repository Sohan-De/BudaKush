import { NextResponse } from 'next/server';
import { quoteOrder } from '@/lib/pricing';
import { readStore, writeStore } from '@/lib/store';
import type { StoreOrder } from '@/types/store.types';

export const dynamic = 'force-dynamic';

/**
 * Mode démo : enregistre une commande simulée (aucun paiement).
 * Actif uniquement si DEMO_CHECKOUT=true côté serveur.
 */
export async function POST(request: Request) {
  if (process.env.DEMO_CHECKOUT !== 'true') {
    return NextResponse.json({ error: 'Mode démo désactivé' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const { items, shippingMethod, promoCode, customer, shippingAddress } = body ?? {};

  const quote = quoteOrder(items, shippingMethod || '', promoCode);
  if (!quote.ok) {
    return NextResponse.json({ error: quote.error }, { status: 400 });
  }

  const data = readStore();
  const order: StoreOrder = {
    id: `DEMO-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: 'paid',
    customer: {
      email: String(customer?.email || '').slice(0, 200),
      name: String(customer?.name || '').slice(0, 200),
      phone: customer?.phone ? String(customer.phone).slice(0, 40) : undefined,
    },
    shippingAddress: {
      name: String(shippingAddress?.name || '').slice(0, 200),
      street: String(shippingAddress?.street || '').slice(0, 300),
      city: String(shippingAddress?.city || '').slice(0, 100),
      postalCode: String(shippingAddress?.postalCode || '').slice(0, 20),
      country: 'FR',
    },
    shippingMethod: shippingMethod || '',
    items: quote.items,
    subtotal: quote.subtotal,
    shipping: quote.shipping,
    discount: quote.discount,
    promoCode: quote.promoCode,
    total: quote.total,
  };

  data.orders.unshift(order);
  try {
    writeStore(data);
  } catch {
    return NextResponse.json({ error: 'Stockage indisponible (lecture seule)' }, { status: 500 });
  }

  return NextResponse.json({ orderId: order.id, total: order.total });
}
