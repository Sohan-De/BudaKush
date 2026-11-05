import { NextResponse } from 'next/server';
import { computePromoDiscount } from '@/lib/promo-logic';
import { readStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

// Aperçu de la remise pour le panier. Le serveur recalcule de toute façon au paiement.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const code = typeof body?.code === 'string' ? body.code : '';
  const amount = Number(body?.amount);

  if (!code || !Number.isFinite(amount) || amount < 0) {
    return NextResponse.json({ valid: false, discount: 0, message: 'Requête invalide' }, { status: 400 });
  }

  const result = computePromoDiscount(readStore().promos, code, amount);
  return NextResponse.json(result);
}
