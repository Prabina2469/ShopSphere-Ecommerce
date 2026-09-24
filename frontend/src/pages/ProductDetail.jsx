import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getProduct(id)
      .then((res) => {
        if (!cancelled) setProduct(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Product not found");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <p className="page-loading">Loading…</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!product) return null;

  return (
    <div className="product-detail">
      <Link to="/products" className="back-link">← Back to products</Link>
      <div className="product-detail-grid">
        <div className="product-detail-image-placeholder">
          {product.imageUrls?.[0] ? (
            <img src={product.imageUrls[0]} alt={product.name} />
          ) : (
            <span>{product.name.charAt(0)}</span>
          )}
        </div>
        <div>
          <h1>{product.name}</h1>
          {product.categoryName && <p className="muted">{product.categoryName}</p>}
          <p className="price-large">₹{Number(product.price).toLocaleString("en-IN")}</p>
          <p>{product.description || "No description provided."}</p>
          <p className="muted">SKU: {product.sku}</p>
          <p className="muted">Status: {product.status}</p>
          {/* Add-to-cart wires up once cart-service exists */}
          <button disabled title="Coming soon — cart-service is not built yet">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
