import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { format, isPast } from 'date-fns';
import { History, BookOpen, User as UserIcon } from 'lucide-react';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AdminBorrowings = () => {
  const { data: borrowings, isLoading, isError, error } = useQuery(
    'allBorrowings',
    () => api.get('/api/borrowings'),
    {
      select: (response) => response.data.data,
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Failed to fetch all borrowings');
      }
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-secondary-600">{error?.response?.data?.message || 'Failed to load borrowings.'}</p>
        </Card>
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
            Manage Borrowings
          </h1>
          <p className="text-lg text-secondary-600">
            Monitor and manage all borrowing activities.
          </p>
        </motion.div>

        {borrowings.length === 0 ? (
          <Card className="p-12 text-center">
            <History className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              No Borrowing Records Found
            </h3>
            <p className="text-secondary-600">
              There are no borrowing activities to display at the moment.
            </p>
          </Card>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrowed Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  {/* Add more headers if needed */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {borrowings.map((borrowing) => (
                  <tr key={borrowing._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-primary-500" />
                      {borrowing.book?.title} by {borrowing.book?.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-700 flex items-center">
                      <UserIcon className="w-5 h-5 mr-2 text-blue-500" />
                      {borrowing.user?.name} ({borrowing.user?.email})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-700">
                      {borrowing.borrowedDate ? format(new Date(borrowing.borrowedDate), 'MMM d, yyyy HH:mm') : 'N/A'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isPast(new Date(borrowing.dueDate)) && borrowing.status !== 'returned' ? 'text-red-600 font-semibold' : 'text-secondary-700'}`}>
                      {borrowing.dueDate ? format(new Date(borrowing.dueDate), 'MMM d, yyyy') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${borrowing.status === 'active' ? 'bg-green-100 text-green-800' : borrowing.status === 'returned' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                        {borrowing.status}
                      </span>
                    </td>
                    {/* Add more cells for actions or other details if needed */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBorrowings;

