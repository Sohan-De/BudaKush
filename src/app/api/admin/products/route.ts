import { NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/store';
import { num, str, strList, weightList, recordStr } from '@/lib/admin-validate';
import type { StoreProduct } from '@/types/store.types';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(readStore().products);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const data = readStore();

  const name = str(body?.name, 150);
  const price = num(body?.price);
  const category = str(body?.category, 60);
  if (!name) return NextResponse.json({ error: 'Le nom est obligatoire' }, { status: 400 });
  if (price === null || price < 0) return NextResponse.json({ error: 'Prix invalide' }, { status: 400 });
  if (!data.categories.some(c => c.slug === category)) {
    return NextResponse.json({ error: 'Catégorie inconnue' }, { status: 400 });
  }

  const numericIds = data.products.map(p => parseInt(p.id, 10)).filter(n => Number.isFinite(n));
  const id = String((numericIds.length ? Math.max(...numericIds) : 0) + 1);

  const image = str(body?.image, 300);
  const product: StoreProduct = {
    id,
    name,
    description: str(body?.description, 2000),
    price,
    image,
    images: strList(body?.images).length ? strList(body?.images) : (image ? [image] : []),
    category,
    tag: str(body?.tag, 40) || undefined,
    rating: num(body?.rating) ?? 4,
    reviewCount: num(body?.reviewCount) ?? 0,
    sku: str(body?.sku, 60) || undefined,
    attributes: recordStr(body?.attributes),
    weightOptions: weightList(body?.weightOptions),
  };

  data.products.push(product);
  try {
    writeStore(data);
  } catch {
    return NextResponse.json({ error: 'Stockage indisponible (lecture seule)' }, { status: 500 });
  }
  return NextResponse.json(product, { status: 201 });
}
