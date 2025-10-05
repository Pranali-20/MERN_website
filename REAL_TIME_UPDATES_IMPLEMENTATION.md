# Real-Time Meal Updates Implementation

## Overview
This document describes the implementation of real-time meal updates across the Owner Dashboard, Menu, and Stores pages.

## Changes Made

### 1. Database Model Updates

#### Meal Model (`backend/models/Meal.js`)
- Added `store` field as a reference to the Store model
- This creates a relationship between meals and stores

```javascript
store: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Store'
}
```

### 2. Backend API Updates

#### Meal Controller (`backend/controllers/mealController.js`)
- Updated `getMeals()` to populate store information
- Updated `getMeal()` to populate store information
- Added new `getMealsByStore()` function to fetch meals by store ID

#### Meal Routes (`backend/routes/meals.js`)
- Added new route: `GET /api/meals/store/:storeId`
- This allows fetching all meals for a specific store

### 3. Frontend API Service (`src/services/api.js`)

Added new API methods:
- `getStores(filters)` - Fetch all stores with optional filters
- `getStore(storeId)` - Fetch a single store by ID
- `getMealsByStore(storeId)` - Fetch all meals for a specific store
- `getOwnerStores()` - Fetch stores owned by the authenticated user

### 4. Owner Dashboard Updates (`src/pages/OwnerDashboard.jsx`)

#### New Features:
- **Store Selection**: Added a dropdown to select which store the meal belongs to
- **Store Management**: Fetches owner's stores on component mount
- **Auto-linking**: Automatically associates new meals with the selected store

#### Real-Time Updates:
- After creating a meal: `fetchMeals()` is called automatically
- After updating a meal: `fetchMeals()` is called automatically
- After deleting a meal: `fetchMeals()` is called automatically
- Success/error messages appear for 3 seconds

### 5. Menu Page Updates (`src/pages/Menu.jsx`)

#### Complete Rewrite:
- **Dynamic Data Loading**: Fetches meals from the backend API instead of using hardcoded data
- **Real-Time Filtering**: Filters update automatically when selection changes
- **Store Filter Support**: Supports filtering meals by store via URL parameter `?store=StoreName`
- **Loading States**: Shows loading spinner while fetching data
- **Error Handling**: Displays error messages when API calls fail

#### Features:
- Search by meal name or description
- Filter by category
- Filter by time of day (morning/afternoon/evening)
- Sort by rating, price, or popularity
- Store information displayed on each meal card

### 6. Stores Page Updates (`src/pages/Stores.jsx`)

#### Complete Rewrite:
- **Dynamic Data Loading**: Fetches stores from the backend API
- **Real-Time Filtering**: Updates when filters change
- **Category Filter Support**: Supports filtering by category via URL parameter `?category=CategoryName`
- **Loading States**: Shows loading spinner while fetching data
- **Error Handling**: Displays error messages when API calls fail

#### Features:
- Search by store name or specialties
- Filter by area (Sakhrale, Takari, Islampur, Walwa)
- Filter by "Open Now" status
- View Menu button links to filtered menu page
- Displays store hours, address, phone, specialties, and features

## Real-Time Update Flow

### When Owner Adds a New Meal:

1. Owner fills out the meal form in Owner Dashboard
2. Owner selects the store from dropdown
3. Owner clicks "Add Item"
4. Frontend calls `api.createMeal(mealData)`
5. Backend creates meal in MongoDB with `store` reference
6. Success response triggers `fetchMeals()` in Owner Dashboard
7. Updated meals list appears immediately in Owner Dashboard
8. Success message shows for 3 seconds
9. Menu page automatically shows the new meal when refreshed (or filter changes)
10. Stores page "View Menu" button shows updated menu with new meal

### When User Views Menu:

1. User navigates to Menu page
2. `useEffect` triggers `fetchMeals()` on component mount
3. Backend returns meals with populated store information
4. Meals display in grid with store names
5. Clicking "Show Stores" navigates to filtered stores page
6. Category/time/sort filters trigger automatic refetch

### When User Clicks "View Menu" on Store Page:

1. User clicks "View Menu" on a store card
2. Navigates to `/menu?store=StoreName`
3. Menu page filters meals by store name
4. Only meals from that specific store are displayed
5. User can clear filter to see all meals

## Benefits

1. **No Manual Refresh Required**: UI updates automatically after CRUD operations
2. **Store Association**: Each meal is properly linked to its store
3. **Dynamic Filtering**: Real-time filtering by store, category, time, etc.
4. **Consistent Data**: Frontend always displays current backend data
5. **Better UX**: Loading states and error handling improve user experience
6. **Scalability**: Easy to add more stores and meals without code changes

## Technical Implementation Details

### State Management
- React `useState` for local component state
- React `useEffect` for side effects (data fetching)
- Automatic refetch on filter/sort changes

### API Integration
- Centralized API service in `src/services/api.js`
- Proper error handling with try-catch blocks
- Loading states during async operations

### Data Flow
```
Owner Dashboard → Backend API → MongoDB
                     ↓
Menu Page ← Backend API ← MongoDB
                     ↓
Stores Page ← Backend API ← MongoDB
```

## Future Enhancements

1. **WebSocket Integration**: For true real-time updates without refresh
2. **Optimistic Updates**: Update UI immediately, then sync with backend
3. **Caching Strategy**: Cache frequently accessed data
4. **Pagination**: Handle large datasets more efficiently
5. **Search Debouncing**: Reduce API calls during search typing
