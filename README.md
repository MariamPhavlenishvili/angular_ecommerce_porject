# Angular E-Commerce App

Product browsing, cart management, and admin CRUD — built with Angular 20 and FakeStore API.

## Demo

> Deploy to Netlify/Vercel and add link here

## Stack

Angular 20 · TypeScript · CSS · Angular Router · RxJS

## Features

- Browse products by category with ratings
- Product detail pages
- Add to cart / manage basket
- Admin panel: create and edit products

## Routes

| Path | View |
|---|---|
| `/` | Homepage — product listing |
| `/product/:id` | Product detail |
| `/cart` | Basket |
| `/admin/create-product` | Admin: add product |
| `/admin/edit-product/:id` | Admin: edit product |

## Run locally

```bash
npm install
ng serve
```

Open http://localhost:4200

## Data

Products fetched from [FakeStore API](https://fakestoreapi.com) — `Product` model: `id · title · price · description · category · image · rating { rate, count }`.
