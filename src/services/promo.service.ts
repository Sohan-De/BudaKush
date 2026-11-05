// Validation des codes promo côté navigateur (aperçu). Le serveur revalide au paiement.
export async function validatePromoCode(code: string, orderAmount: number) {
  try {
    const res = await fetch('/api/promo/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, amount: orderAmount }),
    });
    const data = await res.json();
    return {
      valid: !!data.valid,
      discount: Number(data.discount) || 0,
      message: data.message as string | undefined,
    };
  } catch (error) {
    console.error('Error validating promo code:', error);
    return { valid: false, discount: 0, message: 'Erreur lors de la validation du code promo' };
  }
}
