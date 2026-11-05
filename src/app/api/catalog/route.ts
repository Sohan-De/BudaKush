import { NextResponse } from 'next/server';
import { readStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

// Catalogue public (produits + catégories). Pas de codes promo ni de commandes ici.
export async function GET() {
  const { products, categories } = readStore();
  return NextResponse.json({ products, categories }, { headers: { 'Cache-Control': 'no-store' } });
}
