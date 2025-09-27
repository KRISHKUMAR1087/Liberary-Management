import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Clock,
  TrendingUp,
  AlertCircle,
  Plus,
  Search,
  History,
  Star,
  Calendar,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useQuery } from 'react-query';
import api from '../utils/api';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { RecommendedBooks } from '../components/common/RecommendedBooks'; // Import RecommendedBooks

const Dashboard = () => {
  const { user } = useAuth();

  // Fetch user's borrowings
  const { data: borrowingsData, isLoading: borrowingsLoading } = useQuery(
    'myBorrowings',
    () => api.get('/api/borrowings/my-borrowings'),
    {
      select: (response) => response.data.data
    }
  );

  // Fetch popular books
  const { data: popularBooks, isLoading: booksLoading } = useQuery(
    'popularBooks',
    () => api.get('/api/books/popular'),
    {
      select: (response) => response.data.data
    }
  );

  // Fetch overdue books
  const { data: overdueBooks, isLoading: overdueLoading } = useQuery(
    'overdueBooks',
    () => api.get('/api/borrowings/overdue'),
    {
      select: (response) => response.data.data,
      enabled: user?.role === 'admin'
    }
  );

  const stats = [
    {
      title: 'Books Borrowed',
      value: borrowingsData?.length || 0,
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      link: '/my-borrowings'
    },
    {
      title: 'Overdue Books',
      value: borrowingsData?.filter(b => b.status === 'overdue').length || 0,
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      link: '/my-borrowings'
    },
    {
      title: 'Total History',
      value: 'Coming Soon',
      icon: History,
      color: 'from-green-500 to-green-600',
      link: '/my-history'
    },
    {
      title: 'Favorites',
      value: 'Coming Soon',
      icon: Star,
      color: 'from-yellow-500 to-yellow-600',
      link: '/books'
    }
  ];

  const quickActions = [
    {
      title: 'Browse Books',
      description: 'Explore our extensive collection',
      icon: Search,
      link: '/books',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'My Borrowings',
      description: 'View your current borrowings',
      icon: BookOpen,
      link: '/my-borrowings',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Borrowing History',
      description: 'Check your past activities',
      icon: History,
      link: '/my-history',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Profile Settings',
      description: 'Manage your account',
      icon: User,
      link: '/profile',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  if (borrowingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-lg text-secondary-600">
            Here's what's happening with your library account today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={stat.link}>
                  <Card hover className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-secondary-600 mb-1">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-secondary-900">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.title} to={action.link}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center p-3 rounded-lg hover:bg-secondary-50 transition-colors duration-200"
                      >
                        <div className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mr-3`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-secondary-900">
                            {action.title}
                          </p>
                          <p className="text-sm text-secondary-600">
                            {action.description}
                          </p>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Current Borrowings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-secondary-900">
                  Current Borrowings
                </h2>
                <Link to="/my-borrowings">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>

              {borrowingsLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="lg" />
                </div>
              ) : borrowingsData && borrowingsData.length > 0 ? (
                <div className="space-y-4">
                  {borrowingsData.slice(0, 3).map((borrowing) => (
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
                            by {borrowing.book?.author}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(borrowing.status)}`}>
                          {borrowing.status}
                        </span>
                        <p className="text-sm text-secondary-600 mt-1">
                          Due: {formatDate(borrowing.dueDate)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                  <p className="text-secondary-600 mb-4">
                    You haven't borrowed any books yet.
                  </p>
                  <Link to="/books">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Browse Books
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Popular Books */}
        {!booksLoading && popularBooks && popularBooks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-secondary-900">
                  Popular Books
                </h2>
                <Link to="/books">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularBooks.slice(0, 3).map((book) => (
                  <Link key={book._id} to={`/books/${book._id}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-secondary-900 truncate">
                            {book.title}
                          </h3>
                          <p className="text-sm text-secondary-600 truncate">
                            by {book.author}
                          </p>
                          <div className="flex items-center mt-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-secondary-600 ml-1">
                              {book.rating?.average || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Recommended Books */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">
              Recommended Books
            </h2>
            <RecommendedBooks />
          </Card>
        </motion.div>

        {/* Admin Overdue Books */}
        {user?.role === 'admin' && !overdueLoading && overdueBooks && overdueBooks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-secondary-900 flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  Overdue Books
                </h2>
                <Link to="/admin/borrowings">
                  <Button variant="outline" size="sm">
                    Manage All
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {overdueBooks.slice(0, 3).map((borrowing) => (
                  <motion.div
                    key={borrowing._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-secondary-900">
                          {borrowing.book?.title}
                        </h3>
                        <p className="text-sm text-secondary-600">
                          Borrowed by {borrowing.user?.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-red-600 font-medium">
                        Overdue: {borrowing.fineAmount ? `$${borrowing.fineAmount}` : '$0'}
                      </p>
                      <p className="text-xs text-secondary-600">
                        Due: {formatDate(borrowing.dueDate)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

