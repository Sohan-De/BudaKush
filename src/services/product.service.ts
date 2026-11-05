// Service produits en lecture seule, alimenté par le catalogue statique (src/app/data/products.ts).
// Lecture seule, basée sur le catalogue statique (src/app/data/products.ts).
// pour que les pages n'aient pas besoin d'être réécrites.
import {
  products as catalog,
  detailedProducts,
  categories as staticCategories,
  ProductBase,
} from '@/app/data/products';
import { Product, ProductWithPrices, Category, ColorVariant, ProductImage, PriceOption } from '@/types/database.types';

const CREATED_AT = '2025-01-01T00:00:00.000Z';

const cultureFromAttributes = (attributes?: Record<string, string>): Product['culture_type'] => {
  const culture = attributes?.['Culture'] || attributes?.['Type de culture'];
  if (!culture) return 'none';
  return culture.toLowerCase().includes('outdoor') ? 'outdoor' : 'indoor';
};

const cbdFromAttributes = (attributes?: Record<string, string>): number | null => {
  const raw = attributes?.['Taux de CBD'] || attributes?.['Concentration'];
  if (!raw) return null;
  const value = parseFloat(raw.replace(',', '.'));
  return Number.isNaN(value) ? null : value;
};

const categoryFor = (slug: string): Category => {
  const index = staticCategories.findIndex(c => c.slug === slug);
  const cat = staticCategories.find(c => c.slug === slug);
  return {
    id: slug,
    name: cat?.name ?? slug,
    slug,
    description: cat?.description ?? null,
    image_url: cat?.image ?? null,
    order: index === -1 ? 999 : index,
  };
};

// Transforme un produit statique au format attendu par les pages
const toProduct = (base: ProductBase, index: number): Product => {
  const detailed = detailedProducts[base.id];
  const attributes = detailed?.attributes;
  return {
    id: base.id,
    name: base.name,
    description: base.description,
    price_3g: 0,
    price_5g: 0,
    price_10g: 0,
    price_30g: 0,
    price_50g: 0,
    base_price: base.price,
    discounted_price: null,
    cbd_percentage: cbdFromAttributes(attributes),
    culture_type: cultureFromAttributes(attributes),
    origin: attributes?.['Origine'],
    created_at: CREATED_AT,
    image_url: base.image,
    category: base.category,
    category_id: base.category,
    tag: base.tag,
    is_featured: base.tag === 'Bestseller' || base.tag === 'Populaire' || base.tag === 'Premium',
    is_new: base.tag === 'Nouveau',
    in_stock: true,
    review_count: detailed?.reviewCount ?? 0,
    rating: detailed?.rating ?? 4,
    order: index,
    categories: categoryFor(base.category),
    color_variants: [],
    product_images: [],
    price_options: [],
  } as Product;
};

const allProducts = (): Product[] => catalog.map((p, i) => toProduct(p, i));

/** Tous les produits */
export const getAllProducts = async (): Promise<Product[]> => allProducts();

/** Produit par ID */
export const getProductById = async (id: string): Promise<Product | null> =>
  allProducts().find(p => p.id === id) ?? null;

/** Produits d'une catégorie (slug) */
export const getProductsByCategory = async (categorySlug: string): Promise<Product[]> => {
  if (categorySlug === 'all') return allProducts();
  return allProducts().filter(p => p.category === categorySlug);
};

/** Format weight options (même logique que l'ancienne version) */
export const formatProductWithPrices = (product: Product): ProductWithPrices => {
  const detailed = detailedProducts[product.id];
  if (detailed?.weightOptions && detailed.weightOptions.length > 0) {
    return {
      ...product,
      weightOptions: detailed.weightOptions.map(o => ({ weight: o.weight, price: o.price })),
    };
  }
  return {
    ...product,
    weightOptions: [{ weight: 'default', price: product.base_price || 0, discounted_price: undefined }],
  };
};

/** Détail produit avec options de poids */
export const getDetailedProduct = async (id: string): Promise<ProductWithPrices | null> => {
  const product = await getProductById(id);
  if (!product) return null;
  return formatProductWithPrices(product);
};

/** Toutes les catégories */
export const getAllCategories = async (): Promise<Category[]> =>
  staticCategories.map(c => categoryFor(c.slug));

/** Catégorie par slug */
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  if (!staticCategories.some(c => c.slug === slug)) return null;
  return categoryFor(slug);
};

/** Pas de variantes de couleur dans le catalogue statique */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getProductColorVariants = async (productId: string): Promise<ColorVariant[]> => [];

/** Photos d'un produit (galerie statique) */
export const getProductImages = async (productId: string): Promise<ProductImage[]> => {
  const detailed = detailedProducts[productId];
  const urls = detailed?.images?.length
    ? detailed.images
    : (catalog.find(p => p.id === productId)?.image ? [catalog.find(p => p.id === productId)!.image] : []);
  return urls.map((url, i) => ({
    id: `${productId}-${i}`,
    product_id: productId,
    image_url: url,
    is_primary: i === 0,
  }));
};

/** Options de prix (non utilisées avec le catalogue statique) */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getProductPriceOptions = async (productId: string): Promise<PriceOption[]> => [];
