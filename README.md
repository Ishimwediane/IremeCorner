# IremeCorner Backend API

Backend for the IremeCorner marketplace: authentic Rwandan handmade crafts. It serves the product catalogue, guest checkout (confirmed with the customer on WhatsApp), the contact form and the admin dashboard.

The website lives in a separate repository: [iremeCorner-website](https://github.com/Ishimwediane/iremeCorner-website).

## Tech stack

- Node.js 20+ (native ES modules, no build step)
- Express
- MongoDB with Mongoose
- JWT authentication
- Multer for product photo uploads

## Project structure

```
src/
├── config/        # Environment config and MongoDB connection
├── controllers/   # Request handlers
├── entities/      # Mongoose models (User, Category, Product, Order, ContactMessage)
├── middleware/    # Auth, validation, rate limiting, errors
├── routes/        # API routes
├── scripts/       # One-off scripts (create admin, seed categories)
├── services/      # Business logic
└── utils/         # Startup bootstrap and helpers
```

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `env.example` to `.env` and fill it in. For a local database:
   ```bash
   docker run -d --name iremecorner-mongo -p 27017:27017 mongo:7
   ```
   and set `MONGODB_URI=mongodb://localhost:27017/iremecorner`.
3. Start the API:
   ```bash
   npm run dev    # restarts on file changes
   npm start      # production
   ```

On every start the server creates any missing default categories (Basket, Wall Arts, Pottery, Others) and, when `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set, the admin account.

Health check: `GET /health`

## Environment variables

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string (local or MongoDB Atlas) |
| `JWT_SECRET`, `JWT_REFRESH_SECRET` | Long random strings used to sign logins |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | The store admin account created on first start |
| `PORT` | Port to listen on (hosts like Render set this automatically) |
| `NODE_ENV` | `development` or `production` |
| `UPLOAD_PATH`, `MAX_FILE_SIZE` | Where product photos are stored and the size limit |

Never commit `.env`; it is ignored by git.

## API overview

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Sign in |
| POST | `/api/auth/register` | Admin | Create an account (there is no public sign-up) |
| GET/PUT | `/api/auth/profile` | Signed in | View or update your profile |
| GET | `/api/categories` | Public | Product categories |
| GET | `/api/products` | Public | Products in the shop (`search`, `categoryId`, `minPrice`, `maxPrice`, `page`, `limit`) |
| GET | `/api/products/:id` | Public | Product detail |
| GET | `/api/products/manage` | Admin | All products, any status |
| POST | `/api/products` | Admin/artisan | Create a product (multipart, photos in `productImages`) |
| PUT/DELETE | `/api/products/:id` | Owner/admin | Update or remove a product |
| POST | `/api/orders` | Public | Guest checkout |
| GET | `/api/orders`, `/api/orders/:id`, `/api/orders/statistics` | Admin | Orders and statistics |
| PUT | `/api/orders/:id/status`, `/api/orders/:id/payment-status` | Admin | Update an order |
| POST | `/api/contact` | Public | Contact form (rate limited) |
| GET/PATCH/DELETE | `/api/contact`, `/api/contact/:id` | Admin | Manage contact messages |
| GET | `/api/admin/dashboard` | Admin | Dashboard counts |

## Deploying to Render

- Build command: `npm install`
- Start command: `npm start`
- Environment: set the variables above, with `MONGODB_URI` pointing to MongoDB Atlas.

Product photos are stored on the server's disk; on hosts with temporary disks (such as Render's free plan) they are lost on each redeploy.
