import { NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/store';
import { num, str } from '@/lib/admin-validate';
import type { StorePromo } from '@/types/store.types';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(readStore().promos);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const data = readStore();

  const code = str(body?.code, 40).toUpperCase();
  const percent = num(body?.discount_percent);
  const min = num(body?.min_order_amount) ?? 0;
  if (!code) return NextResponse.json({ error: 'Code obligatoire' }, { status: 400 });
  if (percent === null || percent <= 0 || percent > 100) {
    return NextResponse.json({ error: 'Remise entre 1 et 100 %' }, { status: 400 });
  }
  if (data.promos.some(p => p.code === code)) {
    return NextResponse.json({ error: 'Ce code existe déjà' }, { status: 409 });
  }

  const promo: StorePromo = {
    code,
    discount_percent: percent,
    min_order_amount: min,
    expires_at: body?.expires_at ? new Date(body.expires_at).toISOString() : null,
  };
  data.promos.push(promo);
  try {
    writeStore(data);
  } catch {
    return NextResponse.json({ error: 'Stockage indisponible (lecture seule)' }, { status: 500 });
  }
  return NextResponse.json(promo, { status: 201 });
}
