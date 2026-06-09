import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import AdminMenu from '../components/AdminMenu';
import type { Category, ProductFormData } from '../types';
import { formatCurrency } from '../utils/currency';

import {
  createProductInBackend,
  getAdminProductsFromBackend,
  getCategoriesFromBackend,
  logicalDeleteProductInBackend,
  reactivateProductInBackend,
  updateProductInBackend,
} from '../services/productService';

import type {
  AdminProduct,
  CategoryOption,
} from '../services/productService';

const emptyForm: ProductFormData = {
  name: '',
  description: '',
  price: 0,
  category: 'albumes',
  image: '',
  stock: 0,
  featured: false,
  artist: '',
  isPreorder: false,
  estimatedDelivery: '',
};

export default function AdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [productsResponse, categoriesResponse] = await Promise.all([
        getAdminProductsFromBackend(),
        getCategoriesFromBackend(),
      ]);

      setProducts(productsResponse);
      setCategories(categoriesResponse);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar los datos.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const text = `${product.name} ${product.artist} ${product.categoryName}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [products, search]);

  const handleChange = <K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEdit = (product: AdminProduct) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock,
      featured: product.featured,
      artist: product.artist,
      isPreorder: product.isPreorder,
      estimatedDelivery: product.estimatedDelivery ?? '',
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setMessage('');
      setError('');

      const cleanData: ProductFormData = {
        ...form,
        estimatedDelivery: form.isPreorder ? form.estimatedDelivery : '',
      };

      if (editingId !== null) {
        await updateProductInBackend(editingId, cleanData);
        setMessage('Producto actualizado correctamente.');
      } else {
        await createProductInBackend(cleanData);
        setMessage('Producto creado correctamente.');
      }

      handleCancelEdit();
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo guardar el producto.',
      );
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      '¿Seguro que deseas desactivar este producto?',
    );

    if (!confirmDelete) return;

    try {
      setMessage('');
      setError('');

      await logicalDeleteProductInBackend(id);
      setMessage('Producto desactivado correctamente.');
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo desactivar el producto.',
      );
    }
  };

  const handleReactivate = async (id: number) => {
    try {
      setMessage('');
      setError('');

      await reactivateProductInBackend(id);
      setMessage('Producto reactivado correctamente.');
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo reactivar el producto.',
      );
    }
  };

  if (loading) {
    return (
      <section className="empty-state">
        <h1>Cargando productos...</h1>
        <p className="muted">Consultando productos desde el backend.</p>
      </section>
    );
  }

  return (
    <section>
      <div className="section-header">
        <div>
          <h1>Administración de productos</h1>
          <p className="muted">
            Crea, edita, desactiva o reactiva productos desde PostgreSQL.
          </p>
        </div>
      </div>

      <AdminMenu />

      {message && <p className="success-text">{message}</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="admin-layout">
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Editar producto' : 'Nuevo producto'}</h2>

          <label>
            Nombre
            <input
              className="input"
              type="text"
              required
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </label>

          <label>
            Descripción
            <textarea
              className="input textarea"
              required
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </label>

          <label>
            Precio
            <input
              className="input"
              type="number"
              min={0}
              required
              value={form.price}
              onChange={(e) => handleChange('price', Number(e.target.value))}
            />
          </label>

          <label>
            Categoría
            <select
              className="input"
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value as Category)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Imagen URL
            <input
              className="input"
              type="text"
              required
              placeholder="/images/img1.jpg"
              value={form.image}
              onChange={(e) => handleChange('image', e.target.value)}
            />
          </label>

          <label>
            Artista / grupo
            <input
              className="input"
              type="text"
              required
              value={form.artist}
              onChange={(e) => handleChange('artist', e.target.value)}
            />
          </label>

          <label>
            Stock
            <input
              className="input"
              type="number"
              min={0}
              required
              value={form.stock}
              onChange={(e) => handleChange('stock', Number(e.target.value))}
            />
          </label>

          <label className="check-row">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => handleChange('featured', e.target.checked)}
            />
            Producto destacado
          </label>

          <label className="check-row">
            <input
              type="checkbox"
              checked={form.isPreorder}
              onChange={(e) => handleChange('isPreorder', e.target.checked)}
            />
            Es preventa / pedido especial
          </label>

          {form.isPreorder && (
            <label>
              Tiempo estimado de entrega
              <input
                className="input"
                type="text"
                value={form.estimatedDelivery}
                onChange={(e) => handleChange('estimatedDelivery', e.target.value)}
                placeholder="Ej: 20 a 30 días"
              />
            </label>
          )}

          <div className="card-actions">
            <button className="btn btn-primary" type="submit">
              {editingId ? 'Guardar cambios' : 'Crear producto'}
            </button>

            {editingId && (
              <button
                className="btn btn-outline"
                type="button"
                onClick={handleCancelEdit}
              >
                Cancelar edición
              </button>
            )}

            <button className="btn btn-outline" type="button" onClick={loadData}>
              Recargar productos
            </button>
          </div>
        </form>

        <div className="admin-list-box">
          <div className="section-header">
            <div>
              <h2>Lista de productos</h2>
              <p className="muted">
                Se muestran productos activos e inactivos.
              </p>
            </div>
            <span className="user-chip">{filteredProducts.length}</span>
          </div>

          <input
            className="input"
            type="text"
            placeholder="Buscar producto, artista o categoría"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="admin-product-list">
            {filteredProducts.map((product) => (
              <article key={product.id} className="admin-product-card">
                <img
                  src={product.image}
                  alt={product.name}
                  className="admin-product-image"
                />

                <div className="admin-product-info">
                  <div className="product-top">
                    <span className="tag">{product.artist}</span>
                    <span className={product.isActive ? 'tag' : 'tag preorder'}>
                      {product.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>

                  <h3>{product.name}</h3>
                  <p className="muted">{product.description}</p>
                  <p><strong>Precio:</strong> {formatCurrency(product.price)}</p>
                  <p><strong>Stock:</strong> {product.stock}</p>
                  <p><strong>Categoría:</strong> {product.categoryName}</p>

                  {product.featured && <p className="muted">Producto destacado</p>}
                  {product.isPreorder && product.estimatedDelivery && (
                    <p className="muted">
                      Entrega estimada: {product.estimatedDelivery}
                    </p>
                  )}

                  <div className="card-actions">
                    <button
                      className="btn btn-outline"
                      type="button"
                      onClick={() => handleEdit(product)}
                    >
                      Editar
                    </button>

                    {product.isActive ? (
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => handleDelete(product.id)}
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => handleReactivate(product.id)}
                      >
                        Reactivar
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}