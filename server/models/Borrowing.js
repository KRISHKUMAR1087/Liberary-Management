const mongoose = require('mongoose');

const borrowingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book is required']
  },
  borrowedDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  returnedDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'returned', 'overdue', 'lost'],
    default: 'active'
  },
  renewalCount: {
    type: Number,
    default: 0,
    max: [2, 'Maximum 2 renewals allowed']
  },
  fineAmount: {
    type: Number,
    default: 0,
    min: [0, 'Fine amount cannot be negative']
  },
  finePaid: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Issuer is required']
  }
}, {
  timestamps: true
});

// Calculate due date before saving
borrowingSchema.pre('save', async function(next) {
  if (this.isNew) {
    const book = await mongoose.model('Book').findById(this.book);
    if (book && book.borrowingPeriod) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + book.borrowingPeriod);
      this.dueDate = dueDate;
    }
  }
  next();
});

// Update status based on dates
borrowingSchema.pre('save', function(next) {
  const now = new Date();
  
  if (this.status === 'active' && now > this.dueDate) {
    this.status = 'overdue';
    // Calculate fine
    const daysOverdue = Math.ceil((now - this.dueDate) / (1000 * 60 * 60 * 24));
    const book = mongoose.model('Book').findById(this.book);
    if (book && book.finePerDay) {
      this.fineAmount = daysOverdue * book.finePerDay;
    }
  }
  
  if (this.returnedDate && this.status !== 'returned') {
    this.status = 'returned';
  }
  
  next();
});

// Static method to get overdue books
borrowingSchema.statics.getOverdueBooks = function() {
  return this.find({
    status: 'active',
    dueDate: { $lt: new Date() }
  }).populate('user book');
};

// Static method to get user's borrowing history
borrowingSchema.statics.getUserHistory = function(userId) {
  return this.find({ user: userId })
    .populate('book', 'title author isbn coverImage')
    .sort({ borrowedDate: -1 });
};

// Static method to get book borrowing history
borrowingSchema.statics.getBookHistory = function(bookId) {
  return this.find({ book: bookId })
    .populate('user', 'name email studentId')
    .sort({ borrowedDate: -1 });
};

module.exports = mongoose.model('Borrowing', borrowingSchema);

