# ShopSphere

Production-style distributed e-commerce platform built with Java 25, Spring
Boot, Spring Cloud, Kafka, Redis, MySQL and Docker.

## Build status

This repo is being built out in phases. **Working and included in this drop:**

| Service | Port | Status |
|---|---|---|
| `discovery-server` (Eureka) | 8761 | ✅ working |
| `config-server` (native config repo) | 8888 | ✅ working |
| `api-gateway` (Spring Cloud Gateway + JWT filter) | 8080 | ✅ working |
| `auth-service` (register/login/refresh, JWT, BCrypt, RBAC) | 8081 | ✅ working |
| `product-service` (CRUD, pagination, filtering, Redis cache-aside) | 8082 | ✅ working |
| `frontend` (React + Vite: browse, login, register, admin CRUD) | 3000 | ✅ working |

**Not yet built (planned next, per the original roadmap):**
`user-service`, `cart-service`, `inventory-service`, `order-service`,
`payment-service`, `notification-service`, Kafka event backbone, Saga /
compensating transactions, transactional outbox, idempotency keys,
Prometheus/Grafana observability, test suites, CI/CD pipelines, AWS
deployment. The frontend currently has no cart/checkout screens since
those services don't exist yet — the "Add to cart" button is disabled
with a note explaining why.

## Quick start

### Prerequisites
- Java 25
- Maven 3.9+
- Docker + Docker Compose

### Run everything with Docker

```bash
# 1. Build all jars
mvn clean package -DskipTests

# 2. Start the stack
docker compose up -d --build

# 3. Check services registered with Eureka
open http://localhost:8761
```

### Run locally without Docker (for development)

Start in this order, each in its own terminal:

```bash
cd discovery-server && mvn spring-boot:run    # 8761
cd config-server    && mvn spring-boot:run    # 8888
cd api-gateway      && mvn spring-boot:run    # 8080
cd auth-service     && mvn spring-boot:run    # 8081  (needs MySQL on 3306)
cd product-service  && mvn spring-boot:run    # 8082  (needs MySQL + Redis)
```

You'll need MySQL and Redis running locally, or just run
`docker compose up -d mysql redis` and point the services at `localhost`.

### Run the frontend

```bash
cd frontend
npm install
cp .env.example .env   # points at http://localhost:8080 by default
npm run dev             # http://localhost:3000
```

Or it's already included in `docker compose up -d --build` above, served
via nginx on port 3000.

## Trying it out

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"password123"}'

# Create a product (use the accessToken from login/register)
curl -X POST http://localhost:8080/api/products \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","description":"14-inch ultrabook","price":75000,"sku":"LAP-001"}'

# Browse products (public, no token needed)
curl "http://localhost:8080/api/products?page=0&size=10&sortField=price&sortDir=asc"

# Get one product — first call hits MySQL, second call is served from Redis
curl http://localhost:8080/api/products/1
```

## Architecture

```
React Frontend
      |
      v
API Gateway (8080) --- JWT validation on every protected route
      |
      +---> Auth Service (8081)    ---> MySQL (auth_db)
      +---> Product Service (8082) ---> MySQL (product_db) + Redis cache
      |
   [planned] User / Cart / Inventory / Order / Payment / Notification
             services, connected via Kafka for async events and a
             Saga + transactional outbox for distributed consistency.

Config Server (8888) feeds shared + per-service config to every service.
Discovery Server (8761) is the Eureka registry all services register with.
```

## Docs

See `docs/` for the full requirements and design docs, and
`architecture/` for diagrams (to be added as the system grows).
