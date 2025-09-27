const express = require('express');
const {
  borrowBook,
  returnBook,
  renewBook,
  getMyBorrowings,
  getMyHistory,
  getAllBorrowings,
  getOverdueBooks,
  getBorrowing,
  updateBorrowing,
  deleteBorrowing,
  getBorrowingStats
} = require('../controllers/borrowingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// User routes
router.post('/:id', borrowBook);
router.get('/my-borrowings', getMyBorrowings);
router.get('/my-history', getMyHistory);
router.get('/overdue', getOverdueBooks);
router.put('/:id/return', returnBook);
router.put('/:id/renew', renewBook);
router.get('/:id', getBorrowing);

// Admin routes
router.route('/')
  .get(authorize('admin'), getAllBorrowings);

router.route('/stats')
  .get(authorize('admin'), getBorrowingStats);

router.route('/:id')
  .put(authorize('admin'), updateBorrowing)
  .delete(authorize('admin'), deleteBorrowing);

module.exports = router;

