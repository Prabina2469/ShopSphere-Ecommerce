import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { api } from "../api/client";

const PAGE_SIZE = 12;

export default function Products() {
  const [data, setData] = useState({ content: [], totalPages: 0, page: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sortField: "id",
    sortDir: "asc",
  });
  const [page, setPage] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    api
      .listProducts({ ...filters, page, size: PAGE_SIZE })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load products");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters, page]);

  function updateFilter(key, value) {
    setPage(0);
    setFilters((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="products-page">
      <h2>Products</h2>

      <div className="filters">
        <input
          placeholder="Search…"
          value={filters.keyword}
          onChange={(e) => updateFilter("keyword", e.target.value)}
        />
        <input
          placeholder="Category"
          value={filters.category}
          onChange={(e) => updateFilter("category", e.target.value)}
        />
        <input
          type="number"
          placeholder="Min price"
          value={filters.minPrice}
          onChange={(e) => updateFilter("minPrice", e.target.value)}
        />
        <input
          type="number"
          placeholder="Max price"
          value={filters.maxPrice}
          onChange={(e) => updateFilter("maxPrice", e.target.value)}
        />
        <select
          value={`${filters.sortField},${filters.sortDir}`}
          onChange={(e) => {
            const [sortField, sortDir] = e.target.value.split(",");
            setPage(0);
            setFilters((f) => ({ ...f, sortField, sortDir }));
          }}
        >
          <option value="id,asc">Newest first (default)</option>
          <option value="price,asc">Price: low to high</option>
          <option value="price,desc">Price: high to low</option>
          <option value="name,asc">Name: A–Z</option>
        </select>
      </div>

      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p className="page-loading">Loading products…</p>
      ) : data.content.length === 0 ? (
        <p className="muted">No products match your filters.</p>
      ) : (
        <>
          <div className="product-grid">
            {data.content.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="pagination">
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              ← Prev
            </button>
            <span>
              Page {data.page + 1} of {Math.max(data.totalPages, 1)}
            </span>
            <button disabled={data.last} onClick={() => setPage((p) => p + 1)}>
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
