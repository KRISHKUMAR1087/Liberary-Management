const Borrowing = require('../models/Borrowing');
const Book = require('../models/Book');
const User = require('../models/User');

exports.getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBooks = await Book.countDocuments();
    const totalBorrowings = await Borrowing.countDocuments();
    const overdueBooks = await Borrowing.countDocuments({ status: 'overdue' });

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
        totalUsers,
        totalBooks,
        totalBorrowings,
        overdueBooks,
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

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getUserBorrowings = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const borrowings = await Borrowing.find({ user: userId })
      .populate('book', 'title author coverImage')
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

exports.borrowBookForStudent = async (req, res, next) => {
  try {
    const { userId, bookId } = req.body;

    // 1. Validate inputs
    if (!userId || !bookId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both userId and bookId'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student user not found'
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // 2. Check book availability
    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Book is not available for borrowing'
      });
    }

    // Check if student already borrowed this book
    const existingBorrowing = await Borrowing.findOne({
      user: userId,
      book: bookId,
      status: { $in: ['active', 'overdue'] }
    });

    if (existingBorrowing) {
      return res.status(400).json({
        success: false,
        message: 'Student has already borrowed this book'
      });
    }

    // 3. Check student's borrowing limit (max 5 books)
    const studentBorrowingsCount = await Borrowing.countDocuments({
      user: userId,
      status: { $in: ['active', 'overdue'] }
    });

    if (studentBorrowingsCount >= 5) {
      return res.status(400).json({
        success: false,
        message: 'Student has reached the maximum borrowing limit (5 books)'
      });
    }

    // Calculate due date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + book.borrowingPeriod);

    // 4. Create a new borrowing record
    const borrowing = await Borrowing.create({
      user: userId,
      book: bookId,
      issuedBy: req.user.id, // Admin who is issuing the book
      dueDate,
      status: 'active'
    });

    // 5. Update book availability
    book.availableCopies -= 1;
    await book.save();

    // 6. Update user's borrowing history
    user.borrowedBooks.push(bookId);
    user.borrowingHistory.push({
      book: bookId,
      borrowedDate: borrowing.borrowedDate,
      status: 'borrowed'
    });
    await user.save();

    // Populate the borrowing record for the response
    await borrowing.populate('user book issuedBy');

    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully for student',
      data: borrowing
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteOldestBorrowingsForUser = async (req, res, next) => {
  try {
    const { userId, count } = req.params;

    if (!userId || !count || isNaN(count) || parseInt(count) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid userId and a positive number for count.'
      });
    }

    const numToDelete = parseInt(count);

    // Find the oldest borrowings for the user
    const borrowingsToDelete = await Borrowing.find({ user: userId })
      .sort({ borrowedDate: 1 })
      .limit(numToDelete);

    if (borrowingsToDelete.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No borrowing records found for this user to delete.'
      });
    }

    const borrowingIds = borrowingsToDelete.map(b => b._id);
    const bookIds = borrowingsToDelete.map(b => b.book);

    // Delete the borrowings
    await Borrowing.deleteMany({ _id: { $in: borrowingIds } });

    // Update book availability for each deleted borrowing
    for (const borrowing of borrowingsToDelete) {
      await Book.findByIdAndUpdate(borrowing.book, { $inc: { availableCopies: 1 } });
    }

    // Update user's borrowedBooks and borrowingHistory
    await User.findByIdAndUpdate(userId, {
      $pull: { 
        borrowedBooks: { $in: bookIds },
        borrowingHistory: { book: { $in: bookIds } }
      }
    });

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${borrowingsToDelete.length} oldest borrowing records for user ${userId}.`,
      deletedCount: borrowingsToDelete.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};