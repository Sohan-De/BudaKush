import { NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/store';
import { num } from '@/lib/admin-validate';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ code: string }> };

export async function PUT(request: Request, { params }: Ctx) {
  const { code: rawCode } = await params;
  const code = decodeURIComponent(rawCode).toUpperCase();
  const body = await request.json().catch(() => null);
  const data = readStore();
  const index = data.promos.findIndex(p => p.code === code);
  if (index === -1) return NextResponse.json({ error: 'Code introuvable' }, { status: 404 });

  const current = data.promos[index];
  const percent = body?.discount_percent !== undefined ? num(body.discount_percent) : current.discount_percent;
  if (percent === null || percent <= 0 || percent > 100) {
    return NextResponse.json({ error: 'Remise entre 1 et 100 %' }, { status: 400 });
  }
  data.promos[index] = {
    ...current,
    discount_percent: percent,
    min_order_amount: body?.min_order_amount !== undefined ? (num(body.min_order_amount) ?? 0) : current.min_order_amount,
    expires_at:
      body?.expires_at !== undefined
        ? (body.expires_at ? new Date(body.expires_at).toISOString() : null)
        : current.expires_at,
  };
  try {
    writeStore(data);
  } catch {
    return NextResponse.json({ error: 'Stockage indisponible (lecture seule)' }, { status: 500 });
  }
  return NextResponse.json(data.promos[index]);
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const { code: rawCode } = await params;
  const code = decodeURIComponent(rawCode).toUpperCase();
  const data = readStore();
  const before = data.promos.length;
  data.promos = data.promos.filter(p => p.code !== code);
  if (data.promos.length === before) return NextResponse.json({ error: 'Code introuvable' }, { status: 404 });
  try {
    writeStore(data);
  } catch {
    return NextResponse.json({ error: 'Stockage indisponible (lecture seule)' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
