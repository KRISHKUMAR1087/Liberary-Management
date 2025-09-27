const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { getAdminStats, getAllUsers, getUserBorrowings, borrowBookForStudent, deleteOldestBorrowingsForUser } = require('../controllers/adminController');

const router = express.Router();

router.use(protect);
router.get('/stats', authorize('admin'), getAdminStats);
router.get('/users', authorize('admin'), getAllUsers);
router.get('/borrowings/user/:userId', authorize('admin'), getUserBorrowings);
router.post('/borrow', authorize('admin'), borrowBookForStudent);
router.delete('/borrowings/user/:userId/oldest/:count', authorize('admin'), deleteOldestBorrowingsForUser);

module.exports = router;
