# ShopSphere — Database Design

Each service owns its own schema — no cross-service joins, no shared tables.

## auth_db (auth-service)

**users**
| column | type | notes |
|---|---|---|
| id | BIGINT PK | auto increment |
| name | VARCHAR | |
| email | VARCHAR | unique |
| password | VARCHAR | BCrypt hash |
| role | ENUM | CUSTOMER, ADMIN |
| status | ENUM | ACTIVE, DISABLED |
| created_at / updated_at | DATETIME | |

## product_db (product-service)

**categories** — id, name (unique), description

**products**
| column | type | notes |
|---|---|---|
| id | BIGINT PK | |
| name, description | | |
| price | DECIMAL(12,2) | |
| category_id | BIGINT FK | -> categories.id |
| sku | VARCHAR | unique, indexed |
| status | ENUM | ACTIVE, INACTIVE, OUT_OF_STOCK |
| created_at / updated_at | DATETIME | |

**product_images** — id, product_id (FK), url, primary (bool)

**reviews** — id, product_id (FK), user_id, rating (1-5), comment, created_at

> `user_id` on `reviews` is a soft reference to `auth_db.users.id` — by
> design, no foreign key across databases. Services reconcile this at the
> application layer, exactly the trade-off you'd discuss when explaining
> "database per service" in an interview.

## Planned schemas
`inventory_db`, `cart` (Redis, selectively persisted), `order_db`
(orders + `outbox_events` for the transactional outbox pattern),
`payment_db`.
