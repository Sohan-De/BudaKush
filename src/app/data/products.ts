// Catalogue produits statique (source unique de vérité, sans base de données)
// Les prix utilisés pour le paiement sont recalculés côté serveur à partir de ce fichier.

export interface ProductBase {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tag?: string;
}

export interface ProductDetailed extends ProductBase {
  originalPrice?: number;
  discount?: string;
  rating: number;
  reviewCount?: number;
  sku?: string;
  attributes?: Record<string, string>;
  images: string[];
  weightOptions?: { weight: string; price: number }[];
  additionalInfo?: Record<string, string>;
  reviews?: {
    id: number;
    author: string;
    date: string;
    rating: number;
    content: string;
  }[];
  relatedProducts?: string[];
}

export interface StaticCategory {
  slug: string;
  name: string;
  description: string;
  image: string;
}

export const categories: StaticCategory[] = [
  { slug: 'flowers', name: 'Fleurs & Buds', description: 'Fleurs CBD et buds, ex. Ghost US', image: '/images/categories/fleur.webp' },
  { slug: 'oils', name: 'Huiles', description: 'Huiles CBD full spectrum et broad spectrum', image: '/images/categories/huile.jpg' },
  { slug: 'extractions', name: 'Extractions', description: 'Résines et hash CBD', image: '/images/categories/resine-cbd.jpg' },
  { slug: 'infusions', name: 'Infusions & Thés', description: 'Infusions et thés CBD bio', image: '/images/categories/comestible.jpg' },
  { slug: 'cosmetics', name: 'Cosmétiques & Bien-être', description: 'Baumes, crèmes et bonbons bien-être', image: '/images/categories/cosmetique.jpg' },
  { slug: 'discovery-packs', name: 'Packs Découverte', description: 'Packs Découverte pour tester notre gamme', image: '/images/categories/JUNGLESEXPERTboxCBD_1x_1.png' },
];

// Liste principale - utilisée pour les listes et les sliders
export const products: ProductBase[] = [
  // Fleurs CBD (7 produits)
  {
    id: '1',
    name: 'Gorilla Glue CBD',
    description: 'Small Buds - Saveur intense et relaxante',
    price: 39.90,
    image: '/images/gorilla-glue-small-buds-ivory.webp',
    tag: 'Bestseller',
    category: 'flowers'
  },
  {
    id: '2',
    name: 'Harlequin Indoor',
    description: 'Fleurs CBD indoor - Saveur tropicale',
    price: 12.90,
    image: '/images/fleurs-cbd-indoor-harlequin-ivory.webp',
    tag: 'Nouveau',
    category: 'flowers'
  },
  {
    id: '3',
    name: 'Green Crack CBD',
    description: 'Fleurs premium - Énergie et concentration',
    price: 14.50,
    image: '/images/green-crack-fleurs-de-cbd-easy-weed.webp',
    category: 'flowers'
  },
  {
    id: '4',
    name: 'Pop Corn 79 Outdoor',
    description: 'Fleurs CBD outdoor - Effet apaisant',
    price: 24.99,
    image: '/images/pop-corn-79-fleurs-de-cbd-outdoor.webp',
    category: 'flowers'
  },
  {
    id: '5',
    name: 'OG Kush CBD',
    description: 'Fleurs premium - Saveur terreux et épicée',
    price: 15.99,
    image: '/images/categories/fleur.webp',
    tag: 'Populaire',
    category: 'flowers'
  },
  {
    id: '6',
    name: 'Amnesia Haze CBD',
    description: 'Fleurs CBD indoor - Arômes citronnés',
    price: 18.50,
    image: '/images/categories/fleur.png',
    tag: 'Promo',
    category: 'flowers'
  },
  {
    id: '7',
    name: 'Critical Mass CBD',
    description: 'Fleurs CBD premium - Relief puissant',
    price: 22.99,
    image: '/images/pop-corn-79-fleurs-de-cbd-outdoor.webp',
    category: 'flowers'
  },

  // Huiles CBD (7 produits)
  {
    id: '8',
    name: 'Huile CBD Premium 15%',
    description: 'Extrait de Gorilla Glue - 10ml',
    price: 49.99,
    image: '/images/huile/huile-de-cbd-5-avec-thc-full-spectrum-chanvroo-france.webp',
    tag: 'Exclusif',
    category: 'oils'
  },
  {
    id: '9',
    name: 'Huile CBD 5% Full Spectrum',
    description: 'Avec THC (<0.3%) - Chanvroo France',
    price: 29.99,
    image: '/images/huile/huile-de-cbd-5-avec-thc-full-spectrum-chanvroo-france (1).jpg',
    category: 'oils'
  },
  {
    id: '10',
    name: 'Huile CBD 5% Collection',
    description: 'Full Spectrum - Flacon premium',
    price: 39.99,
    image: '/images/huile/huile-de-cbd-5-avec-thc-full-spectrum-chanvroo-france (2).jpg',
    tag: 'Nouveau',
    category: 'oils'
  },
  {
    id: '11',
    name: 'Huile CBD Immune 10%',
    description: 'Broad Spectrum avec Echinacea',
    price: 45.99,
    image: '/images/huile/huile-de-cbd-immune-10-broad-spectrum-avec-echinacea-harvest-laboratoires.jpg',
    category: 'oils'
  },
  {
    id: '12',
    name: 'Huile CBD Full Spectrum',
    description: 'Chanvroo France - Qualité supérieure',
    price: 54.99,
    image: '/images/huile/huile-de-cbd-5-avec-thc-full-spectrum-chanvroo-france.jpg',
    tag: 'Premium',
    category: 'oils'
  },
  {
    id: '13',
    name: 'Huile CBD Transit',
    description: 'Formule digestive - Full Spectrum',
    price: 34.50,
    image: '/images/huile/huile-de-cbd-full-spectrum-transit-chanvroo.jpg',
    category: 'oils'
  },
  {
    id: '14',
    name: 'Huile CBD Endométriose',
    description: 'CBD+CBG+CBN - Soulagement ciblé',
    price: 79.99,
    image: '/images/huile/huile-de-cbd-10-endometriose-cbd-cbg-cbn.jpg',
    tag: 'Médical',
    category: 'oils'
  },

  // Résines CBD (7 produits)
  {
    id: '15',
    name: 'Hash CBD King Hassan',
    description: 'Le Hash CBD King Hassan est une résine de haute qualité, fabriquée selon les méthodes traditionnelles marocaines. Avec une texture malléable et un parfum terreux authentique, cette résine offre un effet relaxant et une expérience gustative riche.',
    price: 24.99,
    image: '/images/resines/hash-cbd-king-hassan-easyweed.webp',
    tag: 'Bestseller',
    category: 'extractions'
  },
  {
    id: '16',
    name: 'Résine CBD Olive 3XF',
    description: 'Notre résine Olive 3XF est une résine premium avec un taux de CBD exceptionnel et un arôme unique. Sa texture molle et malléable permet un usage polyvalent, idéale pour les connaisseurs.',
    price: 29.99,
    image: '/images/resines/olive-3xf-resine-de-cbd-ivory.webp',
    category: 'extractions'
  },
  {
    id: '17',
    name: 'Hash CBD Afghan Bomb',
    description: 'Afghan Bomb est un hash CBD traditionnel à l\'arôme puissant et au goût authentique. Fabriqué selon les méthodes ancestrales, il offre une expérience proche du produit historique, mais 100% légal.',
    price: 26.90,
    image: '/images/resines/hash-cbd-afghan-bomb-ivory.webp',
    tag: 'Populaire',
    category: 'extractions'
  },
  {
    id: '18',
    name: 'Le Jaune 18 Résine CBD',
    description: 'Le Jaune 18 est une résine CBD unique avec sa couleur dorée caractéristique et son taux de CBD de 18%. Son arôme distinctif et sa texture parfaite en font un produit très apprécié des connaisseurs.',
    price: 22.50,
    image: '/images/resines/le-jaune-18-resine-de-cbd-easy-weed.webp',
    category: 'extractions'
  },
  {
    id: '19',
    name: 'Hash CBD Morocco Filter',
    description: 'Ce hash CBD Morocco Filter est fabriqué selon la méthode traditionnelle de filtration, offrant une qualité supérieure et une expérience authentique. Son arôme riche et son effet relaxant en font un produit idéal pour les moments de détente.',
    price: 19.99,
    image: '/images/resines/hash-cbd-morocco-filter.webp',
    tag: 'Économique',
    category: 'extractions'
  },
  {
    id: '20',
    name: 'Hash CBD Ketama Gold',
    description: 'Variété emblématique - Ivory',
    price: 27.50,
    image: '/images/resines/hash-cbd-ketama-gold-ivory.webp',
    category: 'extractions'
  },
  {
    id: '21',
    name: 'Oreoz Résine NBSH',
    description: 'Saveur unique - EasyWeed',
    price: 32.99,
    image: '/images/resines/oreoz-resine-nbsh-easy-weed-.webp',
    tag: 'Nouveau',
    category: 'extractions'
  },

  // Comestibles CBD (7 produits)
  {
    id: '22',
    name: 'Bonbons CBD Cherry',
    description: 'Saveur cerise - Candy Co.',
    price: 19.99,
    image: '/images/comestible/bonbons-cbd-cherry-cerise-candy-co.webp',
    tag: 'Limited',
    category: 'cosmetics'
  },
  {
    id: '23',
    name: 'Bonbons CBD Pomme Verte',
    description: 'Fizzypple - Effet rafraîchissant',
    price: 18.99,
    image: '/images/comestible/bonbons-cbd-fizzypple-pomme-verte-candy-co.webp',
    category: 'cosmetics'
  },
  {
    id: '24',
    name: 'Infusion CBD Réflexion',
    description: 'Bio - Herboristerie Alexandra 30g',
    price: 14.50,
    image: '/images/comestible/todo-infusion-cbd-reflexion-bio-herboristerie-alexandra-30g.webp',
    tag: 'Bio',
    category: 'infusions'
  },
  {
    id: '25',
    name: 'Infusion CBD Zen',
    description: 'Bio - Relaxation et bien-être - 30g',
    price: 15.90,
    image: '/images/comestible/todo2-infusion-cbd-zen-bio-herboristerie-alexandra-30g.webp',
    category: 'infusions'
  },
  {
    id: '26',
    name: 'Bonbons CBD+CBN Sommeil',
    description: 'À la mélatonine - Shanti Candy',
    price: 22.99,
    image: '/images/comestible/bonbons-cbd-cbn-melatonine-sommeil-shanti-candy.webp',
    tag: 'Bestseller',
    category: 'cosmetics'
  },
  {
    id: '27',
    name: 'Infusion CBD Matin Tonique',
    description: 'Bio - Boost d\'énergie naturel - 30g',
    price: 15.50,
    image: '/images/comestible/todo-infusion-cbd-matin-tonique-bio-herboristerie-alexandra-30g.webp',
    category: 'infusions'
  },
  {
    id: '28',
    name: 'Bonbons CBD Summer Vibes',
    description: 'CBD 5% - Saveurs estivales',
    price: 18.50,
    image: '/images/comestible/bonbons-cbd-5-summer-vibes-shanti-candy (1).webp',
    tag: 'Nouveau',
    category: 'cosmetics'
  },

  // Nouveautés
  {
    id: '29',
    name: 'CBD Vape Pen',
    description: 'Jetable - Saveur Menthe Glaciale',
    price: 24.99,
    image: '/images/categories/accesoire.jpg',
    tag: 'Nouveau',
    category: 'oils'
  },
  {
    id: '30',
    name: 'Baume CBD Sport',
    description: 'Tube 50ml - Récupération musculaire',
    price: 34.90,
    image: '/images/categories/cosmetique.jpg',
    tag: 'Nouveau',
    category: 'cosmetics'
  },
  {
    id: '31',
    name: 'Crème Visage CBD',
    description: 'Pot 30ml - Anti-inflammatoire',
    price: 42.99,
    image: '/images/categories/cosmetique.jpg',
    tag: 'Nouveau',
    category: 'cosmetics'
  }
];

// Données détaillées - pages produit
export const detailedProducts: Record<string, ProductDetailed> = {
  '1': {
    id: '1',
    name: 'Gorilla Glue CBD',
    description: 'Notre Gorilla Glue CBD est une variété premium reconnue pour sa puissance et ses effets relaxants. Avec un taux de CBD élevé de 18%, cette fleur offre une expérience apaisante idéale pour la détente en fin de journée.',
    price: 39.90,
    originalPrice: 49.90,
    discount: '-20%',
    rating: 4.9,
    reviewCount: 42,
    sku: 'GG-CBD-001',
    image: '/images/gorilla-glue-small-buds-ivory.webp',
    attributes: {
      'Taux de CBD': '18%',
      'Culture': 'Indoor',
      'Goût': 'Terreux, Pin, Épicé',
      'Origine': 'Europe'
    },
    images: [
      '/images/gorilla-glue-small-buds-ivory.webp',
      '/images/fleurs-cbd-indoor-harlequin-ivory.webp',
      '/images/green-crack-fleurs-de-cbd-easy-weed.webp',
      '/images/pop-corn-79-fleurs-de-cbd-outdoor.webp'
    ],
    weightOptions: [
      { weight: '3g', price: 13.90 },
      { weight: '5g', price: 24.90 },
      { weight: '10g', price: 39.90 },
      { weight: '20g', price: 69.90 }
    ],
    category: 'flowers',
    tag: 'Bestseller',
    additionalInfo: {
      'Taux de CBD': '18%',
      'Taux de THC': '<0,2% (légal en France)',
      'Type de culture': 'Indoor',
      'Origine': 'Europe',
      'Certification': 'Agriculture biologique',
      'Arômes': 'Terreux, Pin, Épicé, Notes de diesel',
      'Effets': 'Relaxant, Apaisant',
      'Poids disponibles': '3g, 5g, 10g, 20g',
      'Conservation': 'Dans un endroit frais et sec, à l\'abri de la lumière'
    },
    reviews: [
      {
        id: 1,
        author: 'Sophie M.',
        date: 'Le 15 mars 2023',
        rating: 5,
        content: 'Excellente qualité, arôme intense et effets relaxants très efficaces. Parfait en fin de journée pour décompresser. La livraison a été rapide et le packaging est discret.'
      },
      {
        id: 2,
        author: 'Thomas L.',
        date: 'Le 22 février 2023',
        rating: 5,
        content: 'Je suis fidèle à cette variété depuis plusieurs mois maintenant. L\'effet est constant et la qualité toujours au rendez-vous. Je recommande vivement pour les personnes cherchant à se détendre.'
      },
      {
        id: 3,
        author: 'Julie R.',
        date: 'Le 5 février 2023',
        rating: 4,
        content: 'Gorilla Glue est idéale pour les soirées détente. J\'apprécie particulièrement ses arômes et l\'effet relaxant qui n\'est pas trop assommant. Seul bémol, le prix qui est un peu élevé, mais la qualité est au rendez-vous.'
      }
    ],
    relatedProducts: ['2', '3', '4', '5']
  },
  '2': {
    id: '2',
    name: 'Harlequin CBD',
    description: 'Harlequin CBD est une variété indoor à dominante Sativa, reconnue pour ses arômes tropicaux et ses effets équilibrés. Idéale pour une utilisation en journée.',
    price: 12.90,
    rating: 4.5,
    reviewCount: 28,
    sku: 'HL-CBD-002',
    image: '/images/fleurs-cbd-indoor-harlequin-ivory.webp',
    images: [
      '/images/fleurs-cbd-indoor-harlequin-ivory.webp',
      '/images/gorilla-glue-small-buds-ivory.webp',
      '/images/green-crack-fleurs-de-cbd-easy-weed.webp'
    ],
    weightOptions: [
      { weight: '3g', price: 12.90 },
      { weight: '5g', price: 19.90 },
      { weight: '10g', price: 36.90 }
    ],
    attributes: {
      'Taux de CBD': '12%',
      'Culture': 'Indoor',
      'Goût': 'Tropical, Fruité',
      'Origine': 'Suisse'
    },
    category: 'flowers',
    tag: 'Nouveau',
    relatedProducts: ['1', '3', '6']
  },
  '3': {
    id: '3',
    name: 'Green Crack CBD',
    description: 'Green Crack CBD est une variété énergisante, parfaite pour stimuler la créativité et la concentration. Son profil terpénique offre des notes d\'agrumes et de fruits exotiques.',
    price: 14.50,
    rating: 4.0,
    reviewCount: 16,
    sku: 'GC-CBD-003',
    image: '/images/green-crack-fleurs-de-cbd-easy-weed.webp',
    images: [
      '/images/green-crack-fleurs-de-cbd-easy-weed.webp',
      '/images/gorilla-glue-small-buds-ivory.webp'
    ],
    weightOptions: [
      { weight: '3g', price: 14.50 },
      { weight: '5g', price: 22.90 },
      { weight: '10g', price: 42.90 }
    ],
    attributes: {
      'Taux de CBD': '14%',
      'Culture': 'Indoor',
      'Goût': 'Agrumes, Mangue',
      'Origine': 'Europe'
    },
    category: 'flowers',
    relatedProducts: ['1', '4', '7']
  },
  '8': {
    id: '8',
    name: 'Huile CBD Premium 15%',
    description: 'Notre huile Premium CBD 15% est un extrait full-spectrum de Gorilla Glue, extraite par CO2 supercritique pour préserver tous les cannabinoïdes et terpènes. Idéale pour un usage quotidien, cette huile offre des effets apaisants intenses.',
    price: 49.99,
    rating: 4.8,
    reviewCount: 35,
    sku: 'OIL-CBD-001',
    image: '/images/huile/huile-de-cbd-5-avec-thc-full-spectrum-chanvroo-france.webp',
    images: [
      '/images/huile/huile-de-cbd-5-avec-thc-full-spectrum-chanvroo-france.webp',
      '/images/huile/huile-de-cbd-5-avec-thc-full-spectrum-chanvroo-france (1).jpg',
      '/images/huile/huile-de-cbd-10-endometriose-cbd-cbg-cbn.jpg'
    ],
    attributes: {
      'Concentration': '15%',
      'Type': 'Full Spectrum',
      'Volume': '10ml',
      'Base': 'Huile MCT'
    },
    weightOptions: [
      { weight: '10ml', price: 49.99 },
      { weight: '30ml', price: 129.99 }
    ],
    category: 'oils',
    tag: 'Exclusif',
    relatedProducts: ['9', '10', '12']
  },
  '15': {
    id: '15',
    name: 'Hash CBD King Hassan',
    description: 'Le Hash CBD King Hassan est une résine de haute qualité, fabriquée selon les méthodes traditionnelles marocaines. Avec une texture malléable et un parfum terreux authentique, cette résine offre un effet relaxant et une expérience gustative riche.',
    price: 24.99,
    rating: 4.7,
    reviewCount: 22,
    sku: 'HASH-001',
    image: '/images/resines/hash-cbd-king-hassan-easyweed.webp',
    images: [
      '/images/resines/hash-cbd-king-hassan-easyweed.webp',
      '/images/resines/olive-3xf-resine-de-cbd-ivory.webp',
      '/images/resines/hash-cbd-afghan-bomb-ivory.webp'
    ],
    attributes: {
      'Taux de CBD': '20%',
      'Texture': 'Souple',
      'Goût': 'Terreux, Épicé',
      'Origine': 'Maroc'
    },
    weightOptions: [
      { weight: '1g', price: 24.99 },
      { weight: '2g', price: 44.99 },
      { weight: '3g', price: 64.99 },
      { weight: '5g', price: 99.99 },
      { weight: '10g', price: 189.99 }
    ],
    category: 'extractions',
    tag: 'Bestseller',
    relatedProducts: ['16', '17', '19']
  },
  '16': {
    id: '16',
    name: 'Résine CBD Olive 3XF',
    description: 'Notre résine Olive 3XF est une résine premium avec un taux de CBD exceptionnel et un arôme unique. Sa texture molle et malléable permet un usage polyvalent, idéale pour les connaisseurs.',
    price: 29.99,
    rating: 4.6,
    reviewCount: 18,
    sku: 'HASH-002',
    image: '/images/resines/olive-3xf-resine-de-cbd-ivory.webp',
    images: [
      '/images/resines/olive-3xf-resine-de-cbd-ivory.webp',
      '/images/resines/hash-cbd-king-hassan-easyweed.webp',
      '/images/resines/hash-cbd-afghan-bomb-ivory.webp'
    ],
    attributes: {
      'Taux de CBD': '25%',
      'Texture': 'Molle',
      'Goût': 'Fruité, Boisé',
      'Origine': 'Espagne'
    },
    weightOptions: [
      { weight: '1g', price: 29.99 },
      { weight: '2g', price: 54.99 },
      { weight: '3g', price: 74.99 },
      { weight: '5g', price: 119.99 },
      { weight: '10g', price: 219.99 }
    ],
    category: 'extractions',
    tag: 'Premium',
    relatedProducts: ['15', '17', '18']
  },
  '17': {
    id: '17',
    name: 'Hash CBD Afghan Bomb',
    description: 'Afghan Bomb est un hash CBD traditionnel à l\'arôme puissant et au goût authentique. Fabriqué selon les méthodes ancestrales, il offre une expérience proche du produit historique, mais 100% légal.',
    price: 26.90,
    rating: 4.5,
    reviewCount: 15,
    sku: 'HASH-003',
    image: '/images/resines/hash-cbd-afghan-bomb-ivory.webp',
    images: [
      '/images/resines/hash-cbd-afghan-bomb-ivory.webp',
      '/images/resines/hash-cbd-king-hassan-easyweed.webp',
      '/images/resines/le-jaune-18-resine-de-cbd-easy-weed.webp'
    ],
    attributes: {
      'Taux de CBD': '18%',
      'Texture': 'Semi-dure',
      'Goût': 'Épicé, Encens',
      'Origine': 'Afghanistan'
    },
    weightOptions: [
      { weight: '1g', price: 26.90 },
      { weight: '2g', price: 49.90 },
      { weight: '3g', price: 69.90 },
      { weight: '5g', price: 109.90 },
      { weight: '10g', price: 199.90 }
    ],
    category: 'extractions',
    tag: 'Populaire',
    relatedProducts: ['15', '16', '19']
  },
  '18': {
    id: '18',
    name: 'Le Jaune 18 Résine CBD',
    description: 'Le Jaune 18 est une résine CBD unique avec sa couleur dorée caractéristique et son taux de CBD de 18%. Son arôme distinctif et sa texture parfaite en font un produit très apprécié des connaisseurs.',
    price: 22.50,
    rating: 4.3,
    reviewCount: 12,
    sku: 'HASH-004',
    image: '/images/resines/le-jaune-18-resine-de-cbd-easy-weed.webp',
    images: [
      '/images/resines/le-jaune-18-resine-de-cbd-easy-weed.webp',
      '/images/resines/hash-cbd-afghan-bomb-ivory.webp',
      '/images/resines/hash-cbd-king-hassan-easyweed.webp'
    ],
    attributes: {
      'Taux de CBD': '18%',
      'Texture': 'Souple',
      'Goût': 'Caramel, Épicé',
      'Origine': 'Liban'
    },
    weightOptions: [
      { weight: '1g', price: 22.50 },
      { weight: '2g', price: 42.50 },
      { weight: '3g', price: 59.90 },
      { weight: '5g', price: 94.90 },
      { weight: '10g', price: 179.90 }
    ],
    category: 'extractions',
    tag: 'Nouveau',
    relatedProducts: ['15', '16', '19']
  },
  '19': {
    id: '19',
    name: 'Hash CBD Morocco Filter',
    description: 'Ce hash CBD Morocco Filter est fabriqué selon la méthode traditionnelle de filtration, offrant une qualité supérieure et une expérience authentique. Son arôme riche et son effet relaxant en font un produit idéal pour les moments de détente.',
    price: 19.99,
    rating: 4.4,
    reviewCount: 20,
    sku: 'HASH-005',
    image: '/images/resines/hash-cbd-morocco-filter.webp',
    images: [
      '/images/resines/hash-cbd-morocco-filter.webp',
      '/images/resines/hash-cbd-king-hassan-easyweed.webp',
      '/images/resines/le-jaune-18-resine-de-cbd-easy-weed.webp'
    ],
    attributes: {
      'Taux de CBD': '16%',
      'Texture': 'Semi-dure',
      'Goût': 'Terreux, Notes de cèdre',
      'Origine': 'Maroc'
    },
    weightOptions: [
      { weight: '1g', price: 19.99 },
      { weight: '2g', price: 37.99 },
      { weight: '3g', price: 54.99 },
      { weight: '5g', price: 84.99 },
      { weight: '10g', price: 159.99 }
    ],
    category: 'extractions',
    tag: 'Économique',
    relatedProducts: ['15', '16', '17']
  },
  '22': {
    id: '22',
    name: 'Bonbons CBD Cherry',
    description: 'Nos bonbons CBD Cherry sont infusés avec 10mg de CBD isolat par bonbon. Cette confiserie au goût authentique de cerise offre une manière discrète et savoureuse de consommer du CBD tout au long de la journée.',
    price: 19.99,
    rating: 4.5,
    reviewCount: 18,
    sku: 'EDIB-001',
    image: '/images/comestible/bonbons-cbd-cherry-cerise-candy-co.webp',
    images: [
      '/images/comestible/bonbons-cbd-cherry-cerise-candy-co.webp',
      '/images/comestible/bonbons-cbd-fizzypple-pomme-verte-candy-co.webp',
      '/images/comestible/todo-infusion-cbd-reflexion-bio-herboristerie-alexandra-30g.webp'
    ],
    attributes: {
      'Dosage': '10mg CBD/bonbon',
      'Quantité': '20 bonbons',
      'Type de CBD': 'Isolat',
      'Saveur': 'Cerise'
    },
    weightOptions: [
      { weight: '20 bonbons', price: 19.99 },
      { weight: '40 bonbons', price: 34.99 }
    ],
    category: 'cosmetics',
    tag: 'Limited',
    relatedProducts: ['23', '24', '25']
  }
};

// Récupère les détails d'un produit (lève une erreur si inconnu)
export const getDetailedProduct = (id: string): ProductDetailed => {
  if (detailedProducts[id]) {
    return detailedProducts[id];
  }

  const basicProduct = products.find(p => p.id === id);

  if (!basicProduct) {
    throw new Error(`Product with ID ${id} not found`);
  }

  return {
    ...basicProduct,
    rating: 4.0,
    images: [basicProduct.image],
    weightOptions: [
      { weight: 'Standard', price: basicProduct.price }
    ]
  };
};

// Produits d'une catégorie ('all' = tous)
export const getProductsByCategory = (category: string): ProductBase[] => {
  if (category === 'all') {
    return products;
  }

  return products.filter(product => product.category === category);
};

// Produits "vedettes" (bestsellers / populaires / premium)
export const getFeaturedProducts = (): ProductBase[] => {
  return products.filter(product =>
    product.tag === 'Bestseller' ||
    product.tag === 'Populaire' ||
    product.tag === 'Premium'
  );
};

// Nouveaux produits
export const getNewProducts = (): ProductBase[] => {
  return products.filter(product => product.tag === 'Nouveau');
};

/**
 * Prix officiel d'un article, calculé côté serveur.
 * - Sans poids (ou "Standard"/"default") : prix du produit affiché dans les listes.
 * - Avec poids : prix de l'option correspondante.
 * Retourne null si le produit ou l'option n'existe pas (commande refusée).
 */
export const getServerUnitPrice = (productId: string, weight?: string): number | null => {
  const basic = products.find(p => p.id === productId);
  if (!basic) return null;

  if (!weight || weight === 'Standard' || weight === 'default') {
    return basic.price;
  }

  const option = detailedProducts[productId]?.weightOptions?.find(o => o.weight === weight);
  return option ? option.price : null;
};
