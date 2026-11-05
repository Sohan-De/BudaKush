// Logique des codes promo (pure : utilisable côté serveur comme côté client)
import type { StorePromo } from '@/types/store.types';

export const computePromoDiscount = (
  promos: StorePromo[],
  code: string,
  orderAmount: number
): { valid: boolean; discount: number; message?: string } => {
  const promo = promos.find(p => p.code === code.trim().toUpperCase());
  if (!promo) {
    return { valid: false, discount: 0, message: 'Code promo invalide' };
  }
  if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
    return { valid: false, discount: 0, message: 'Ce code promo a expiré' };
  }
  if (orderAmount < promo.min_order_amount) {
    return { valid: false, discount: 0, message: `Le montant minimum de commande est de ${promo.min_order_amount}€` };
  }
  return { valid: true, discount: Math.round(((orderAmount * promo.discount_percent) / 100) * 100) / 100 };
};
