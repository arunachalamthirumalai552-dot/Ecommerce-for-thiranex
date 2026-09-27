# 🛍️ E-Commerce Web Application

A full-stack e-commerce platform with product management, shopping cart, checkout, and order tracking.

## ✨ Features

### User Features
- ✅ **User Registration & Login** - Secure authentication with JWT tokens
- ✅ **Product Browsing** - View all products with details (price, stock, description)
- ✅ **Shopping Cart** - Add/remove products, dynamic pricing calculation
- ✅ **Checkout** - Place orders with shipping address
- ✅ **Order Tracking** - View personal orders and their status

### Admin Features
- ✅ **Product Management** - Add, edit, and delete products
- ✅ **Inventory Control** - Track and manage product stock
- ✅ **Order Management** - View and update order status
- ✅ **Role-Based Access Control** - Admin-only features protected

## 📋 Project Structure

```
ecommerce-app/
├── server.js           # Express server + API routes + MongoDB schemas
├── App.jsx            # React frontend (all pages & components)
├── App.css            # Styling for entire application
├── package.json       # Dependencies
├── .env.example       # Environment variables template
└── README.md          # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone/Download the project**
   ```bash
   cd ecommerce-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your MongoDB URI and JWT secret:
   ```
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_secret_key_here
   PORT=5000
   ```

4. **Start MongoDB** (if using local)
   ```bash
   mongod
   ```

5. **Start the backend server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```
   Server runs on `http://localhost:5000`

6. **Start the frontend** (in another terminal)
   ```bash
   npm run client
   ```
   Frontend runs on `http://localhost:3000`

## 🔑 Default Test Accounts

### Admin Account
- Email: `admin@example.com`
- Password: `admin123`

### Regular User
- Email: `user@example.com`
- Password: `user123`

*First, register a new account, then you can test login functionality*

## 📚 API Endpoints

### Authentication
```
POST   /api/register        - Register new user
POST   /api/login           - Login user
```

### Products
```
GET    /api/products        - Get all products
POST   /api/products        - Add product (Admin only)
PUT    /api/products/:id    - Update product (Admin only)
DELETE /api/products/:id    - Delete product (Admin only)
```

### Orders
```
POST   /api/orders          - Create order (requires auth)
GET    /api/orders          - Get user orders (admin sees all)
PUT    /api/orders/:id/status - Update order status (Admin only)
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **CSS3** - Styling

## 📖 Usage Guide

### For Regular Users

1. **Register/Login**
   - Create new account or login with existing credentials
   - Token automatically stored in localStorage

2. **Browse Products**
   - View all products on home page
   - See price and stock information
   - Can't add out-of-stock items

3. **Shopping Cart**
   - Click "Add to Cart" on any product
   - View cart contents with total price
   - Remove items as needed

4. **Checkout**
   - Enter shipping address
   - Click "Proceed to Checkout"
   - Order is placed and stock is automatically updated

5. **Track Orders**
   - View all personal orders
   - See order status: pending, completed, or cancelled
   - Check order date and items

### For Admin Users

1. **Admin Dashboard**
   - Click "Admin" in navbar (admin users only)
   - Two sections: Add Product & Manage Products

2. **Add Products**
   - Fill in product details (name, price, stock, description, category)
   - Submit to add to catalog
   - Immediately available for users

3. **Manage Products**
   - View all products
   - Delete products from catalog
   - Edit functionality can be added

4. **View All Orders**
   - Access orders from navbar
   - See all orders from all users
   - Update order status (pending → completed → cancelled)

## 🔐 Security Features

- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ JWT token authentication (7-day expiration)
- ✅ Role-based access control (user/admin)
- ✅ Protected routes and API endpoints
- ✅ CORS enabled for frontend-backend communication

## 🎨 UI/UX Features

- ✅ Responsive design (desktop & mobile)
- ✅ Gradient navbar with smooth navigation
- ✅ Product cards with hover effects
- ✅ Real-time cart updates
- ✅ Form validation
- ✅ Loading states and animations
- ✅ Status badges for orders

## 📱 Responsive Design

- Desktop: 3-4 products per row
- Tablet: 2 products per row
- Mobile: 1 product per row
- All forms are mobile-optimized

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution:** 
- Make sure MongoDB is running: `mongod`
- Or update MONGODB_URI in .env with Atlas connection string

### CORS Error
```
Cross-Origin Request Blocked
```
**Solution:** Make sure both ports are running:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill process using that port or change PORT in .env

## 🚀 Production Deployment

1. Set `NODE_ENV=production` in .env
2. Change `JWT_SECRET` to strong random string
3. Use MongoDB Atlas for database
4. Build frontend: `npm run build`
5. Deploy to platforms like Heroku, AWS, DigitalOcean, etc.

## 📝 File Details

### server.js (354 lines)
- Express server setup with CORS
- MongoDB connection and schemas (User, Product, Order)
- Authentication middleware (JWT verification)
- Authorization middleware (Role checking)
- All API routes with business logic

### App.jsx (420 lines)
- React component with all pages
- State management with hooks
- API integration with backend
- Pages: Home, Login, Register, Cart, Orders, Admin

### App.css (450 lines)
- Gradient designs and modern UI
- Responsive grid layouts
- Smooth animations and transitions
- Mobile-first responsive design

## 📊 Database Schema

### User Collection
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: String ('user' or 'admin'),
  createdAt: Date
}
```

### Product Collection
```javascript
{
  name: String,
  description: String,
  price: Number,
  stock: Number,
  category: String,
  createdAt: Date
}
```

### Order Collection
```javascript
{
  userId: ObjectId (ref User),
  items: [{
    productId: ObjectId,
    productName: String,
    quantity: Number,
    price: Number
  }],
  totalPrice: Number,
  status: String ('pending', 'completed', 'cancelled'),
  shippingAddress: String,
  createdAt: Date
}
```

## 🎯 Future Enhancements

- [ ] Product search and filters
- [ ] Product ratings and reviews
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Wishlist feature
- [ ] Promo codes and discounts
- [ ] Product images
- [ ] User profile management
- [ ] Admin analytics dashboard
- [ ] Inventory notifications

## 📄 License

MIT License - Feel free to use this project!

## 💬 Support

For issues or questions, please check the troubleshooting section above.

---

**Made with ❤️ | Happy Coding! 🚀**
