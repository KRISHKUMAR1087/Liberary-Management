const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
    maxlength: [100, 'Author name cannot be more than 100 characters']
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    match: [/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/, 'Please provide a valid ISBN']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Fiction',
      'Non-Fiction',
      'Science',
      'Technology',
      'History',
      'Biography',
      'Literature',
      'Mathematics',
      'Physics',
      'Chemistry',
      'Biology',
      'Medicine',
      'Art',
      'Music',
      'Philosophy',
      'Religion',
      'Business',
      'Economics',
      'Politics',
      'Education',
      'Other'
    ]
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  publisher: {
    type: String,
    trim: true,
    maxlength: [100, 'Publisher name cannot be more than 100 characters']
  },
  publishedYear: {
    type: Number,
    min: [100, 'Published year must be valid'],
    max: [new Date().getFullYear(), 'Published year cannot be in the future']
  },
  totalCopies: {
    type: Number,
    required: [true, 'Total copies is required'],
    min: [1, 'Total copies must be at least 1']
  },
  availableCopies: {
    type: Number,
    required: [true, 'Available copies is required'],
    min: [0, 'Available copies cannot be negative']
  },
  coverImage: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'English',
    maxlength: [50, 'Language cannot be more than 50 characters']
  },
  pages: {
    type: Number,
    min: [1, 'Pages must be at least 1']
  },
  location: {
    shelf: String,
    section: String,
    floor: {
      type: Number,
      min: 1
    }
  },
  status: {
    type: String,
    enum: ['available', 'borrowed', 'maintenance', 'lost'],
    default: 'available'
  },
  borrowingPeriod: {
    type: Number,
    default: 14, // 14 days default
    min: [1, 'Borrowing period must be at least 1 day']
  },
  finePerDay: {
    type: Number,
    default: 5, // $5 per day
    min: [0, 'Fine per day cannot be negative']
  },
  tags: [{
    type: String,
    trim: true
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'Review comment cannot be more than 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Validate available copies
bookSchema.pre('save', function(next) {
  if (this.availableCopies > this.totalCopies) {
    this.availableCopies = this.totalCopies;
  }
  next();
});

// Update rating when reviews change
bookSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating.average = (totalRating / this.reviews.length).toFixed(1);
    this.rating.count = this.reviews.length;
  }
};

module.exports = mongoose.model('Book', bookSchema);

