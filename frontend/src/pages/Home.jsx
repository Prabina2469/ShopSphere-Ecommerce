import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="hero">
      <h1>Welcome to ShopSphere</h1>
      <p>A distributed e-commerce platform — browse the catalog, sign up, and check out.</p>
      <Link to="/products" className="cta-large">Browse products</Link>
    </div>
  );
}
