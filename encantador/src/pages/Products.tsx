import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import type { Category, Product } from '../types';
import { getProductsFromBackend } from '../services/productService';

type CategoryFilter = 'todas' | Category;

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('todas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError('');

        const response = await getProductsFromBackend();
        setProducts(response);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudieron cargar los productos.',
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const categories = useMemo(
    () => ['todas', ...new Set(products.map((product) => product.category))] as CategoryFilter[],
    [products],
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.artist.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = category === 'todas' || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  if (loading) {
    return (
      <section className="empty-state">
        <h1>Cargando productos...</h1>
        <p className="muted">Estamos consultando el catálogo desde el backend.</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="empty-state">
        <h1>No se pudieron cargar los productos</h1>
        <p className="error-text">{error}</p>
        <p className="muted">Verifica que el backend esté encendido.</p>
      </section>
    );
  }

  return (
    <section>
      <div className="section-header">
        <h1>Catálogo de productos</h1>
        <span className="muted">{filteredProducts.length} resultado(s)</span>
      </div>

      <div className="filters">
        <input
          className="input"
          type="text"
          placeholder="Buscar por producto o artista"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          className="input"
          value={category}
          onChange={(event) => setCategory(event.target.value as CategoryFilter)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <p>No hay productos disponibles con ese filtro.</p>
        </div>
      ) : (
        <div className="grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}