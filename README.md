# Toxic Backend (NestJS)

## Quick start
```bash
npm i -g @nestjs/cli
npm i
cp .env.example .env
npm run start:dev
```
Endpoints:
- GET/POST/PATCH/DELETE `/products`
- POST `/orders` (items: [{productId, qty, price}])
- POST `/orders/:id/confirm`
```
