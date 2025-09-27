import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { BookOpen, Clock, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';

const MyBorrowings = () => {
  const { data: borrowings, isLoading } = useQuery(
    'myBorrowings',
    () => api.get('/api/borrowings/my-borrowings'),
    {
      select: (response) => response.data.data
    }
  );

  const { data: borrowingHistory, isLoading: isLoadingHistory } = useQuery(
    'myBorrowingHistory',
    () => api.get('/api/borrowings/my-history'),
    {
      select: (response) => response.data.data
    }
  );

  if (isLoading || isLoadingHistory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-2">
            My Borrowings
          </h1>
          <p className="text-lg text-secondary-600">
            Track your current book borrowings and historical records.
          </p>
        </motion.div>

        {/* Current Borrowings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            Current Borrowings
          </h2>
          {borrowings && borrowings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {borrowings.map((borrowing, index) => (
                <motion.div
                  key={borrowing._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                          {borrowing.book?.coverImage ? (
                            <img src={borrowing.book.coverImage} alt={borrowing.book.title} className="object-cover w-full h-full rounded-lg" />
                          ) : (
                            <BookOpen className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-secondary-900">
                            {borrowing.book?.title}
                          </h3>
                          <p className="text-secondary-600">
                            by {borrowing.book?.author}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${borrowing.status === 'active' ? 'bg-blue-100 text-blue-800' : borrowing.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {borrowing.status}
                        </span>
                        <p className="text-sm text-secondary-600 mt-1">
                          Due: {new Date(borrowing.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                No Active Borrowings
              </h3>
              <p className="text-secondary-600 mb-4">
                You haven't borrowed any books yet.
              </p>
              <Button>Browse Books</Button>
            </Card>
          )}
        </motion.div>

        {/* Borrowing History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            Borrowing History
          </h2>
          {borrowingHistory && borrowingHistory.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {borrowingHistory.map((borrowing, index) => (
                <motion.div
                  key={borrowing._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                          {borrowing.book?.coverImage ? (
                            <img src={borrowing.book.coverImage} alt={borrowing.book.title} className="object-cover w-full h-full rounded-lg" />
                          ) : (
                            <BookOpen className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-secondary-900">
                            {borrowing.book?.title}
                          </h3>
                          <p className="text-secondary-600">
                            by {borrowing.book?.author}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${borrowing.status === 'returned' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {borrowing.status}
                        </span>
                        <p className="text-sm text-secondary-600 mt-1">
                          Borrowed: {new Date(borrowing.borrowedDate).toLocaleDateString()}
                        </p>
                        {borrowing.returnedDate && (
                          <p className="text-sm text-secondary-600 mt-1">
                            Returned: {new Date(borrowing.returnedDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                No Borrowing History
              </h3>
              <p className="text-secondary-600 mb-4">
                You have not borrowed any books yet.
              </p>
              <Button>Browse Books</Button>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MyBorrowings;

