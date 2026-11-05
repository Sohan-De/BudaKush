'use client';

import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles.module.css';

interface FreeSample {
  id: string;
  name: string;
  image: string;
  description: string;
  value: string;
}

interface FreeSampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSampleSelected: (sample: FreeSample | null) => void;
}

// Sample data - you can move this to a service or database later
const FREE_SAMPLES: FreeSample[] = [
  {
    id: 'sample1',
    name: 'Échantillon Fleur CBD',
    image: '/images/gorilla-glue-small-buds-ivory.webp',
    description: 'Fleur CBD premium',
    value: '7.99€'
  },
  {
    id: 'sample2', 
    name: 'Échantillon Résine CBD', 
    image: '/images/resines/hash-cbd-ketama-gold-ivory.webp',
    description: 'Résine CBD de qualité',
    value: '9.99€'
  }
];

export default function FreeSampleModal({ isOpen, onClose, onSampleSelected }: FreeSampleModalProps) {

  if (!isOpen) return null;

  const handleSampleSelect = (sample: FreeSample) => {
    // Auto-select and confirm like in the design
    onSampleSelected(sample);
    onClose();
  };

  const handleSkip = () => {
    onSampleSelected(null);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.freeSampleModal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className={styles.modalHeader}>
          <h2>Échantillon Offert</h2>
          <p>Choisissez-en un</p>
        </div>

        <div className={styles.samplesGrid}>
          {FREE_SAMPLES.map((sample) => (
            <div
              key={sample.id}
              className={styles.sampleCard}
              onClick={() => handleSampleSelect(sample)}
            >
              <div className={styles.sampleImage}>
                <Image
                  src={sample.image}
                  alt={sample.name}
                  width={200}
                  height={200}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              
              <div className={styles.sampleInfo}>
                <h3>{sample.name}</h3>
              </div>
              
              <button className={styles.selectButton}>
                SÉLECTIONNER
              </button>
            </div>
          ))}
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.skipBtn} onClick={handleSkip}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
} 