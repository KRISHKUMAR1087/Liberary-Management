import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  BookOpen,
  History,
  AlertCircle,
  Library,
  ArrowRight,
  Eye
} from 'lucide-react';
import { useQuery } from 'react-query';
import api from '../../utils/api';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  // Fetch admin stats
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery(
    'adminStats',
    () => api.get('/api/admin/stats'),
    {
      select: (response) => response.data.data,
    }
  );

  // Fetch recent borrowings
  const { data: recentBorrowings, isLoading: recentBorrowingsLoading, error: recentBorrowingsError } = useQuery(
    'recentBorrowings',
    () => api.get('/api/admin/borrowings?limit=5'),
    {
      select: (response) => response.data.data,
    }
  );

  if (statsLoading || recentBorrowingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (statsError || recentBorrowingsError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-danger-600">
        Error loading dashboard: {statsError?.message || recentBorrowingsError?.message}
      </div>
    );
  }

  const adminStats = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      link: '/admin/users',
    },
    {
      title: 'Total Books',
      value: stats?.totalBooks || 0,
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
      link: '/admin/books',
    },
    {
      title: 'Total Borrowings',
      value: stats?.totalBorrowings || 0,
      icon: History,
      color: 'from-purple-500 to-purple-600',
      link: '/admin/borrowings',
    },
    {
      title: 'Overdue Books',
      value: stats?.overdueBooks || 0,
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      link: '/admin/borrowings?status=overdue',
    },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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
            Admin Dashboard
          </h1>
          <p className="text-lg text-secondary-600">
            Overview of your library system and key metrics.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {adminStats.map((stat, index) => {
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
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">Quick Links</h2>
              <div className="space-y-3">
                {[{
                  name: 'Manage Users',
                  icon: Users,
                  link: '/admin/users',
                  description: 'View and manage all user accounts.'
                },
                {
                  name: 'Manage Books',
                  icon: Library,
                  link: '/admin/books',
                  description: 'Add, edit, or remove books.'
                },
                {
                  name: 'Manage Borrowings',
                  icon: History,
                  link: '/admin/borrowings',
                  description: 'Oversee all borrowing activities.'
                },
                {
                  name: 'View Site',
                  icon: Eye,
                  link: '/',
                  description: 'Go to public site'
                }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.name} to={item.link}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center p-3 rounded-lg hover:bg-secondary-50 transition-colors duration-200"
                      >
                        <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center mr-3">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-secondary-900">{item.name}</p>
                          <p className="text-sm text-secondary-600">{item.description}</p>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Recent Borrowings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">Recent Borrowings</h2>
              {recentBorrowings && recentBorrowings.length > 0 ? (
                <div className="space-y-4">
                  {recentBorrowings.map((borrowing) => (
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
                            by {borrowing.user?.name}
                          </p>
                          <p className="text-sm text-secondary-600">
                            Borrowed on {formatDate(borrowing.borrowDate)}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${borrowing.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {borrowing.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                    No Recent Borrowings
                  </h3>
                  <p className="text-secondary-600">
                    All quiet on the borrowing front.
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Most Borrowed Books */}
        {stats?.mostBorrowedBooks && stats.mostBorrowedBooks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8"
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">Most Borrowed Books</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.mostBorrowedBooks.map((item) => (
                  <div key={item.book._id} className="flex items-center space-x-4 p-3 bg-secondary-50 rounded-lg">
                    <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center text-xl font-bold">
                      {item.count}
                    </div>
                    <div>
                      <h3 className="font-medium text-secondary-900">{item.book.title}</h3>
                      <p className="text-sm text-secondary-600">by {item.book.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

