# Breakfast4U Backend Setup Guide

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Gmail account (for email services)

### 2. Installation Steps

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### 3. Environment Configuration

Edit the `.env` file with your actual values:

```env
# Database - Replace with your MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/breakfast4u?retryWrites=true&w=majority

# JWT Secret - Generate a strong secret
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex

# Email Configuration - Use Gmail App Password
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 4. MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get connection string and update MONGODB_URI

### 5. Gmail App Password Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account settings
3. Security → App passwords
4. Generate app password for "Mail"
5. Use this 16-character password in EMAIL_PASS

### 6. Start the Server

```bash
# Seed the database with sample data
npm run seed

# Start development server
npm run dev

# Or start production server
npm start
```

### 7. Verify Installation

Visit `http://localhost:5000/api/health` - you should see:
```json
{
  "success": true,
  "message": "Breakfast4U API is running!",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development",
  "version": "1.0.0"
}
```

## 🔧 Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Check your connection string
   - Verify IP whitelist in MongoDB Atlas
   - Ensure database user has proper permissions

2. **Email Not Working**
   - Verify Gmail app password (not regular password)
   - Check EMAIL_HOST and EMAIL_PORT settings
   - Ensure 2FA is enabled on Gmail

3. **JWT Errors**
   - Make sure JWT_SECRET is set and long enough
   - Check token format in requests

4. **CORS Issues**
   - Verify FRONTEND_URL matches your React app URL
   - Check if credentials are included in requests

### Debug Mode:
Set `NODE_ENV=development` for detailed error messages.

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Meals Endpoints
- `GET /api/meals` - Get all meals (with filters)
- `GET /api/meals/search?q=query` - Search meals
- `POST /api/meals` - Create meal (Admin/Owner)
- `GET /api/meals/:id` - Get single meal

### Stores Endpoints
- `GET /api/stores` - Get all stores
- `GET /api/stores/area/:area` - Get stores by area
- `GET /api/stores/nearby?lat=x&lng=y` - Get nearby stores

### Orders Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `PUT /api/orders/:id/status` - Update order status

### Contact & Stats
- `POST /api/contact` - Submit contact form
- `GET /api/stats` - Get public stats

## 🎯 Test Credentials

After running `npm run seed`:
- **Admin**: admin@breakfast4u.com / admin123
- **Owner**: shraddha@example.com / password123
- **User**: john@example.com / password123

## 🚀 Deployment

### Render Deployment:
1. Connect GitHub repository
2. Set environment variables in Render dashboard
3. Deploy automatically

### Heroku Deployment:
```bash
heroku create breakfast4u-api
heroku config:set MONGODB_URI=your_connection_string
heroku config:set JWT_SECRET=your_jwt_secret
git push heroku main
```

## 📞 Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB Atlas and Gmail are properly configured
4. Test API endpoints using Postman or similar tools