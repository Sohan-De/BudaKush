// Calcul serveur du panier : prix, livraison, remise. Le navigateur n'est jamais cru sur les montants.
import { getShippingCost } from '@/app/data/shipping';
import { computePromoDiscount } from '@/lib/promo-logic';
import { readStore } from '@/lib/store';
import type { StoreData, StoreOrderItem } from '@/types/store.types';

export interface IncomingItem {
  id: string;
  name?: string;
  quantity: number;
  weight?: string;
  isSample?: boolean;
}

export type OrderQuote =
  | {
      ok: true;
      items: StoreOrderItem[];
      subtotal: number;
      shipping: number;
      discount: number;
      promoCode: string | null;
      total: number;
    }
  | { ok: false; error: string };

const MAX_QTY = 99;

const unitPrice = (data: StoreData, productId: string, weight?: string): number | null => {
  const product = data.products.find(p => p.id === productId);
  if (!product) return null;
  if (!weight || weight === 'Standard' || weight === 'default') return product.price;
  const option = product.weightOptions?.find(o => o.weight === weight);
  return option ? option.price : null;
};

export function quoteOrder(
  items: IncomingItem[],
  shippingMethod: string,
  promoCode?: string | null,
  data: StoreData = readStore()
): OrderQuote {
  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, error: 'Aucun article dans le panier' };
  }

  const lines: StoreOrderItem[] = [];
  let subtotal = 0;
  let samples = 0;

  for (const item of items) {
    const qty = Number(item.quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
      return { ok: false, error: 'Quantité invalide' };
    }

    if (item.isSample) {
      // Échantillon gratuit : 1 seul, non facturé
      samples += 1;
      if (samples > 1 || qty !== 1) {
        return { ok: false, error: 'Un seul échantillon gratuit par commande' };
      }
      lines.push({
        id: String(item.id),
        name: (item.name || 'Échantillon gratuit').slice(0, 100),
        quantity: 1,
        price: 0,
        isSample: true,
      });
      continue;
    }

    const price = unitPrice(data, String(item.id), item.weight);
    if (price === null) {
      return { ok: false, error: `Produit ou option inconnu (${item.id})` };
    }
    const product = data.products.find(p => p.id === String(item.id));
    lines.push({
      id: String(item.id),
      name: product?.name || String(item.id),
      quantity: qty,
      price,
      weight: item.weight,
    });
    subtotal += price * qty;
  }

  subtotal = Math.round(subtotal * 100) / 100;

  const shipping = getShippingCost(shippingMethod || '', subtotal);
  if (shipping === null) {
    return { ok: false, error: 'Mode de livraison invalide' };
  }

  const code = promoCode ? promoCode.trim().toUpperCase() : '';
  const promo = code ? computePromoDiscount(data.promos, code, subtotal) : { valid: false, discount: 0 };
  const discount = promo.valid ? promo.discount : 0;

  const total = Math.max(0, Math.round((subtotal + shipping - discount) * 100) / 100);

  return {
    ok: true,
    items: lines,
    subtotal,
    shipping,
    discount,
    promoCode: promo.valid ? code : null,
    total,
  };
}
