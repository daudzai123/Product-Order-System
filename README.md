# Product Order System (MVP)

Simple full-stack app with ADMIN and CUSTOMER roles.
Backend: Spring Boot + Spring Security (JWT) + PostgreSQL.
Frontend: React + React Router + Axios.

## Backend setup

1. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE product_order_db;
   ```
2. Edit `backend/src/main/resources/application.properties` with your DB
   username/password if different from the defaults.
3. From `backend/`, run:
   ```bash
   ./mvnw spring-boot:run
   ```
   (or open the folder in IntelliJ/Eclipse and run `ProductOrderApplication`)
4. API runs on `http://localhost:8080`.

Tables are auto-created by Hibernate (`ddl-auto=update`) — no manual schema
needed for this MVP.

## Frontend setup

1. From `frontend/`, run:
   ```bash
   npm install
   npm start
   ```
2. App runs on `http://localhost:3000`.

## Trying it out

1. Register a user with role "ADMIN" (dropdown on the register page — this
   open self-registration is for dev/testing only; lock it down before any
   real deployment).
2. Log in as that admin, add a few products under "Manage Products".
3. Register a second user with role "CUSTOMER".
4. Log in as the customer, browse the shop, set quantities, place an order.
5. Log back in as admin → "All Orders" to see it and update its status.

## API summary

| Method | Endpoint                    | Access          |
|--------|------------------------------|-----------------|
| POST   | /api/auth/register           | Public          |
| POST   | /api/auth/login               | Public          |
| GET    | /api/products                 | Public          |
| POST   | /api/products                 | ADMIN           |
| PUT    | /api/products/{id}            | ADMIN           |
| DELETE | /api/products/{id}            | ADMIN           |
| POST   | /api/orders                   | CUSTOMER        |
| GET    | /api/orders/my                | CUSTOMER (own)  |
| GET    | /api/orders                   | ADMIN (all)     |
| PUT    | /api/orders/{id}/status       | ADMIN           |

## Next steps (once this is working)

- Move the JWT secret and DB credentials to environment variables
- Remove/protect the "register as ADMIN" option before deploying
- Add product categories, cart persistence, pagination
- Add a payment gateway integration
