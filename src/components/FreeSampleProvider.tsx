'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useCart } from '@/contexts/CartContext';
import FreeSampleModal from '../app/components/FreeSampleModal';

interface FreeSample {
  id: string;
  name: string;
  image: string;
  description: string;
  value: string;
}

interface FreeSampleContextType {
  triggerSampleModal: () => void;
}

const FreeSampleContext = createContext<FreeSampleContextType | undefined>(undefined);

export function FreeSampleProvider({ children }: { children: ReactNode }) {
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

  const value = {
    triggerSampleModal
  };

  return (
    <FreeSampleContext.Provider value={value}>
      {children}
      <FreeSampleModal
        isOpen={showSampleModal}
        onClose={closeSampleModal}
        onSampleSelected={handleSampleSelection}
      />
    </FreeSampleContext.Provider>
  );
}

export function useFreeSampleModal() {
  const context = useContext(FreeSampleContext);
  if (context === undefined) {
    throw new Error('useFreeSampleModal must be used within a FreeSampleProvider');
  }
  return context;
} 