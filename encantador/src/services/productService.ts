import type { Category, Product, ProductFormData } from '../types';
import { apiRequest } from './api';

interface BackendCategory {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

interface BackendProduct {
  id: number;
  categoryId: number;
  category: BackendCategory;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  artist: string;
  featured: boolean;
  isPreorder: boolean;
  estimatedDelivery: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProduct extends Product {
  categoryId: number;
  categoryName: string;
  isActive: boolean;
}

export interface CategoryOption {
  id: number;
  name: string;
  slug: Category;
}

function normalizeCategory(categoryName: string): Category {
  const value = categoryName.toLowerCase();

  if (value.includes('álbum') || value.includes('album')) return 'albumes';
  if (value.includes('ropa')) return 'ropa';
  if (value.includes('accesorio')) return 'accesorios';
  if (value.includes('light')) return 'lightsticks';
  if (value.includes('poster')) return 'posters';
  if (value.includes('papeler')) return 'papeleria';
  if (value.includes('pedido')) return 'pedidos-especiales';

  return 'accesorios';
}

function mapBackendProduct(product: BackendProduct): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: normalizeCategory(product.category?.name ?? ''),
    image: product.imageUrl || '/images/img1.jpg',
    stock: product.stock,
    featured: product.featured,
    artist: product.artist,
    isPreorder: product.isPreorder,
    estimatedDelivery: product.estimatedDelivery,
  };
}

function mapBackendProductToAdmin(product: BackendProduct): AdminProduct {
  return {
    ...mapBackendProduct(product),
    categoryId: product.categoryId,
    categoryName: product.category?.name ?? 'Sin categoría',
    isActive: product.isActive,
  };
}

function mapCategoryOption(category: BackendCategory): CategoryOption {
  return {
    id: category.id,
    name: category.name,
    slug: normalizeCategory(category.name),
  };
}

async function getCategoryIdBySlug(categorySlug: Category) {
  const categories = await getCategoriesFromBackend();

  const selectedCategory = categories.find(
    (category) => category.slug === categorySlug,
  );

  if (!selectedCategory) {
    throw new Error('No existe una categoría válida para este producto.');
  }

  return selectedCategory.id;
}

function toBackendProductPayload(form: ProductFormData, categoryId: number) {
  return {
    categoryId,
    name: form.name,
    description: form.description,
    price: Number(form.price),
    imageUrl: form.image,
    stock: Number(form.stock),
    artist: form.artist,
    featured: form.featured,
    isPreorder: form.isPreorder,
    estimatedDelivery: form.isPreorder ? form.estimatedDelivery : '',
  };
}

export async function getCategoriesFromBackend() {
  const categories = await apiRequest<BackendCategory[]>('/categories');
  return categories.map(mapCategoryOption);
}

export async function getProductsFromBackend() {
  const products = await apiRequest<BackendProduct[]>('/products');
  return products.map(mapBackendProduct);
}

export async function getProductByIdFromBackend(id: number) {
  const product = await apiRequest<BackendProduct>(`/products/${id}`);
  return mapBackendProduct(product);
}

export async function getAdminProductsFromBackend() {
  const products = await apiRequest<BackendProduct[]>('/products/admin');
  return products.map(mapBackendProductToAdmin);
}

export async function createProductInBackend(form: ProductFormData) {
  const categoryId = await getCategoryIdBySlug(form.category);
  const payload = toBackendProductPayload(form, categoryId);

  const product = await apiRequest<BackendProduct>('/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return mapBackendProductToAdmin(product);
}

export async function updateProductInBackend(
  id: number,
  form: ProductFormData,
) {
  const categoryId = await getCategoryIdBySlug(form.category);
  const payload = toBackendProductPayload(form, categoryId);

  const product = await apiRequest<BackendProduct>(`/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  return mapBackendProductToAdmin(product);
}

export async function logicalDeleteProductInBackend(id: number) {
  const product = await apiRequest<BackendProduct>(`/products/${id}/delete`, {
    method: 'PATCH',
  });

  return mapBackendProductToAdmin(product);
}

export async function reactivateProductInBackend(id: number) {
  const product = await apiRequest<BackendProduct>(`/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      isActive: true,
    }),
  });

  return mapBackendProductToAdmin(product);
}