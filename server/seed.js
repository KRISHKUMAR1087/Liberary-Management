const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Book = require('./models/Book');
const config = require('../config');

// Sample books data
const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    category: "Literature",
    description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
    publisher: "Scribner",
    publishedYear: 1925,
    totalCopies: 5,
    availableCopies: 5,
    language: "English",
    pages: 180,
    borrowingPeriod: 14,
    finePerDay: 5,
    coverImage: "https://via.placeholder.com/150/FF8C00/FFFFFF?text=The+Great+Gatsby",
    rating: {
      average: 4.2,
      count: 120
    },
    reviews: [],
    borrowingHistory: [],
    tags: ["classic", "american literature", "jazz age"]
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780061120084",
    category: "Literature",
    description: "A gripping tale of racial injustice and childhood innocence in the American South.",
    publisher: "J.B. Lippincott & Co.",
    publishedYear: 1960,
    totalCopies: 3,
    availableCopies: 3,
    language: "English",
    pages: 281,
    borrowingPeriod: 14,
    finePerDay: 5,
    coverImage: "https://via.placeholder.com/150/FF8C00/FFFFFF?text=To+Kill+a+Mockingbird",
    rating: {
      average: 4.5,
      count: 150
    },
    reviews: [],
    borrowingHistory: [],
    tags: ["classic", "american literature", "civil rights"]
  },
  {
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    category: "Literature",
    description: "A dystopian social science fiction novel about totalitarian control and surveillance.",
    publisher: "Secker & Warburg",
    publishedYear: 1949,
    totalCopies: 4,
    availableCopies: 4,
    language: "English",
    pages: 328,
    borrowingPeriod: 14,
    finePerDay: 5,
    coverImage: "https://via.placeholder.com/150/FF8C00/FFFFFF?text=1984",
    rating: {
      average: 4.3,
      count: 180
    },
    reviews: [],
    borrowingHistory: [],
    tags: ["dystopian", "science fiction", "totalitarianism"]
  },
  {
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    isbn: "9780262033848",
    category: "Technology",
    description: "Comprehensive introduction to modern computer algorithms and data structures.",
    publisher: "MIT Press",
    publishedYear: 2009,
    totalCopies: 2,
    availableCopies: 2,
    language: "English",
    pages: 1312,
    borrowingPeriod: 21,
    finePerDay: 5,
    coverImage: "https://via.placeholder.com/150/FF8C00/FFFFFF?text=Introduction+to+Algorithms",
    rating: {
      average: 4.8,
      count: 90
    },
    reviews: [],
    borrowingHistory: [],
    tags: ["algorithms", "computer science", "programming"]
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "9780132350884",
    category: "Technology",
    description: "A handbook of agile software craftsmanship focusing on writing clean, maintainable code.",
    publisher: "Prentice Hall",
    publishedYear: 2008,
    totalCopies: 3,
    availableCopies: 3,
    language: "English",
    pages: 464,
    borrowingPeriod: 14,
    finePerDay: 5,
    coverImage: "https://via.placeholder.com/150/FF8C00/FFFFFF?text=Clean+Code",
    rating: {
      average: 4.6,
      count: 110
    },
    reviews: [],
    borrowingHistory: [],
    tags: ["programming", "software engineering", "clean code"]
  },
  {
    title: "The Art of War",
    author: "Sun Tzu",
    isbn: "9780486425576",
    category: "History",
    description: "Ancient Chinese military treatise on strategy and warfare.",
    publisher: "Dover Publications",
    publishedYear: 500,
    totalCopies: 2,
    availableCopies: 2,
    language: "English",
    pages: 273,
    borrowingPeriod: 14,
    finePerDay: 5,
    coverImage: "https://via.placeholder.com/150/FF8C00/FFFFFF?text=The+Art+of+War",
    rating: {
      average: 4.1,
      count: 80
    },
    reviews: [],
    borrowingHistory: [],
    tags: ["strategy", "military", "ancient wisdom"]
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    isbn: "9780062316097",
    category: "History",
    description: "An exploration of how Homo sapiens came to dominate the world.",
    publisher: "Harper",
    publishedYear: 2014,
    totalCopies: 2,
    availableCopies: 2,
    language: "English",
    pages: 443,
    borrowingPeriod: 14,
    finePerDay: 5,
    coverImage: "https://via.placeholder.com/150/00CED1/FFFFFF?text=Sapiens",
    rating: {
      average: 4.7,
      count: 130
    },
    reviews: [],
    borrowingHistory: [],
    tags: ["anthropology", "history", "evolution"]
  },
  {
    title: "The Selfish Gene",
    author: "Richard Dawkins",
    isbn: "9780192860927",
    category: "Science",
    description: "A book on evolution that introduces the concept of the gene as the unit of selection.",
    publisher: "Oxford University Press",
    publishedYear: 1976,
    totalCopies: 2,
    availableCopies: 2,
    language: "English",
    pages: 360,
    borrowingPeriod: 14,
    finePerDay: 5,
    coverImage: "https://via.placeholder.com/150/FFD700/000000?text=Selfish+Gene",
    rating: {
      average: 4.4,
      count: 95
    },
    reviews: [],
    borrowingHistory: [],
    tags: ["biology", "evolution", "genetics"]
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    isbn: "9780553380163",
    category: "Science",
    description: "A popular science book about cosmology and theoretical physics.",
    publisher: "Bantam Books",
    publishedYear: 1988,
    totalCopies: 3,
    availableCopies: 3,
    language: "English",
    pages: 256,
    borrowingPeriod: 14,
    finePerDay: 5,
    coverImage: "https://via.placeholder.com/150/FF8C00/FFFFFF?text=A+Brief+History+of+Time",
    rating: {
      average: 4.6,
      count: 105
    },
    reviews: [],
    borrowingHistory: [],
    tags: ["physics", "cosmology", "astronomy"]
  },
  {
    title: "The Lean Startup",
    author: "Eric Ries",
    isbn: "9780307887894",
    category: "Business",
    description: "A methodology for developing businesses and products through validated learning.",
    publisher: "Crown Business",
    publishedYear: 2011,
    totalCopies: 2,
    availableCopies: 2,
    language: "English",
    pages: 336,
    borrowingPeriod: 14,
    finePerDay: 5,
    coverImage: "https://via.placeholder.com/150/8A2BE2/FFFFFF?text=The+Lean+Startup",
    rating: {
      average: 4.0,
      count: 70
    },
    reviews: [],
    borrowingHistory: [],
    tags: ["entrepreneurship", "startup", "business strategy"]
  }
];

// Sample users data
const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@gmail.com",
    password: "admin@1234",
    role: "admin",
    phone: "+1234567890",
    address: "123 Admin Street, Admin City, AC 12345"
  },
  {
    name: "John Student",
    email: "student@gmail.com",
    password: "student@1234",
    role: "student",
    phone: "+1234567891",
    address: "456 Student Avenue, Student City, SC 67890",
    collegeName: "Depstar",
    department: "CE",
    currentSemester: "third semester",
    currentSemesterCategory: "Science"
  },
  {
    name: "Jane Smith",
    email: "jane.smith@library.com",
    password: "password123",
    role: "student",
    phone: "+1234567892",
    address: "789 College Road, University City, UC 11111",
    collegeName: "Depstar",
    department: "CE",
    currentSemester: "third semester",
    currentSemesterCategory: "Literature"
  },
  {
    name: "Mike Johnson",
    email: "mike.johnson@library.com",
    password: "password123",
    role: "student",
    phone: "+1234567893",
    address: "321 Library Lane, Book Town, BT 22222",
    collegeName: "Depstar",
    department: "CE",
    currentSemester: "third semester",
    currentSemesterCategory: "Technology"
  },
  {
    name: "Sarah Wilson",
    email: "sarah.wilson@library.com",
    password: "password123",
    role: "student",
    phone: "+1234567894",
    address: "654 Reading Street, Knowledge City, KC 33333",
    collegeName: "Depstar",
    department: "CE",
    currentSemester: "third semester",
    currentSemesterCategory: "History"
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Hash passwords for users
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12)
      }))
    );

    // Create users
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`👥 Created ${createdUsers.length} users`);

    // Create books
    const createdBooks = await Book.insertMany(sampleBooks);
    console.log(`📚 Created ${createdBooks.length} books`);

    console.log('🎉 Database seeded successfully!');
    console.log('\n📋 Demo Accounts:');
    console.log('Admin: admin@gmail.com / admin@1234');
    console.log('Student: student@gmail.com / student@1234');
    console.log('\nOther student accounts:');
    sampleUsers.slice(2).forEach(user => {
      console.log(`${user.name}: ${user.email} / password123`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the seed function
seedDatabase();

