const Book = require('../models/Book');
const Borrowing = require('../models/Borrowing');
const User = require('../models/User'); // Added User model import

// @desc    Get all books
// @route   GET /api/books
// @access  Public
exports.getBooks = async (req, res, next) => {
  try {
    let query = {};
    let sort = {};

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by current semester category for authenticated users
    if (req.query.isSemesterStudy === 'true' && req.user && req.user.currentSemesterCategory) {
      query.category = req.user.currentSemesterCategory;
    }

    // Filter by author
    if (req.query.author) {
      query.author = { $regex: req.query.author, $options: 'i' };
    }

    // Filter by title
    if (req.query.title) {
      query.title = { $regex: req.query.title, $options: 'i' };
    }

    // Filter by availability
    if (req.query.available) {
      query.availableCopies = { $gt: 0 };
    }

    // Sort options
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'title':
          sort.title = 1;
          break;
        case 'author':
          sort.author = 1;
          break;
        case 'rating':
          sort['rating.average'] = -1;
          break;
        case 'publishedYear':
          sort.publishedYear = -1;
          break;
        default:
          sort.createdAt = -1;
      }
    } else {
      sort.createdAt = -1;
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Book.countDocuments(query);
    
    const books = await Book.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip(startIndex);

    // Pagination result
    const pagination = {};

    if (startIndex + limit < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: books.length,
      pagination,
      data: books
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new book
// @route   POST /api/books
// @access  Private/Admin
exports.createBook = async (req, res, next) => {
  try {
    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private/Admin
exports.updateBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private/Admin
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if book has active borrowings
    const activeBorrowings = await Borrowing.find({
      book: req.params.id,
      status: { $in: ['active', 'overdue'] }
    });

    if (activeBorrowings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete book with active borrowings'
      });
    }

    await book.remove();

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get book categories
// @route   GET /api/books/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Book.distinct('category');
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get popular books
// @route   GET /api/books/popular
// @access  Public
exports.getPopularBooks = async (req, res, next) => {
  try {
    const books = await Book.find()
      .sort({ 'rating.average': -1, 'rating.count': -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: books
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add book review
// @route   POST /api/books/:id/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if user already reviewed this book
    const existingReview = book.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this book'
      });
    }

    const review = {
      user: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment
    };

    book.reviews.push(review);
    book.updateRating();

    await book.save();

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get book borrowing history
// @route   GET /api/books/:id/history
// @access  Private/Admin
exports.getBookHistory = async (req, res, next) => {
  try {
    const history = await Borrowing.getBookHistory(req.params.id);

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

// @desc    Search books
// @route   GET /api/books/search
// @access  Public
exports.searchBooks = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const books = await Book.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } },
        { isbn: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    }).limit(20);

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getRecommendedBooks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('borrowingHistory.book', 'category');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const borrowedBookCategories = user.borrowingHistory
      .filter(item => item.book)
      .map((item) => item.book.category);

    const uniqueCategories = [...new Set(borrowedBookCategories)];

    // Find books that the user hasn't borrowed and are in the same categories
    const recommendedBooks = await Book.find({
      _id: { $nin: user.borrowingHistory.filter(item => item.book).map((item) => item.book._id) },
      category: { $in: uniqueCategories },
      availableCopies: { $gt: 0 } // Only recommend available books
    })
      .sort({ 'rating.average': -1, 'rating.count': -1 })
      .limit(10); // Limit to 10 recommendations

    res.status(200).json({
      success: true,
      count: recommendedBooks.length,
      data: recommendedBooks
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

