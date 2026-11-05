// Frais de livraison (source unique, utilisée par le serveur et l'affichage)
export const SHIPPING_COSTS: Record<string, number> = {
  point_relais_48h: 4.55,
  domicile_48h: 5.25,
  express_point_relais_24h: 8.5,
};

export const FREE_SHIPPING_THRESHOLD = 80;

/** Retourne le coût de livraison, ou null si le mode est inconnu */
export const getShippingCost = (method: string, subtotal: number): number | null => {
  if (!(method in SHIPPING_COSTS)) return null;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COSTS[method];
};
