const express = require('express');
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getCategories,
  getPopularBooks,
  addReview,
  getBookHistory,
  searchBooks,
  getRecommendedBooks
} = require('../controllers/bookController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getBooks);
router.get('/categories', getCategories);
router.get('/popular', getPopularBooks);
router.get('/search', searchBooks);
router.get('/:id', getBook);

// Protected routes
router.use(protect);

// User routes
router.post('/:id/reviews', addReview);
router.get('/recommendations', getRecommendedBooks);

// Admin routes
router.route('/')
  .post(authorize('admin'), createBook);

router.route('/:id')
  .put(authorize('admin'), updateBook)
  .delete(authorize('admin'), deleteBook);

router.get('/:id/history', authorize('admin'), getBookHistory);

module.exports = router;

