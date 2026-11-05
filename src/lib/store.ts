// Accès serveur à data/store.json (aucun Supabase).
// Données de départ = catalogue codé en dur (src/app/data/products.ts).
// Ce module utilise fs : ne l'importez jamais depuis un composant client.
import fs from 'fs';
import path from 'path';
import { products as seedBasic, detailedProducts, categories as seedCategories } from '@/app/data/products';
import type { StoreData, StoreProduct } from '@/types/store.types';

const STORE_PATH = path.join(process.cwd(), 'data', 'store.json');

function seed(): StoreData {
  const products: StoreProduct[] = seedBasic.map(base => {
    const d = detailedProducts[base.id];
    return {
      id: base.id,
      name: base.name,
      description: base.description,
      price: base.price,
      image: base.image,
      images: d?.images?.length ? d.images : [base.image],
      category: base.category,
      tag: base.tag,
      rating: d?.rating ?? 4,
      reviewCount: d?.reviewCount,
      sku: d?.sku,
      originalPrice: d?.originalPrice,
      discount: d?.discount,
      attributes: d?.attributes,
      weightOptions: d?.weightOptions,
      additionalInfo: d?.additionalInfo,
      reviews: d?.reviews,
      relatedProducts: d?.relatedProducts,
    };
  });

  return {
    products,
    categories: seedCategories.map(c => ({ slug: c.slug, name: c.name, description: c.description, image: c.image })),
    promos: [],
    orders: [],
  };
}

export function writeStore(data: StoreData): void {
  fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  const tmp = `${STORE_PATH}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, STORE_PATH);
}

export function readStore(): StoreData {
  if (!fs.existsSync(STORE_PATH)) {
    const initial = seed();
    try {
      writeStore(initial);
    } catch {
      // Système de fichiers en lecture seule : on travaille en mémoire
    }
    return initial;
  }
  return JSON.parse(fs.readFileSync(STORE_PATH, 'utf8')) as StoreData;
}
