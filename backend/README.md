# Breakfast4U Backend API

A comprehensive Node.js backend for the Breakfast4U MERN stack application, providing REST APIs for breakfast/snack ordering platform.

## 🚀 Features

### Authentication & User Management
- User registration and login with JWT authentication
- Password hashing with bcrypt
- Role-based access control (User, Owner, Admin)
- User profile management
- Favorite meals functionality

### Meals/Menu Management
- CRUD operations for meals/snacks
- Category and time-based filtering
- Search functionality
- Rating and review system
- Admin/Owner meal management

### Store Management
- Store registration and management
- Location-based search
- Operating hours management
- Store ratings and reviews
- Area-wise filtering

### Order Management
- Complete order lifecycle management
- Order status tracking (Pending → Preparing → Ready → Delivered)
- Order history for users
- Store-specific order management
- Order cancellation and reviews

### Contact & Support
- Contact form submissions
- Admin contact management
- Email notifications
- Priority and status tracking

### Statistics & Analytics
- Public stats for About page
- Detailed admin dashboard statistics
- Revenue and performance metrics
- Popular items and stores analytics

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Email**: Nodemailer
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer (with Cloudinary support)

## 📁 Project Structure

```
backend/
├── server.js                 # Main server file
├── config/
│   └── database.js           # Database configuration
├── models/                   # Mongoose models
│   ├── User.js
│   ├── Meal.js
│   ├── Store.js
│   ├── Order.js
│   └── Contact.js
├── routes/                   # API routes
│   ├── auth.js
│   ├── users.js
│   ├── meals.js
│   ├── stores.js
│   ├── orders.js
│   ├── contact.js
│   └── stats.js
├── controllers/              # Route controllers
│   ├── authController.js
│   ├── userController.js
│   ├── mealController.js
│   ├── storeController.js
│   ├── orderController.js
│   ├── contactController.js
│   └── statsController.js
├── middlewares/              # Custom middleware
│   ├── auth.js
│   ├── errorHandler.js
│   └── validation.js
├── utils/                    # Utility functions
│   ├── generateToken.js
│   ├── sendEmail.js
│   └── seedData.js
├── package.json
├── .env.example
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Gmail account for email services

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   FRONTEND_URL=http://localhost:3000
   ```

4. **Seed Database (Optional)**
   ```bash
   npm run seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
```
POST   /auth/register     # Register new user
POST   /auth/login        # User login
POST   /auth/logout       # User logout
GET    /auth/me           # Get current user
PUT    /auth/profile      # Update user profile
```

### User Management
```
GET    /users             # Get all users (Admin)
GET    /users/favorites   # Get user favorites
POST   /users/favorites/:mealId    # Add to favorites
DELETE /users/favorites/:mealId    # Remove from favorites
GET    /users/:id         # Get single user (Admin)
PUT    /users/:id         # Update user (Admin)
DELETE /users/:id         # Delete user (Admin)
```

### Meals/Menu
```
GET    /meals             # Get all meals (with filtering)
GET    /meals/search      # Search meals
GET    /meals/category/:category  # Get meals by category
GET    /meals/time/:timeOfDay     # Get meals by time
POST   /meals             # Create meal (Admin/Owner)
GET    /meals/:id         # Get single meal
PUT    /meals/:id         # Update meal (Admin/Owner)
DELETE /meals/:id         # Delete meal (Admin/Owner)
```

### Stores
```
GET    /stores            # Get all stores
GET    /stores/search     # Search stores
GET    /stores/area/:area # Get stores by area
GET    /stores/nearby     # Get nearby stores
POST   /stores            # Create store (Owner/Admin)
GET    /stores/:id        # Get single store
PUT    /stores/:id        # Update store (Owner/Admin)
DELETE /stores/:id        # Delete store (Owner/Admin)
```

### Orders
```
POST   /orders            # Create new order
GET    /orders            # Get all orders (Admin)
GET    /orders/my-orders  # Get user's orders
GET    /orders/store/:storeId     # Get store orders
GET    /orders/:id        # Get single order
PUT    /orders/:id/status # Update order status
PUT    /orders/:id/cancel # Cancel order
POST   /orders/:id/review # Add order review
```

### Contact
```
POST   /contact           # Submit contact form
GET    /contact           # Get all messages (Admin)
GET    /contact/:id       # Get single message (Admin)
PUT    /contact/:id       # Update message (Admin)
DELETE /contact/:id       # Delete message (Admin)
```

### Statistics
```
GET    /stats             # Get public stats
GET    /stats/dashboard   # Get admin dashboard stats
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles
- **User**: Regular customers
- **Owner**: Store owners
- **Admin**: System administrators

## 📧 Email Configuration

The system uses Nodemailer with Gmail SMTP. To set up:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in the `EMAIL_PASS` environment variable

## 🗄️ Database Models

### User Model
- Authentication and profile information
- Role-based access control
- Favorite meals tracking

### Meal Model
- Menu items with categories and timing
- Pricing and availability
- Ratings and reviews

### Store Model
- Store information and location
- Operating hours and contact details
- Owner relationship and verification

### Order Model
- Complete order lifecycle
- Item details and pricing
- Status tracking and delivery information

### Contact Model
- Customer inquiries and support tickets
- Status and priority management
- Admin response tracking

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
FRONTEND_URL=your_production_frontend_url
```

### Deployment Platforms
- **Render**: Easy deployment with automatic builds
- **Heroku**: Classic PaaS platform
- **Railway**: Modern deployment platform
- **DigitalOcean App Platform**: Scalable hosting

## 🧪 Testing

### Sample Data
Run the seed script to populate your database with sample data:
```bash
npm run seed
```

### Test Credentials
After seeding, you can use these credentials:
- **Admin**: admin@breakfast4u.com / admin123
- **Owner**: shraddha@example.com / password123
- **User**: john@example.com / password123

## 🔧 Development

### Available Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with sample data
```

### Code Structure
- **Controllers**: Handle business logic
- **Models**: Define data structure and validation
- **Routes**: Define API endpoints
- **Middleware**: Handle authentication, validation, and errors
- **Utils**: Helper functions and utilities

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting to prevent abuse
- CORS configuration
- Input validation and sanitization
- Helmet for security headers
- Error handling without sensitive data exposure

## 📈 Performance

- Database indexing for efficient queries
- Pagination for large datasets
- Compression middleware
- Optimized aggregation queries
- Caching strategies for frequently accessed data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Email: support@breakfast4u.com
- Documentation: [API Docs](http://localhost:5000/api/health)
- Issues: GitHub Issues

---

**Happy Coding! 🚀**