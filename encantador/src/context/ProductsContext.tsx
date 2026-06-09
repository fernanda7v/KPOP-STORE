import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { initialProducts } from '../data/products';
import type { Product, ProductFormData } from '../types';

interface ProductsContextType {
  products: Product[];
  createProduct: (data: ProductFormData) => void;
  updateProduct: (id: number, data: ProductFormData) => void;
  deleteProduct: (id: number) => void;
  resetProducts: () => void;
}

const PRODUCTS_STORAGE_KEY = 'kpop-store-products';

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

function getStoredProducts(): Product[] {
  const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialProducts));
    return initialProducts;
  }

  return JSON.parse(stored) as Product[];
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());

  useEffect(() => {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const createProduct = (data: ProductFormData) => {
    const newProduct: Product = {
      id: Date.now(),
      ...data,
    };

    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: number, data: ProductFormData) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              ...data,
            }
          : product
      )
    );
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const resetProducts = () => {
    setProducts(initialProducts);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialProducts));
  };

  const value = useMemo(
    () => ({
      products,
      createProduct,
      updateProduct,
      deleteProduct,
      resetProducts,
    }),
    [products]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error('useProducts debe usarse dentro de ProductsProvider');
  }

  return context;
}