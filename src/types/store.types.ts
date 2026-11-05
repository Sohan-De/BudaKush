// Types de la base JSON locale (data/store.json) : produits, catégories, codes promo, commandes.
// Fichier partagé client/serveur : aucune dépendance Node ici.

export interface StoreWeightOption {
  weight: string;
  price: number;
}

export interface StoreProduct {
  id: string;
  name: string;
  description: string;
  price: number; // prix de base (listes)
  image: string; // photo principale
  images: string[]; // galerie
  category: string; // slug de la catégorie
  tag?: string;
  rating: number;
  reviewCount?: number;
  sku?: string;
  originalPrice?: number;
  discount?: string;
  attributes?: Record<string, string>;
  weightOptions?: StoreWeightOption[];
  additionalInfo?: Record<string, string>;
  reviews?: { id: number; author: string; date: string; rating: number; content: string }[];
  relatedProducts?: string[];
}

export interface StoreCategory {
  slug: string;
  name: string;
  description: string;
  image: string;
}

export interface StorePromo {
  code: string;
  discount_percent: number;
  min_order_amount: number;
  expires_at: string | null; // ISO date ou null
}

export type OrderStatus = 'paid' | 'preparing' | 'shipped' | 'cancelled';

export interface StoreOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  weight?: string;
  isSample?: boolean;
}

export interface StoreOrder {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: { email: string; name: string; phone?: string };
  shippingAddress: { name: string; street: string; city: string; postalCode: string; country: string; phone?: string };
  shippingMethod: string;
  items: StoreOrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  promoCode: string | null;
  total: number;
}

export interface StoreData {
  products: StoreProduct[];
  categories: StoreCategory[];
  promos: StorePromo[];
  orders: StoreOrder[];
}
