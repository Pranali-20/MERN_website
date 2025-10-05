# Meal Management System - Owner Dashboard

## Overview
The Owner Dashboard now fully integrates with MongoDB Atlas to persist meal data. All meals are saved to the database and automatically loaded when you refresh the page.

## How It Works

### Backend API Routes

**GET /api/meals**
- For owners: Returns only meals created by the authenticated owner
- For public: Returns all available meals
- Supports filtering by timeOfDay, category, tags, and price range

**POST /api/meals**
- Creates a new meal in MongoDB Atlas
- Requires authentication (owner or admin role)
- Automatically links meal to the logged-in owner via `createdBy` field

**PUT /api/meals/:id**
- Updates an existing meal
- Requires authentication and ownership verification
- Used for editing meal details and toggling availability

**DELETE /api/meals/:id**
- Deletes a meal from MongoDB Atlas
- Requires authentication and ownership verification

### Data Structure

Each meal contains:
- `name`: Meal name
- `description`: Detailed description
- `price`: Price in dollars
- `image`: Image URL
- `category`: Category (Pancakes, Street Food, South Indian, etc.)
- `timeOfDay`: Time slot (morning, afternoon, evening)
- `tags`: Array of tags (Vegetarian, Vegan, etc.)
- `preparationTime`: Time in minutes
- `isAvailable`: Availability status
- `createdBy`: Reference to owner who created it
- `rating`: Average rating (default 0)
- `reviewCount`: Number of reviews (default 0)

### Frontend Features

1. **Add Meal**: Fill out the form and click "Add Item" - meal is immediately saved to MongoDB
2. **Edit Meal**: Click "Edit" on any meal card to update its details
3. **Delete Meal**: Click "Delete" to permanently remove from database
4. **Toggle Availability**: Click the availability badge to mark items as available/unavailable
5. **Time Slot Filtering**: Meals are automatically filtered by morning/afternoon/evening

### Key Implementation Details

- Meals are fetched from MongoDB when dashboard loads
- After any create/update/delete operation, meals are automatically re-fetched
- Error messages display clearly at the top of the page
- Success messages auto-dismiss after 3 seconds
- All operations include proper error handling

### Database Schema

The Meal model in MongoDB includes:
- Validation for required fields
- Enum constraints for categories, timeOfDay, and tags
- Reference to User model via `createdBy`
- Timestamps for created/updated dates
- Indexes for efficient querying by category, timeOfDay, and rating

### Security

- Owner authentication required for create/update/delete operations
- Owners can only view and manage their own meals
- JWT token authentication on all protected routes
- Authorization middleware verifies owner role

## Testing the System

1. Log in as an owner account
2. Navigate to Owner Dashboard
3. Select a time slot (Morning/Afternoon/Evening)
4. Click "Add New Item" and fill out the form
5. Submit - meal appears on the page
6. Refresh the browser - meal persists (loaded from MongoDB)
7. Edit or delete the meal to test those operations

## Common Issues & Solutions

**Issue**: Meals disappear after refresh
**Solution**: Ensure backend server is running and MongoDB Atlas connection is active

**Issue**: "Failed to create meal" error
**Solution**: Check that all required fields are filled and you're logged in as an owner

**Issue**: Meals not showing up
**Solution**: Verify you're looking at the correct time slot where you added the meal

**Issue**: Cannot edit/delete meals
**Solution**: Ensure you're logged in with the same owner account that created the meals
