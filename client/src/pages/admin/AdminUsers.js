import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, ChevronRight, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from 'react-query'; // Import useQueryClient
import api from '../../utils/api';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const queryClient = useQueryClient();

  const { data: users, isLoading: usersLoading, error: usersError } = useQuery(
    'users',
    () => api.get('/api/admin/users'),
    {
      select: (response) => response.data.data,
    }
  );

  const { data: userBorrowings, isLoading: borrowingsLoading, error: borrowingsError } = useQuery(
    ['userBorrowings', selectedUser?._id],
    () => api.get(`/api/admin/borrowings/user/${selectedUser._id}`),
    {
      enabled: !!selectedUser?._id,
      select: (response) => response.data.data,
    }
  );

  const returnBookMutation = useMutation(
    (borrowingId) => api.put(`/api/admin/borrowings/${borrowingId}/return`),
    {
      onSuccess: () => {
        toast.success('Book returned successfully!');
        queryClient.invalidateQueries(['userBorrowings', selectedUser._id]);
        queryClient.invalidateQueries('users'); // Invalidate users to update their borrowing stats if any
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to return book');
      },
    }
  );

  const handleReturnBook = (borrowingId) => {
    returnBookMutation.mutate(borrowingId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'overdue':
        return 'text-red-600 bg-red-100';
      case 'returned':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-secondary-600 bg-secondary-100';
    }
  };

  if (usersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-danger-600">
        Error loading users: {usersError.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-2">
            Manage Users
          </h1>
          <p className="text-lg text-secondary-600">
            View all user accounts and their borrowing history.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Users List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">All Users</h2>
              <div className="space-y-3">
                {users.length > 0 ? (
                  users.map((userItem) => (
                    <div
                      key={userItem._id}
                      onClick={() => setSelectedUser(userItem)}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-200
                        ${selectedUser?._id === userItem._id ? 'bg-primary-100 text-primary-700' : 'hover:bg-secondary-50 text-secondary-700'}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {userItem.name.charAt(0)}
                        </div>
                        <span>{userItem.name}</span>
                      </div>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  ))
                ) : (
                  <p className="text-secondary-600 text-center">No users found.</p>
                )}
              </div>
            </Card>
          </motion.div>

          {/* User Borrowings Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            {selectedUser ? (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-secondary-900">Borrowings for {selectedUser.name}</h2>
                </div>

                {borrowingsLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : borrowingsError ? (
                  <div className="text-danger-600 text-center py-8">
                    Error loading borrowings: {borrowingsError.message}
                  </div>
                ) : userBorrowings && userBorrowings.length > 0 ? (
                  <div className="space-y-4">
                    {userBorrowings.map((borrowing) => (
                      <motion.div
                        key={borrowing._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium text-secondary-900">
                              {borrowing.book?.title}
                            </h3>
                            <p className="text-sm text-secondary-600">
                              Borrowed on {formatDate(borrowing.borrowDate)}
                            </p>
                            <p className="text-sm text-secondary-600">
                              Due on {formatDate(borrowing.dueDate)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(borrowing.status)}`}>
                            {borrowing.status}
                          </span>
                          {borrowing.status === 'active' && (
                            <Button
                              size="sm"
                              variant="danger"
                              className="mt-2"
                              onClick={() => handleReturnBook(borrowing._id)}
                              disabled={returnBookMutation.isLoading}
                            >
                              {returnBookMutation.isLoading ? <Loader2 className="animate-spin mr-2" /> : null} Return Book
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
                    <p className="text-secondary-600 mb-4">
                      {selectedUser.name} has no active borrowings.
                    </p>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="p-12 text-center">
                <Users className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  Select a User
                </h3>
                <p className="text-secondary-600">
                  Click on a user from the list to view their borrowing details.
                </p>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;

