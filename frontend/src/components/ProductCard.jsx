import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card-image-placeholder">
        {product.imageUrls?.[0] ? (
          <img src={product.imageUrls[0]} alt={product.name} />
        ) : (
          <span>{product.name.charAt(0)}</span>
        )}
      </div>
      <div className="product-card-body">
        <h3>{product.name}</h3>
        {product.categoryName && <p className="muted">{product.categoryName}</p>}
        <p className="price">₹{Number(product.price).toLocaleString("en-IN")}</p>
      </div>
    </Link>
  );
}
