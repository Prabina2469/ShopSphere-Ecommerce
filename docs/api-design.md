# ShopSphere — API Design

All client traffic goes through the gateway at `http://localhost:8080`.

## Auth Service — `/api/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | public | Create a CUSTOMER account |
| POST | `/api/auth/login` | public | Exchange credentials for tokens |
| POST | `/api/auth/refresh` | public | Exchange a refresh token for a new pair |
| POST | `/api/auth/logout` | public | Client-side token discard |

**Register/Login response:**
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "tokenType": "Bearer",
  "userId": 1,
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "role": "CUSTOMER"
}
```

## Product Service — `/api/products`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | public | Paginated, sortable, filterable catalog |
| GET | `/api/products/{id}` | public | Single product (Redis cache-aside) |
| GET | `/api/products/search?q=` | public | Keyword search |
| POST | `/api/products` | token required | Create a product |
| PUT | `/api/products/{id}` | token required | Update a product |
| DELETE | `/api/products/{id}` | token required | Delete a product |

Query params on `GET /api/products`: `page`, `size`, `sortField`, `sortDir`,
`category`, `minPrice`, `maxPrice`, `keyword`.

## Error shape (all services)

```json
{
  "timestamp": "2026-09-23T10:30:00",
  "status": 404,
  "error": "PRODUCT_NOT_FOUND",
  "message": "Product with id 101 was not found",
  "path": "/api/products/101",
  "fieldErrors": null
}
```
