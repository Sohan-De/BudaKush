'use client';

import Link from 'next/link';
import styles from '../styles.module.css';
import gridStyles from './FeaturedCategories.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCannabis, 
  faTint, 
  faPrescriptionBottle, 
  faCookie, 
  faStar,
  faVial
} from '@fortawesome/free-solid-svg-icons';
import SecondaryFeaturedProducts from './SecondaryFeaturedProducts';
import { getAllCategories } from '@/services/product.service';
import { useState, useEffect } from 'react';

// Icon mapping for categories
const categoryIcons: Record<string, typeof faCannabis> = {
  'flowers': faCannabis,
  'oils': faTint,
  'extractions': faPrescriptionBottle,
  'infusions': faCookie,
  'cosmetics': faVial,
  'discovery-packs': faStar,
};



const FeaturedCategories = () => {
  // Catégories lues depuis le catalogue (data/store.json)
  const [staticCategories, setStaticCategories] = useState<
    { id: string; name: string; slug: string; description: string; image_url: string }[]
  >([]);

  useEffect(() => {
    getAllCategories()
      .then(cats =>
        setStaticCategories(
          cats.map(c => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description ?? '',
            image_url: c.image_url ?? '',
          }))
        )
      )
      .catch(err => console.error('Catégories indisponibles:', err));
  }, []);

  if (staticCategories.length === 0) return null;

  // Utiliser la première catégorie (Fleurs CBD) comme catégorie principale
  const mainCategory = staticCategories[0];
  
  // Les 6 autres catégories dans l'ordre
  const displayCategories = staticCategories.slice(1, 7);

  return (
    <section className={styles.featuredCategories}>
      <div className={styles.sectionTitle}>
        <h2>Explorer Notre <span>Univers CBD</span></h2>
        <div className={styles.titleUnderline}></div>
      </div>
      
      <div className={styles.categoriesGrid}>
        <Link href={`/products?category=${mainCategory.slug}`} className={`${styles.categoryTile} ${styles.categoryLarge}`}>
          <div style={{
            backgroundImage: `url('${mainCategory.image_url}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transition: 'transform 0.5s ease',
          }} className={styles.categoryBackground}></div>
          <div className={styles.categoryContent}>
            <FontAwesomeIcon icon={categoryIcons[mainCategory.slug as keyof typeof categoryIcons] || faCannabis} size="2x" />
            <h3>{mainCategory.name}</h3>
          </div>
          <div className={styles.categoryOverlay}></div>
        </Link>
        
        <div className={`${styles.categoriesSmallContainer} ${gridStyles.categoriesSmallContainer}`}>
          {displayCategories.map(category => (
            <Link 
              key={category.id}
              href={`/products?category=${category.slug}`} 
              className={`${styles.categoryTile} ${styles.categorySmall}`}
            >
              <div style={{
                backgroundImage: `url('${category.image_url}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                transition: 'transform 0.5s ease',
              }} className={styles.categoryBackground}></div>
              <div className={styles.categoryContent}>
                <FontAwesomeIcon 
                  icon={categoryIcons[category.slug as keyof typeof categoryIcons] || faStar} 
                  size="2x" 
                />
                <h3>{category.name}</h3>
              </div>
              <div className={styles.categoryOverlay}></div>
            </Link>
          ))}
        </div>
      </div>
      <SecondaryFeaturedProducts />
    </section>
  );
};

export default FeaturedCategories; 