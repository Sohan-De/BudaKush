// Mode démo : le paiement Stripe est simulé (aucun débit réel).
// Activer : NEXT_PUBLIC_DEMO_CHECKOUT=true (client) ET DEMO_CHECKOUT=true (serveur).
export const IS_DEMO_CHECKOUT = process.env.NEXT_PUBLIC_DEMO_CHECKOUT === 'true';
