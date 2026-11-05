'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Loader from './Loader';
import styles from './Hero.module.css';

// Photos du dossier public/images/BudaKush (versions optimisées)
const HERO_IMAGES = [
  '/images/BudaKush/web/hero-002.webp',
  '/images/BudaKush/web/hero-005.webp',
];

const SLIDE_INTERVAL_MS = 6000;

const Hero = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Afficher le contenu dès que la première photo est chargée (délai de sécurité)
  useEffect(() => {
    const first = new window.Image();
    first.src = HERO_IMAGES[0];
    first.onload = () => setIsLoading(false);
    first.onerror = () => setIsLoading(false);

    const timeout = setTimeout(() => setIsLoading(false), 5000);
    return () => clearTimeout(timeout);
  }, []);

  // Diaporama automatique
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % HERO_IMAGES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <Loader isLoading={isLoading} />

      <section
        className={`${styles.hero} ${!isLoading ? styles.heroVisible : ''}`}
        aria-label="Présentation BudaKush CBD"
      >
        <div className={styles.slides} aria-hidden="true">
          {HERO_IMAGES.map((src, index) => (
            <div
              key={src}
              className={`${styles.slide} ${index === currentIndex ? styles.slideActive : ''}`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="100vw"
                priority={index === 0}
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>

        <div className={styles.overlay} />

        <div className={styles.content}>
          <span className={styles.eyebrow}>Boutique CBD · Perpignan</span>
          <h1 className={styles.title}>
            <span className={styles.titleBuda}>Buda</span>Kush
          </h1>
          <p className={styles.subtitle}>
            Fleurs, huiles, extractions et bien-être : une sélection CBD de qualité, choisie avec soin pour un quotidien naturel.
          </p>
          <div className={styles.actions}>
            <Link href="/products" className={styles.primaryBtn}>
              Découvrir la boutique
            </Link>
            <Link href="/products?category=discovery-packs" className={styles.secondaryBtn}>
              Pack Découverte
            </Link>
          </div>
        </div>

        <div className={styles.dots}>
          {HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Afficher la photo ${index + 1}`}
              onClick={() => setCurrentIndex(index)}
              className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
            />
          ))}
        </div>

        <div className={styles.infoBar}>
          <div className={styles.infoInner}>
            <span className={styles.infoItem}>
              <strong>Adresse</strong> 4 Rue de la Fusterie, 66000 Perpignan
            </span>
            <span className={styles.infoItem}>
              <strong>Horaires</strong> Mar – Sam · 11h30 – 20h30
            </span>
            <span className={styles.infoItem}>
              <strong>Téléphone</strong> +33 6 35 14 40 89
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
