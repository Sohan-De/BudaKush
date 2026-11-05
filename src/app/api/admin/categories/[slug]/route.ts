import { NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/store';
import { str } from '@/lib/admin-validate';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ slug: string }> };

export async function PUT(request: Request, { params }: Ctx) {
  const { slug } = await params;
  const body = await request.json().catch(() => null);
  const data = readStore();
  const index = data.categories.findIndex(c => c.slug === slug);
  if (index === -1) return NextResponse.json({ error: 'Catégorie introuvable' }, { status: 404 });

  const current = data.categories[index];
  const name = body?.name !== undefined ? str(body.name, 100) : current.name;
  if (!name) return NextResponse.json({ error: 'Le nom est obligatoire' }, { status: 400 });

  // L'identifiant (slug) ne change pas : les produits y sont rattachés
  data.categories[index] = {
    ...current,
    name,
    description: body?.description !== undefined ? str(body.description, 300) : current.description,
    image: body?.image !== undefined ? str(body.image, 300) : current.image,
  };
  try {
    writeStore(data);
  } catch {
    return NextResponse.json({ error: 'Stockage indisponible (lecture seule)' }, { status: 500 });
  }
  return NextResponse.json(data.categories[index]);
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const { slug } = await params;
  const data = readStore();
  if (data.products.some(p => p.category === slug)) {
    return NextResponse.json(
      { error: 'Cette catégorie contient des produits : déplacez-les avant de la supprimer' },
      { status: 409 }
    );
  }
  const before = data.categories.length;
  data.categories = data.categories.filter(c => c.slug !== slug);
  if (data.categories.length === before) {
    return NextResponse.json({ error: 'Catégorie introuvable' }, { status: 404 });
  }
  try {
    writeStore(data);
  } catch {
    return NextResponse.json({ error: 'Stockage indisponible (lecture seule)' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
