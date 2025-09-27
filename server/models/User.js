const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'student'],
    default: 'student'
  },
  studentId: {
    type: String,
    unique: true,
    sparse: true
  },
  phone: {
    type: String,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please provide a valid phone number']
  },
  collegeName: {
    type: String,
    maxlength: [100, 'College name cannot be more than 100 characters'],
    trim: true
  },
  department: {
    type: String,
    maxlength: [100, 'Department cannot be more than 100 characters'],
    trim: true
  },
  address: {
    type: String,
    maxlength: [200, 'Address cannot be more than 200 characters']
  },
  currentSemester: {
    type: String,
    maxlength: [50, 'Current semester cannot be more than 50 characters'],
    trim: true
  },
  currentSemesterCategory: {
    type: String,
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
      'Other',
      null
    ],
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  borrowedBooks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }],
  borrowingHistory: [{
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book'
    },
    borrowedDate: Date,
    returnedDate: Date,
    status: {
      type: String,
      enum: ['borrowed', 'returned', 'overdue']
    }
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Generate student ID for students
userSchema.pre('save', async function(next) {
  if (this.isNew && this.role === 'student' && !this.studentId) {
    const count = await mongoose.model('User').countDocuments({ role: 'student' });
    this.studentId = `STU${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

