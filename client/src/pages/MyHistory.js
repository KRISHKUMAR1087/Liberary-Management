import React from 'react';
import { motion } from 'framer-motion';
import { History, BookOpen, AlertCircle } from 'lucide-react';
import { useQuery } from 'react-query';
import api from '../utils/api';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const MyHistory = () => {
  const { data: borrowingHistory, isLoading } = useQuery(
    'myBorrowingHistory',
    () => api.get('/api/borrowings/my-history'),
    {
      select: (response) => response.data.data,
    }
  );

  if (isLoading) {
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
            Borrowing History
          </h1>
          <p className="text-lg text-secondary-600">
            View your complete borrowing history.
          </p>
        </motion.div>

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
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center overflow-hidden">
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
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${borrowing.status === 'returned' ? 'bg-green-100 text-green-800' : borrowing.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
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
                      {borrowing.fineAmount > 0 && (
                        <p className="text-sm text-danger-600 mt-1">
                          Fine: ${borrowing.fineAmount} {borrowing.finePaid ? '(Paid)' : '(Unpaid)'}
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
            <History className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              No Borrowing History
            </h3>
            <p className="text-secondary-600 mb-4">
              You have not borrowed any books yet. Browse our collection to get started!
            </p>
            <Link to="/books">
              <Button>Browse Books</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyHistory;

