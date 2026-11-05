import { NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/store';
import { num, str, strList, weightList, recordStr } from '@/lib/admin-validate';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const data = readStore();
  const index = data.products.findIndex(p => p.id === id);
  if (index === -1) return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 });

  const current = data.products[index];
  const name = body?.name !== undefined ? str(body.name, 150) : current.name;
  const price = body?.price !== undefined ? num(body.price) : current.price;
  const category = body?.category !== undefined ? str(body.category, 60) : current.category;
  if (!name) return NextResponse.json({ error: 'Le nom est obligatoire' }, { status: 400 });
  if (price === null || price < 0) return NextResponse.json({ error: 'Prix invalide' }, { status: 400 });
  if (!data.categories.some(c => c.slug === category)) {
    return NextResponse.json({ error: 'Catégorie inconnue' }, { status: 400 });
  }

  const image = body?.image !== undefined ? str(body.image, 300) : current.image;
  const images = body?.images !== undefined ? strList(body.images) : current.images;

  data.products[index] = {
    ...current,
    name,
    price,
    category,
    image,
    images: images.length ? images : (image ? [image] : []),
    description: body?.description !== undefined ? str(body.description, 2000) : current.description,
    tag: body?.tag !== undefined ? (str(body.tag, 40) || undefined) : current.tag,
    rating: body?.rating !== undefined ? (num(body.rating) ?? current.rating) : current.rating,
    reviewCount: body?.reviewCount !== undefined ? (num(body.reviewCount) ?? 0) : current.reviewCount,
    sku: body?.sku !== undefined ? (str(body.sku, 60) || undefined) : current.sku,
    attributes: body?.attributes !== undefined ? recordStr(body.attributes) : current.attributes,
    weightOptions: body?.weightOptions !== undefined ? weightList(body.weightOptions) : current.weightOptions,
  };

  try {
    writeStore(data);
  } catch {
    return NextResponse.json({ error: 'Stockage indisponible (lecture seule)' }, { status: 500 });
  }
  return NextResponse.json(data.products[index]);
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const data = readStore();
  const before = data.products.length;
  data.products = data.products.filter(p => p.id !== id);
  if (data.products.length === before) {
    return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 });
  }
  try {
    writeStore(data);
  } catch {
    return NextResponse.json({ error: 'Stockage indisponible (lecture seule)' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
