const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Meal = require('../models/Meal');
const Store = require('../models/Store');

// Connect to MongoDB with error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Connect to database first
    await connectDB();
    
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Meal.deleteMany({});
    await Store.deleteMany({});

    console.log('🗑️ Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@breakfast4u.com',
      phone: '9999999999',
      password: 'admin123',
      role: 'admin'
    });

    // Create sample store owners
    const owner1 = await User.create({
      name: 'Shraddha Owner',
      email: 'shraddha@example.com',
      phone: '9876543210',
      password: 'password123',
      role: 'owner',
      businessName: 'Shraddha Snack Centre',
      address: 'Opp Gate No 1, RIT, Sakhrale'
    });

    const owner2 = await User.create({
      name: 'Prakash Owner',
      email: 'prakash@example.com',
      phone: '9876543211',
      password: 'password123',
      role: 'owner',
      businessName: 'Prakash Snacks',
      address: 'near Ram Mandir, Sakhrale'
    });

    const owner3 = await User.create({
      name: 'Tuljai Owner',
      email: 'tuljai@example.com',
      phone: '9876543213',
      password: 'password123',
      role: 'owner',
      businessName: 'Tuljai Snacks',
      address: 'near Bus Stand, Takari'
    });

    const owner4 = await User.create({
      name: 'Mugdha Owner',
      email: 'mugdha@example.com',
      phone: '9876543214',
      password: 'password123',
      role: 'owner',
      businessName: 'Mugdha Snacks',
      address: 'Gandhi Chowk, Islampur'
    });

    const owner5 = await User.create({
      name: 'Anil Owner',
      email: 'anil@example.com',
      phone: '9876543215',
      password: 'password123',
      role: 'owner',
      businessName: 'Anil Snacks',
      address: 'Station Road, Walwa'
    });

    // Create sample users
    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543216',
      password: 'password123',
      role: 'user'
    });

    console.log('👥 Created users');

    // Create sample meals
    const meals = [
      {
        name: 'Bhel Puri',
        description: 'Crispy puffed rice tossed with tangy chutneys, onions, tomatoes, and crunchy sev',
        price: 30,
        image: 'Bhelpuri.webp',
        category: 'Snacks',
        timeOfDay: ['afternoon', 'evening'],
        tags: ['Vegan', 'Spicy'],
        preparationTime: 10,
        rating: 4.3,
        reviewCount: 210,
        ingredients: ['Puffed rice', 'Onions', 'Tomatoes', 'Chutneys', 'Sev'],
        createdBy: adminUser._id
      },
      {
        name: 'Pav Bhaji',
        description: 'Buttery pav buns served with spicy mashed vegetable curry topped with onions and lemon',
        price: 60,
        image: 'Pavbhaji.jpg',
        category: 'Street Food',
        timeOfDay: ['afternoon', 'evening'],
        tags: ['Vegetarian', 'Spicy'],
        preparationTime: 20,
        rating: 4.6,
        reviewCount: 340,
        ingredients: ['Pav bread', 'Mixed vegetables', 'Butter', 'Spices'],
        createdBy: adminUser._id
      },
      {
        name: 'Idli',
        description: 'Soft, fluffy steamed rice cakes served with coconut chutney and sambar',
        price: 30,
        image: 'idli.jpg',
        category: 'South Indian',
        timeOfDay: ['morning'],
        tags: ['Vegetarian', 'Gluten-Free', 'Healthy'],
        preparationTime: 12,
        rating: 4.4,
        reviewCount: 180,
        ingredients: ['Rice', 'Urad dal', 'Coconut chutney', 'Sambar'],
        createdBy: adminUser._id
      },
      {
        name: 'Dosa',
        description: 'Crispy golden rice crepe served with potato filling, chutneys, and sambar',
        price: 50,
        image: 'Dosa.jpg',
        category: 'South Indian',
        timeOfDay: ['morning', 'afternoon'],
        tags: ['Vegetarian'],
        preparationTime: 18,
        rating: 4.7,
        reviewCount: 260,
        ingredients: ['Rice', 'Urad dal', 'Potato', 'Spices'],
        createdBy: adminUser._id
      },
      {
        name: 'Misal Pav',
        description: 'Spicy sprouted bean curry topped with farsan, onions, and served with pav',
        price: 45,
        image: 'Misal Pav.webp',
        category: 'Maharashtrian',
        timeOfDay: ['morning', 'afternoon'],
        tags: ['Vegetarian', 'Spicy', 'Protein-Rich'],
        preparationTime: 20,
        rating: 4.5,
        reviewCount: 220,
        ingredients: ['Sprouted beans', 'Pav bread', 'Farsan', 'Spices'],
        createdBy: adminUser._id
      },
      {
        name: 'Samosa',
        description: 'Golden fried pastry stuffed with spiced potato and peas, served with chutney',
        price: 15,
        image: 'Samosa.jpg',
        category: 'Snacks',
        timeOfDay: ['afternoon', 'evening'],
        tags: ['Vegetarian'],
        preparationTime: 8,
        rating: 4.6,
        reviewCount: 300,
        ingredients: ['Flour', 'Potato', 'Peas', 'Spices'],
        createdBy: adminUser._id
      },
      {
        name: 'Chai',
        description: 'Strong Indian tea brewed with milk, sugar, and aromatic spices',
        price: 10,
        image: 'Chai.jpg',
        category: 'Beverages',
        timeOfDay: ['morning', 'afternoon', 'evening'],
        tags: ['Vegetarian'],
        preparationTime: 7,
        rating: 4.8,
        reviewCount: 500,
        ingredients: ['Tea leaves', 'Milk', 'Sugar', 'Spices'],
        createdBy: adminUser._id
      },
      {
        name: 'Vada Pav',
        description: 'Spicy potato fritter sandwiched in pav bread with chutneys',
        price: 15,
        image: 'Vadapav.jpg',
        category: 'Street Food',
        timeOfDay: ['morning', 'afternoon', 'evening'],
        tags: ['Vegetarian', 'Spicy'],
        preparationTime: 10,
        rating: 4.7,
        reviewCount: 400,
        ingredients: ['Potato', 'Pav bread', 'Gram flour', 'Chutneys'],
        createdBy: adminUser._id
      }
    ];

    const createdMeals = await Meal.insertMany(meals);
    console.log('🍽️ Created meals');

    // Create sample stores
    const stores = [
      {
        name: 'Shraddha Snack Centre',
        description: 'Popular snack center known for healthy breakfast options and fresh beverages',
        address: {
          street: 'Opp Gate No 1, RIT',
          area: 'Sakhrale',
          city: 'Sangli',
          state: 'Maharashtra',
          pincode: '416416'
        },
        location: {
          type: 'Point',
          coordinates: [74.6297, 16.8524] // [longitude, latitude]
        },
        phone: '9876543210',
        email: 'shraddha@example.com',
        hours: {
          monday: { open: '06:00', close: '15:00', closed: false },
          tuesday: { open: '06:00', close: '15:00', closed: false },
          wednesday: { open: '06:00', close: '15:00', closed: false },
          thursday: { open: '06:00', close: '15:00', closed: false },
          friday: { open: '06:00', close: '15:00', closed: false },
          saturday: { open: '06:00', close: '15:00', closed: false },
          sunday: { open: '07:00', close: '14:00', closed: false }
        },
        rating: 4.5,
        reviewCount: 125,
        specialties: ['Healthy Options', 'Beverages', 'South Indian'],
        features: ['WiFi', 'Outdoor Seating', 'Vegan Options'],
        popularItems: [createdMeals[2]._id, createdMeals[3]._id, createdMeals[6]._id], // Idli, Dosa, Chai
        images: ['https://images.pexels.com/photos/887827/pexels-photo-887827.jpeg?auto=compress&cs=tinysrgb&w=400'],
        owner: owner1._id,
        isActive: true,
        isVerified: true,
        deliveryRadius: 5,
        minimumOrder: 50,
        deliveryFee: 20
      },
      {
        name: 'Prakash Snacks',
        description: 'Traditional snack center specializing in street food and quick bites',
        address: {
          street: 'near Ram Mandir',
          area: 'Sakhrale',
          city: 'Sangli',
          state: 'Maharashtra',
          pincode: '416416'
        },
        location: {
          type: 'Point',
          coordinates: [74.6300, 16.8520]
        },
        phone: '9876543211',
        email: 'prakash@example.com',
        hours: {
          monday: { open: '06:00', close: '17:00', closed: false },
          tuesday: { open: '06:00', close: '17:00', closed: false },
          wednesday: { open: '06:00', close: '17:00', closed: false },
          thursday: { open: '06:00', close: '17:00', closed: false },
          friday: { open: '06:00', close: '17:00', closed: false },
          saturday: { open: '06:00', close: '17:00', closed: false },
          sunday: { open: '07:00', close: '16:00', closed: false }
        },
        rating: 4.8,
        reviewCount: 89,
        specialties: ['Vadapav', 'Beverages', 'Fast Food'],
        features: ['Takeout', 'Family-Friendly', 'Fresh Baked Daily'],
        popularItems: [createdMeals[7]._id, createdMeals[6]._id, createdMeals[5]._id], // Vada Pav, Chai, Samosa
        images: ['https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=400'],
        owner: owner2._id,
        isActive: true,
        isVerified: true,
        deliveryRadius: 3,
        minimumOrder: 30,
        deliveryFee: 15
      },
      {
        name: 'Tuljai Snacks',
        description: 'Authentic Maharashtrian snacks and traditional breakfast items',
        address: {
          street: 'near Bus Stand',
          area: 'Takari',
          city: 'Sangli',
          state: 'Maharashtra',
          pincode: '416417'
        },
        location: {
          type: 'Point',
          coordinates: [74.6350, 16.8600]
        },
        phone: '9876543212',
        email: 'tuljai@example.com',
        hours: {
          monday: { open: '05:30', close: '22:00', closed: false },
          tuesday: { open: '05:30', close: '22:00', closed: false },
          wednesday: { open: '05:30', close: '22:00', closed: false },
          thursday: { open: '05:30', close: '22:00', closed: false },
          friday: { open: '05:30', close: '22:00', closed: false },
          saturday: { open: '05:30', close: '22:00', closed: false },
          sunday: { open: '06:00', close: '21:00', closed: false }
        },
        rating: 4.6,
        reviewCount: 156,
        specialties: ['Pav Bhaji', 'Kolhapuri Misal', 'Poha'],
        features: ['Authentic', 'Takeout', 'Vegan Options'],
        popularItems: [createdMeals[1]._id, createdMeals[4]._id], // Pav Bhaji, Misal Pav
        images: ['Tuljai.jpg'],
        owner: owner3._id,
        isActive: true,
        isVerified: true,
        deliveryRadius: 7,
        minimumOrder: 40,
        deliveryFee: 25
      },
      {
        name: 'Mugdha Snacks',
        description: 'Healthy snacks and fresh juices',
        address: {
          street: 'Gandhi Chowk',
          area: 'Islampur',
          city: 'Sangli',
          state: 'Maharashtra',
          pincode: '415409'
        },
        location: {
          type: 'Point',
          coordinates: [74.2800, 16.9500]
        },
        phone: '9876543214',
        email: 'mugdha@example.com',
        hours: {
          monday: { open: '07:00', close: '21:00', closed: false },
          tuesday: { open: '07:00', close: '21:00', closed: false },
          wednesday: { open: '07:00', close: '21:00', closed: false },
          thursday: { open: '07:00', close: '21:00', closed: false },
          friday: { open: '07:00', close: '21:00', closed: false },
          saturday: { open: '07:00', close: '21:00', closed: false },
          sunday: { open: '08:00', close: '20:00', closed: false }
        },
        rating: 4.7,
        reviewCount: 95,
        specialties: ['Sweets', 'Dhokla', 'Vegan Options'],
        features: ['Organic', 'Gluten-Free', 'Sustainable'],
        popularItems: [createdMeals[0]._id], // Bhel Puri
        images: ['https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400'],
        owner: owner4._id,
        isActive: true,
        isVerified: true,
        deliveryRadius: 10,
        minimumOrder: 60,
        deliveryFee: 30
      },
      {
        name: 'Anil Snacks',
        description: 'Traditional breakfast and quick bites',
        address: {
          street: 'Station Road',
          area: 'Walwa',
          city: 'Sangli',
          state: 'Maharashtra',
          pincode: '416313'
        },
        location: {
          type: 'Point',
          coordinates: [74.5800, 16.9200]
        },
        phone: '9876543215',
        email: 'anil@example.com',
        hours: {
          monday: { open: '05:00', close: '14:00', closed: false },
          tuesday: { open: '05:00', close: '14:00', closed: false },
          wednesday: { open: '05:00', close: '14:00', closed: false },
          thursday: { open: '05:00', close: '14:00', closed: false },
          friday: { open: '05:00', close: '14:00', closed: false },
          saturday: { open: '05:00', close: '14:00', closed: false },
          sunday: { open: '06:00', close: '13:00', closed: false }
        },
        rating: 4.3,
        reviewCount: 78,
        specialties: ['Light Food', 'Indian Classic', 'Milkshakes'],
        features: ['Diner Style', 'Large Portions', 'Classic Menu'],
        popularItems: [createdMeals[0]._id], // Bhel Puri
        images: ['https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg?auto=compress&cs=tinysrgb&w=400'],
        owner: owner5._id,
        isActive: true,
        isVerified: true,
        deliveryRadius: 4,
        minimumOrder: 35,
        deliveryFee: 20
      }
    ];

    await Store.insertMany(stores);
    console.log('🏪 Created stores');

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Seeded data summary:');
    console.log(`- Users: ${await User.countDocuments()}`);
    console.log(`- Meals: ${await Meal.countDocuments()}`);
    console.log(`- Stores: ${await Store.countDocuments()}`);
    console.log('\n🔐 Login credentials:');
    console.log('Admin: admin@breakfast4u.com / admin123');
    console.log('Owner 1 (Shraddha): shraddha@example.com / password123');
    console.log('Owner 2 (Prakash): prakash@example.com / password123');
    console.log('Owner 3 (Tuljai): tuljai@example.com / password123');
    console.log('Owner 4 (Mugdha): mugdha@example.com / password123');
    console.log('Owner 5 (Anil): anil@example.com / password123');
    console.log('User: john@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();