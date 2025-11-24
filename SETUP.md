# High-End Fashion E-Commerce Store Setup

A modern, high-end fashion e-commerce platform with interactive 3D product visualization, smooth animations, and complete shopping functionality.

## Features

### Core E-Commerce
- Product catalog with filtering and categories
- Product detail pages with image galleries
- Shopping cart with persistent state
- Checkout flow with order management
- User authentication and profiles
- Order tracking and history
- Admin dashboard

### Premium UX Features
- Interactive 3D product viewer with rotate/zoom
- Animated hero section with GSAP choreography
- Smooth page transitions with Framer Motion
- Material and color configurator for products
- Micro-interactions throughout
- Responsive design for all devices

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **3D/WebGL**: React Three Fiber + Drei
- **Animations**: GSAP + Framer Motion
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (JSON Web Tokens)

## Quick Start

### 1. Configure MongoDB

Update `.env` with your MongoDB credentials:

```bash
VITE_MONGODB_URI=mongodb://localhost:27017/ecommerce
# OR for MongoDB Atlas:
# VITE_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
VITE_JWT_SECRET=your-secret-key-change-in-production
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Database Setup

The database uses MongoDB with Mongoose schemas:
- **users** - User accounts with authentication
- **categories** - Product categories
- **products** - Product catalog with 3D model support
- **cartitems** - Shopping cart items
- **orders** - Order records
- **orderitems** - Individual order items
- **productreviews** - Customer reviews

Sample data can be seeded manually or through a seeding script.

## User Roles

### Customer
- Browse and search products
- View products in 3D
- Add items to cart
- Checkout and place orders
- View order history

### Admin
- Access admin dashboard
- Manage products
- View all orders
- Manage users

To make a user an admin, update their document in MongoDB:
```javascript
db.users.updateOne(
  { email: 'admin@example.com' },
  { $set: { isAdmin: true } }
);
```

## Project Structure

```
src/
├── components/
│   ├── 3D/              # 3D components (Scene3D, ProductViewer3D)
│   ├── Auth/            # Authentication modals
│   ├── Cart/            # Shopping cart
│   ├── Home/            # Home page components
│   └── Layout/          # Header, Footer
├── pages/
│   ├── HomePage.tsx     # Landing page with hero
│   ├── ShopPage.tsx     # Product catalog
│   ├── ProductPage.tsx  # Product details
│   ├── CheckoutPage.tsx # Checkout flow
│   ├── OrdersPage.tsx   # Order history
│   └── AdminPage.tsx    # Admin dashboard
├── stores/
│   ├── authStore.ts     # Authentication state
│   ├── cartStore.ts     # Shopping cart state
│   └── uiStore.ts       # UI state (modals, etc)
├── models/
│   ├── User.ts           # User schema
│   ├── Category.ts       # Category schema
│   ├── Product.ts        # Product schema
│   ├── CartItem.ts       # Cart item schema
│   ├── Order.ts          # Order schema
│   ├── OrderItem.ts      # Order item schema
│   └── ProductReview.ts  # Review schema
├── lib/
│   ├── mongodb.ts        # MongoDB connection
│   └── api.ts            # API service layer
└── types/
    └── index.ts         # TypeScript types
```

## Performance Optimization

- 3D models use low-poly placeholders (real GLB models can be added)
- Images use Pexels CDN for fast loading
- Lazy loading for route components
- Optimized bundle size with code splitting

## Next Steps

1. **Add Real 3D Models**: Replace placeholder 3D models with actual GLB files
2. **Payment Integration**: Integrate Stripe for real payments
3. **Email Notifications**: Set up order confirmation emails
4. **Product Search**: Implement full-text search
5. **Product Reviews**: Enable customer reviews and ratings
6. **AR Preview**: Add WebXR support for mobile AR try-on
7. **Wishlist**: Add product wishlist functionality
8. **Backend API**: Create Express.js backend for MongoDB operations

## Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

## Support

For issues or questions, check the documentation:
- https://mongoosejs.com/docs/
- https://docs.pmnd.rs/react-three-fiber
- https://www.framer.com/motion/
