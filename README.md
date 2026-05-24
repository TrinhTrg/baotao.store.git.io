# E-Commerce Platform

A comprehensive, full-stack e-commerce solution with modern web technologies. Features a responsive frontend built with Next.js and a robust Node.js backend with MongoDB.

## 🎯 Overview

This project implements a complete e-commerce platform supporting:
- **Customers** - Browse, search, and purchase products
- **Sellers** - Manage their shop and product listings
- **Admins** - Complete platform management and moderation

## 🚀 Features

### Customer Features
- 🛍️ Browse products with advanced filtering and search
- 🛒 Shopping cart management with quantity control
- 💳 Secure checkout with Stripe integration
- 👤 User account management and order history
- 🏪 View seller profiles and shop pages
- 📦 Track order status and history
- 🔍 Full-text search functionality

### Seller Features
- 📊 Seller dashboard for analytics
- 📝 Product management (create, edit, delete)
- 📦 Order management
- 💹 Sales tracking and performance metrics

### Admin Features
- 🎛️ Complete admin dashboard
- 📦 Product and category management
- 👥 User and account management
- 🔐 Role-based access control (RBAC)
- ⚙️ Platform settings and configuration
- 📋 Seller verification and management

## 💻 Tech Stack

### Frontend
- **Framework:** Next.js 16.0.4
- **React:** 19.2.0
- **Styling:** Tailwind CSS 4.1.17 + PostCSS
- **UI Components:** Radix UI + Custom Components
- **Icons:** Lucide React
- **Animations:** GSAP 3.14.2
- **State Management:** Context API + Hooks
- **Payment:** Stripe.js

### Backend
- **Runtime:** Node.js 18.x
- **Framework:** Express.js 5.2.1
- **Database:** MongoDB 6.17.0 with Mongoose 8.13.2
- **Authentication:** JWT (Bearer Token)
- **File Upload:** Cloudinary
- **Payment Processing:** Stripe
- **API Documentation:** Swagger/OpenAPI 3.0
- **Session:** Express-session with MongoDB store
- **Email:** Nodemailer
- **Validation:** Express-validator 7.3.1

## 📦 Installation

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- MongoDB Atlas account
- Cloudinary account
- Stripe account

### Quick Start

#### 1. Clone Repository
```bash
git clone https://github.com/TrinhTrg/baotao.store.git
cd baotao.store
```

#### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create environment file
echo 'NEXT_PUBLIC_API_URL=http://localhost:3001/api' > .env.local

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:3000`

#### 3. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cat > .env << 'EOF'
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
JWT_SECRET=your-very-secret-key-min-32-characters
JWT_EXPIRE=7d
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLIC_KEY=pk_test_your_stripe_key
SESSION_SECRET=your-session-secret
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
EOF

# Seed database (optional)
npm run seed

# Start development server
npm run dev
```

Backend API will be available at: `http://localhost:3001`

## 📁 Project Structure

```
e-commerce_platform/
│
├── frontend/                 # Next.js Frontend Application
│   ├── app/                 # App Router (Next.js 13+)
│   │   ├── account/         # User account pages
│   │   ├── cart/            # Shopping cart
│   │   ├── categories/      # Category pages
│   │   ├── checkout/        # Checkout process
│   │   ├── orders/          # Order history
│   │   ├── products/        # Product details
│   │   ├── search/          # Search results
│   │   ├── layout.js        # Root layout
│   │   └── page.js          # Home page
│   ├── components/          # React components
│   │   ├── marketplace/     # Marketplace specific components
│   │   └── ui/              # Reusable UI components
│   ├── lib/                 # Utility functions and constants
│   ├── public/              # Static assets
│   ├── package.json
│   └── next.config.mjs
│
├── backend/                 # Express.js Backend API
│   ├── src/
│   │   ├── api/
│   │   │   └── v1/         # API v1
│   │   │       ├── routes/          # Route definitions
│   │   │       ├── controllers/     # Business logic
│   │   │       ├── middlewares/     # Custom middlewares
│   │   │       ├── validators/      # Input validation
│   │   │       └── models/          # (Optional) Schema definitions
│   │   ├── admin/          # Admin panel routes
│   │   │   ├── routes/
│   │   │   ├── controllers/
│   │   │   ├── middlewares/
│   │   │   └── validators/
│   │   ├── models/         # Mongoose schemas
│   │   │   ├── user.model.js
│   │   │   ├── product.model.js
│   │   │   ├── order.model.js
│   │   │   ├── cart.model.js
│   │   │   ├── role.model.js
│   │   │   └── ...
│   │   ├── shared/         # Shared utilities
│   │   │   ├── logger.js   # Winston logger
│   │   │   ├── cache.js
│   │   │   └── queue.js
│   │   └── utils/          # Helper functions
│   ├── config/             # Configuration files
│   │   ├── database.js     # MongoDB connection
│   │   ├── cors.js         # CORS configuration
│   │   ├── swagger.js      # Swagger documentation
│   │   └── ...
│   ├── seed/               # Database seeding
│   ├── logs/               # Application logs
│   ├── public/             # Public files (static)
│   ├── views/              # EJS/Pug templates (if using MVC)
│   ├── server.js           # Entry point
│   ├── package.json
│   ├── vercel.json         # Vercel deployment config
│   └── .env.example
│
└── README.md
```

## 🌐 API Endpoints

### Public Routes (No Auth Required)

#### Authentication
- `GET /api/v1/user/register` - Registration page
- `POST /api/v1/user/register` - Register new user
- `GET /api/v1/user/login` - Login page
- `POST /api/v1/user/login` - Login user
- `GET /api/v1/user/logout` - Logout user
- `POST /api/v1/user/password/forgot` - Request password reset

#### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:slug` - Get product details
- `GET /api/v1/products/featured` - Get featured products
- `GET /api/v1/products/categories` - Get all categories
- `GET /api/v1/products/category/:slugCategory` - Get products by category

#### Shopping
- `GET /api/v1/shop/:id` - Get shop products

#### Home
- `GET /api/v1/` - Get home page products

#### Search
- `GET /api/v1/search?q=query` - Search products

### Protected Routes (Auth Required)

#### User
- `GET /api/v1/user/info` - Get user info
- `POST /api/v1/user/info` - Update user info
- `POST /api/v1/user/become-seller` - Apply to become seller

#### Cart
- `GET /api/v1/cart` - Get shopping cart
- `POST /api/v1/cart/add/:productId` - Add to cart
- `PATCH /api/v1/cart/update` - Update cart item
- `DELETE /api/v1/cart/delete/:productId` - Remove from cart
- `DELETE /api/v1/cart/clear` - Clear cart

#### Checkout
- `GET /api/v1/checkout` - Checkout page
- `GET /api/v1/checkout/order` - Get orders
- `POST /api/v1/checkout/order` - Create order
- `POST /api/v1/checkout/confirm-payment` - Confirm payment
- `GET /api/v1/checkout/success/:orderId` - Order success
- `GET /api/v1/checkout/boughts` - Get purchased orders

### Admin Routes (Auth + Admin Role Required)

#### Dashboard
- `GET /admin/dashboard` - Dashboard overview

#### Products
- `GET /admin/products` - List products
- `GET /admin/products/create` - Create product form
- `POST /admin/products/create` - Create product
- `GET /admin/products/edit/:id` - Edit product form
- `PATCH /admin/products/edit/:id` - Update product
- `PATCH /admin/products/change-status/:status/:id` - Change status
- `DELETE /admin/products/delete/:id` - Delete product
- `GET /admin/products/detail/:id` - Product details

#### Categories
- `GET /admin/products-category` - List categories
- `GET /admin/products-category/create` - Create category form
- `POST /admin/products-category/create` - Create category
- `GET /admin/products-category/edit/:id` - Edit category form
- `PATCH /admin/products-category/edit/:id` - Update category
- `DELETE /admin/products-category/delete/:id` - Delete category
- `GET /admin/products-category/detail/:id` - Category details

#### Accounts
- `GET /admin/accounts` - List accounts
- `GET /admin/accounts/create` - Create account form
- `POST /admin/accounts/create` - Create account
- `GET /admin/accounts/edit/:id` - Edit account form
- `PATCH /admin/accounts/edit/:id` - Update account
- `DELETE /admin/accounts/delete/:id` - Delete account

#### Roles & Permissions
- `GET /admin/roles` - List roles
- `GET /admin/roles/create` - Create role form
- `POST /admin/roles/create` - Create role
- `GET /admin/roles/edit/:id` - Edit role form
- `PATCH /admin/roles/edit/:id` - Update role
- `DELETE /admin/roles/delete/:id` - Delete role
- `GET /admin/roles/permissions` - List permissions
- `POST /admin/roles/permissions/update` - Update permissions

#### Settings
- `GET /admin/settings/general` - General settings
- `POST /admin/settings/general` - Update settings

#### Seller Products
- `GET /admin/seller/products` - My products
- `GET /admin/seller/products/create` - Create product form
- `POST /admin/seller/products/create` - Create product
- `GET /admin/seller/products/edit/:id` - Edit product form
- `PATCH /admin/seller/products/edit/:id` - Update product
- `PATCH /admin/seller/products/change-status/:id` - Change status
- `DELETE /admin/seller/products/delete/:id` - Delete product

### Health Check
- `GET /health` - Server health status

### Documentation
- `GET /api/v1/docs` - Swagger API documentation (development)

## 📝 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Backend (.env)
```env
# Server
NODE_ENV=development
PORT=3001

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce

# Authentication
JWT_SECRET=your-very-secret-key-minimum-32-characters-long
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLIC_KEY=pk_test_your_key

# Session
SESSION_SECRET=your-session-secret-key

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## 🚀 Deployment

### Deploy on Vercel (Full Stack)

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "Deploy e-commerce platform"
git push origin main
```

#### Step 2: Deploy Frontend
1. Go to [Vercel](https://vercel.com)
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. Set Root Directory to `frontend`
5. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
   ```
6. Deploy

#### Step 3: Deploy Backend
1. Click "Add New" → "Project"
2. Select same repository
3. Set Root Directory to `backend`
4. Set Framework to "Other"
5. Add environment variables (see .env section)
6. Deploy

## 🧪 Development Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Backend
```bash
npm run dev          # Start with nodemon
npm start            # Start production
npm run seed         # Seed database
npm run seed:recover # Reset and re-seed database
npm test             # Run tests
```

## 📊 Database Models

### User
- Email, password (hashed)
- Personal information
- Address
- Role and permissions
- Seller status

### Product
- Title, description, images
- Price, stock
- Category
- Seller information
- Status (active/inactive)

### Order
- Items and quantities
- Shipping address
- Payment status
- Order status
- Timestamps

### Cart
- User ID
- Products and quantities
- Last updated

### Category
- Name, slug
- Thumbnail
- Nested categories (optional)

### Role & Permission
- Role title and description
- Assigned permissions
- User associations

## 🔒 Security Features

- ✅ JWT authentication with Bearer tokens
- ✅ Password hashing with MD5
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Input validation and sanitization
- ✅ Protected admin routes
- ✅ Role-based access control
- ✅ Secure session management

## 🐛 Troubleshooting

### CORS Errors
- Check `ALLOWED_ORIGINS` environment variable
- Ensure frontend URL is whitelisted in backend CORS config

### Database Connection Issues
- Verify MongoDB connection string
- Add your IP to MongoDB Atlas whitelist
- Check network connectivity

### File Upload Errors
- Verify Cloudinary credentials are correct
- Check image format and size limits
- Ensure file upload middlewares are properly configured

### Stripe Integration Issues
- Verify public and secret keys
- Check Stripe webhook configuration
- Test with provided test card numbers

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [Stripe Docs](https://stripe.com/docs)
- [Swagger/OpenAPI](https://swagger.io/)

API documentation available at `/api/v1/docs` when backend runs.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see LICENSE file for details.

## 📧 Support & Contact

For questions or support:
- Create an issue on GitHub
- Email: support@ecommerce.local

---

**Made with ❤️ by IMPOVERISHED Team**

Last Updated: May 24, 2026
