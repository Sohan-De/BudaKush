'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';

interface FreeSample {
  id: string;
  name: string;
  image: string;
  description: string;
  value: string;
}

export const useFreeSampleModal = () => {
  const [showSampleModal, setShowSampleModal] = useState(false);
  const { addFreeSample, hasFreeSample } = useCart();

  const triggerSampleModal = () => {
    // Only show modal if customer doesn't already have a sample
    if (!hasFreeSample()) {
      setTimeout(() => {
        setShowSampleModal(true);
      }, 500);
    }
  };

  const handleSampleSelection = (sample: FreeSample | null) => {
    if (sample) {
      addFreeSample({
        id: sample.id,
        name: sample.name,
        image: sample.image,
        description: sample.description,
        price: 0,
        variant: undefined,
        weight: undefined
      });
    }
    setShowSampleModal(false);
  };

  const closeSampleModal = () => {
    setShowSampleModal(false);
  };

  return {
    showSampleModal,
    triggerSampleModal,
    handleSampleSelection,
    closeSampleModal
  };
}; 