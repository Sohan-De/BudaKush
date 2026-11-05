import { NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/store';
import { str } from '@/lib/admin-validate';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(readStore().categories);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const data = readStore();

  const name = str(body?.name, 100);
  const slug = str(body?.slug, 60).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
  if (!name || !slug) return NextResponse.json({ error: 'Nom et identifiant obligatoires' }, { status: 400 });
  if (data.categories.some(c => c.slug === slug)) {
    return NextResponse.json({ error: 'Cet identifiant existe déjà' }, { status: 409 });
  }

  const category = {
    slug,
    name,
    description: str(body?.description, 300),
    image: str(body?.image, 300),
  };
  data.categories.push(category);
  try {
    writeStore(data);
  } catch {
    return NextResponse.json({ error: 'Stockage indisponible (lecture seule)' }, { status: 500 });
  }
  return NextResponse.json(category, { status: 201 });
}
