import React, { createContext, useContext, useState } from 'react';
import type { Product } from '@shared/schema';

interface ProductContextType {
  selectedProduct: Product | null;
  isProductModalOpen: boolean;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(false);
  };

  return (
    <ProductContext.Provider
      value={{
        selectedProduct,
        isProductModalOpen,
        openProductModal,
        closeProductModal,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}
