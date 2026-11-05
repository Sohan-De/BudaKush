import { NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/store';
import type { OrderStatus } from '@/types/store.types';

export const dynamic = 'force-dynamic';

const STATUSES: OrderStatus[] = ['paid', 'preparing', 'shipped', 'cancelled'];

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const status = body?.status as OrderStatus;
  if (!STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
  }
  const data = readStore();
  const order = data.orders.find(o => o.id === id);
  if (!order) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });

  order.status = status;
  try {
    writeStore(data);
  } catch {
    return NextResponse.json({ error: 'Stockage indisponible (lecture seule)' }, { status: 500 });
  }
  return NextResponse.json(order);
}
