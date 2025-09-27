const Borrowing = require('../models/Borrowing');
const Book = require('../models/Book');
const User = require('../models/User');

// @desc    Borrow a book
// @route   POST /api/borrowings
// @access  Private
exports.borrowBook = async (req, res, next) => {
  try {
    const { id: bookId } = req.params; // Get bookId from URL parameters

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if book is available
    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Book is not available for borrowing'
      });
    }

    // Check if user already borrowed this book
    const existingBorrowing = await Borrowing.findOne({
      user: req.user.id,
      book: bookId,
      status: { $in: ['active', 'overdue'] }
    });

    if (existingBorrowing) {
      return res.status(400).json({
        success: false,
        message: 'You have already borrowed this book'
      });
    }

    // Check user's borrowing limit (max 5 books)
    const userBorrowings = await Borrowing.countDocuments({
      user: req.user.id,
      status: { $in: ['active', 'overdue'] }
    });

    if (userBorrowings >= 5) {
      return res.status(400).json({
        success: false,
        message: 'You have reached the maximum borrowing limit (5 books)'
      });
    }

    // Calculate due date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + book.borrowingPeriod);

    // Create borrowing record
    const borrowing = await Borrowing.create({
      user: req.user.id,
      book: bookId,
      issuedBy: req.user.id,
      dueDate // Explicitly set the calculated due date
    });

    // Update book availability
    book.availableCopies -= 1;
    await book.save();

    // Add book to user's borrowed books and borrowing history
    const user = await User.findById(req.user.id);
    user.borrowedBooks.push(bookId);
    user.borrowingHistory.push({
      book: bookId,
      borrowedDate: borrowing.borrowedDate,
      status: 'borrowed'
    });
    await user.save();

    // Populate the borrowing record
    await borrowing.populate('book user issuedBy');

    res.status(201).json({
      success: true,
      data: borrowing
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Return a book
// @route   PUT /api/borrowings/:id/return
// @access  Private
exports.returnBook = async (req, res, next) => {
  try {
    const borrowing = await Borrowing.findById(req.params.id);

    if (!borrowing) {
      return res.status(404).json({
        success: false,
        message: 'Borrowing record not found'
      });
    }

    // Check if user owns this borrowing record
    if (borrowing.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to return this book'
      });
    }

    // Check if book is already returned
    if (borrowing.status === 'returned') {
      return res.status(400).json({
        success: false,
        message: 'Book is already returned'
      });
    }

    // Update borrowing record
    borrowing.returnedDate = new Date();
    borrowing.status = 'returned';
    await borrowing.save();

    // Update book availability
    const book = await Book.findById(borrowing.book);
    book.availableCopies += 1;
    await book.save();

    // Remove book from user's borrowed books
    const user = await User.findById(borrowing.user);
    user.borrowedBooks = user.borrowedBooks.filter(
      bookId => bookId.toString() !== borrowing.book.toString()
    );

    const borrowingHistoryEntry = user.borrowingHistory.find(
      (entry) => entry.book.toString() === borrowing.book.toString() && !entry.returnedDate
    );

    if (borrowingHistoryEntry) {
      borrowingHistoryEntry.returnedDate = new Date();
      borrowingHistoryEntry.status = 'returned';
    }
    await user.save();

    // Populate the borrowing record
    await borrowing.populate('book user');

    res.status(200).json({
      success: true,
      data: borrowing
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Renew a book
// @route   PUT /api/borrowings/:id/renew
// @access  Private
exports.renewBook = async (req, res, next) => {
  try {
    const borrowing = await Borrowing.findById(req.params.id);

    if (!borrowing) {
      return res.status(404).json({
        success: false,
        message: 'Borrowing record not found'
      });
    }

    // Check if user owns this borrowing record
    if (borrowing.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to renew this book'
      });
    }

    // Check if book is already returned
    if (borrowing.status === 'returned') {
      return res.status(400).json({
        success: false,
        message: 'Cannot renew a returned book'
      });
    }

    // Check renewal limit
    if (borrowing.renewalCount >= 2) {
      return res.status(400).json({
        success: false,
        message: 'Maximum renewal limit reached'
      });
    }

    // Get book to get borrowing period
    const book = await Book.findById(borrowing.book);
    
    // Extend due date
    const newDueDate = new Date(borrowing.dueDate);
    newDueDate.setDate(newDueDate.getDate() + book.borrowingPeriod);
    borrowing.dueDate = newDueDate;
    borrowing.renewalCount += 1;

    await borrowing.save();

    // Populate the borrowing record
    await borrowing.populate('book user');

    res.status(200).json({
      success: true,
      data: borrowing
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's borrowings
// @route   GET /api/borrowings/my-borrowings
// @access  Private
exports.getMyBorrowings = async (req, res, next) => {
  try {
    const borrowings = await Borrowing.find({ user: req.user.id })
      .populate('book', 'title author isbn coverImage category')
      .sort({ borrowedDate: -1 });

    res.status(200).json({
      success: true,
      count: borrowings.length,
      data: borrowings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's borrowing history
// @route   GET /api/borrowings/my-history
// @access  Private
exports.getMyHistory = async (req, res, next) => {
  try {
    const history = await Borrowing.getUserHistory(req.user.id);

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all borrowings (Admin only)
// @route   GET /api/borrowings
// @access  Private/Admin
exports.getAllBorrowings = async (req, res, next) => {
  try {
    let query = {};

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by user
    if (req.query.user) {
      query.user = req.query.user;
    }

    // Filter by book
    if (req.query.book) {
      query.book = req.query.book;
    }

    // Filter overdue books
    if (req.query.overdue === 'true') {
      query.status = 'overdue';
    }

    const borrowings = await Borrowing.find(query)
      .populate('user', 'name email') // Explicitly select name and email
      .populate('book', 'title author isbn coverImage') // Explicitly select title and author
      .populate('issuedBy', 'name email') // Explicitly select name and email for issuer
      .sort({ borrowedDate: -1 });

    res.status(200).json({
      success: true,
      count: borrowings.length,
      data: borrowings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get overdue books
// @route   GET /api/borrowings/overdue
// @access  Private/Admin
exports.getOverdueBooks = async (req, res, next) => {
  try {
    const overdueBooks = await Borrowing.getOverdueBooks();

    res.status(200).json({
      success: true,
      count: overdueBooks.length,
      data: overdueBooks
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single borrowing
// @route   GET /api/borrowings/:id
// @access  Private
exports.getBorrowing = async (req, res, next) => {
  try {
    const borrowing = await Borrowing.findById(req.params.id)
      .populate('user', 'name email studentId')
      .populate('book', 'title author isbn coverImage')
      .populate('issuedBy', 'name');

    if (!borrowing) {
      return res.status(404).json({
        success: false,
        message: 'Borrowing record not found'
      });
    }

    // Check if user owns this borrowing or is admin
    if (borrowing.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this borrowing record'
      });
    }

    res.status(200).json({
      success: true,
      data: borrowing
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update borrowing (Admin only)
// @route   PUT /api/borrowings/:id
// @access  Private/Admin
exports.updateBorrowing = async (req, res, next) => {
  try {
    const borrowing = await Borrowing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('user book issuedBy');

    if (!borrowing) {
      return res.status(404).json({
        success: false,
        message: 'Borrowing record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: borrowing
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete borrowing (Admin only)
// @route   DELETE /api/borrowings/:id
// @access  Private/Admin
exports.deleteBorrowing = async (req, res, next) => {
  try {
    const borrowing = await Borrowing.findById(req.params.id);

    if (!borrowing) {
      return res.status(404).json({
        success: false,
        message: 'Borrowing record not found'
      });
    }

    // If borrowing is active, update book availability
    if (borrowing.status === 'active' || borrowing.status === 'overdue') {
      const book = await Book.findById(borrowing.book);
      book.availableCopies += 1;
      await book.save();

      // Remove book from user's borrowed books
      const user = await User.findById(borrowing.user);
      user.borrowedBooks = user.borrowedBooks.filter(
        bookId => bookId.toString() !== borrowing.book.toString()
      );
      await user.save();
    }

    await borrowing.remove();

    res.status(200).json({
      success: true,
      message: 'Borrowing record deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get borrowing statistics
// @route   GET /api/borrowings/stats
// @access  Private/Admin
exports.getBorrowingStats = async (req, res, next) => {
  try {
    const totalBorrowings = await Borrowing.countDocuments();
    const activeBorrowings = await Borrowing.countDocuments({ status: 'active' });
    const overdueBorrowings = await Borrowing.countDocuments({ status: 'overdue' });
    const returnedBorrowings = await Borrowing.countDocuments({ status: 'returned' });

    // Most borrowed books
    const mostBorrowedBooks = await Borrowing.aggregate([
      { $group: { _id: '$book', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'books', localField: '_id', foreignField: '_id', as: 'book' } },
      { $unwind: '$book' },
      { $project: { 'book.title': 1, 'book.author': 1, count: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBorrowings,
        activeBorrowings,
        overdueBorrowings,
        returnedBorrowings,
        mostBorrowedBooks
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

