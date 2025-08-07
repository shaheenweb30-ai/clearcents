import React, { createContext, useContext, ReactNode } from 'react';
import { useProductTour } from '@/hooks/useProductTour';

const ProductTourContext = createContext<ReturnType<typeof useProductTour> | null>(null);

export function ProductTourProvider({ children }: { children: ReactNode }) {
  const tourState = useProductTour();
  
  return (
    <ProductTourContext.Provider value={tourState}>
      {children}
    </ProductTourContext.Provider>
  );
}

export function useProductTourContext() {
  const context = useContext(ProductTourContext);
  if (!context) {
    throw new Error('useProductTourContext must be used within a ProductTourProvider');
  }
  return context;
} 