# ShopSphere — Requirements

## Functional Requirements

### Customer
- Register, login, refresh session, logout
- Browse and search the product catalog (pagination, sorting, filtering)
- View product details
- Add to cart, update cart, checkout *(planned — cart-service)*
- Make payment *(planned — payment-service)*
- View, cancel, track orders *(planned — order-service)*
- Write product reviews *(entity in place, endpoints planned)*

### Admin
- Create, update, delete products ✅
- Manage inventory *(planned — inventory-service)*
- View and update orders *(planned — order-service)*
- Manage users *(planned — user-service)*

### System
- Authentication & authorization (JWT, RBAC) ✅
- Caching (Redis, cache-aside on product reads) ✅
- Inventory consistency *(planned)*
- Event-driven communication *(planned — Kafka)*
- Centralized configuration ✅
- Service discovery ✅
- Consistent error handling ✅ (per-service `@RestControllerAdvice`)
- Input validation ✅ (Bean Validation on all write endpoints)
- Observability *(planned — Actuator is wired, Prometheus/Grafana pending)*

## Non-Functional Requirements
- Each service independently deployable and independently scalable
- No service reaches into another service's database directly
- Stateless services behind the gateway (horizontal scaling — no sticky sessions)
- Passwords never stored or logged in plain text
