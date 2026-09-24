# ShopSphere — Architecture

## Current state

```
                    React Frontend :3000 (Vite + React Router)
                                  |
                                  v
                         API Gateway :8080
                     (routes + JWT validation)
                                  |
                 +----------------+----------------+
                 |                                 |
                 v                                 v
          Auth Service :8081               Product Service :8082
          (JWT, BCrypt, RBAC)          (catalog CRUD, Redis cache-aside)
                 |                                 |
                 v                                 v
           MySQL: auth_db                   MySQL: product_db
                                                    |
                                                    v
                                                  Redis
```

Both services register with **Eureka** (`discovery-server`, :8761) and pull
shared + service-specific configuration from **Config Server** (:8888),
which serves an embedded `config-repo` in native mode (no external Git
dependency needed to run locally).

## Planned expansion

- **user-service** — profile & address management, separate from auth
- **cart-service** — Redis-backed cart with selective persistence
- **inventory-service** — reserve/release stock with transactional
  concurrency control
- **order-service** — orchestrates the checkout Saga
- **payment-service** — simulated payment gateway
- **notification-service** — Kafka consumer, logs/simulates emails
- **Kafka** — `order-created`, `inventory-reserved`, `payment-completed`,
  etc., decoupling the above services
- **Saga + transactional outbox** — consistency across services without a
  distributed transaction
- **Idempotency keys** — safe request retries on `POST /orders`
- **Observability** — Micrometer + Prometheus + Grafana, correlation IDs
  propagated gateway → services → Kafka
- **CI/CD** — GitHub Actions build/test/package/dockerize pipeline
- **AWS** — EC2 + RDS + ElastiCache + ECR deployment
