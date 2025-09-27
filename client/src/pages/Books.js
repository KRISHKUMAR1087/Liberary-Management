import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List } from 'lucide-react';
import { useQuery, useMutation } from 'react-query';
import api from '../utils/api';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import toast from 'react-hot-toast'; // Import toast for notifications
import { Link } from 'react-router-dom'; // Import Link for navigation

const Books = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [viewMode, setViewMode] = useState('grid');

  const { isAuthenticated, user } = useAuth(); // Get isAuthenticated and user from AuthContext

  const { data: allBooks, isLoading: isLoadingAllBooks, refetch: refetchAllBooks } = useQuery(
    ['books', { search: searchTerm, category, sort: sortBy }],
    () => api.get('/api/books', {
      params: { search: searchTerm, category, sort: sortBy }
    }),
    {
      select: (response) => response.data.data
    }
  );

  // Placeholder for semester-specific books - assuming 'Science' category for now
  const { data: semesterBooks, isLoading: isLoadingSemesterBooks, refetch: refetchSemesterBooks } = useQuery(
    ['semesterBooks', { category: user?.currentSemesterCategory }],
    () => api.get('/api/books', {
      params: { category: user?.currentSemesterCategory, isSemesterStudy: true }
    }),
    {
      select: (response) => response.data.data,
      enabled: isAuthenticated && !!user?.currentSemesterCategory // Only fetch if user is authenticated and has a currentSemesterCategory
    }
  );

  const { data: categories } = useQuery(
    'categories',
    () => api.get('/api/books/categories'),
    {
      select: (response) => response.data.data
    }
  );

  // Mutation for borrowing a book
  const borrowBookMutation = useMutation(
    (bookId) => api.post(`/api/borrowings/${bookId}`),
    {
      onSuccess: () => {
        toast.success('Book borrowed successfully!');
        refetchAllBooks(); // Refetch all books to update available copies
        refetchSemesterBooks(); // Refetch semester books to update available copies
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to borrow book';
        toast.error(message);
      },
    }
  );

  const handleBorrow = (bookId) => {
    if (!isAuthenticated) {
      toast.error('Please log in to borrow a book.');
      return;
    }
    borrowBookMutation.mutate(bookId);
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
            Browse Books
          </h1>
          <p className="text-lg text-secondary-600">
            Discover our extensive collection of books across various categories.
          </p>
        </motion.div>

        {/* Semester Books Section */}
        {isAuthenticated && ( // Only show this section if authenticated
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">
              Books for Your Current Semester Study (e.g., Science)
            </h2>
            {isLoadingSemesterBooks ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="xl" />
              </div>
            ) : semesterBooks && semesterBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {semesterBooks.map((book, index) => (
                  <motion.div
                    key={book._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card hover className="p-4 h-full">
                      <div className="aspect-[3/4] bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                        {book.coverImage ? (
                          <img src={book.coverImage} alt={book.title} className="object-cover w-full h-full" />
                        ) : (
                          <div className="text-primary-600 text-4xl">📚</div>
                        )}
                      </div>
                      <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-sm text-secondary-600 mb-3">
                        by {book.author}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                          {book.category}
                        </span>
                        <span className="text-xs text-secondary-500">
                          {book.availableCopies} available
                        </span>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Link to={`/books/${book._id}`} className="flex-1">
                          <Button size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                        {isAuthenticated && book.availableCopies > 0 && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="flex-1"
                            onClick={() => handleBorrow(book._id)}
                            disabled={borrowBookMutation.isLoading}
                          >
                            {borrowBookMutation.isLoading ? 'Borrowing...' : 'Borrow'}
                          </Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  No books found for your current semester study.
                </h3>
                <p className="text-secondary-600 mb-4">
                  Try adjusting your search criteria or browse all books.
                </p>
              </Card>
            )}
          </motion.div>
        )}

        {/* All Books Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            All Books
          </h2>
          {isLoadingAllBooks ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="xl" />
            </div>
          ) : allBooks && allBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allBooks.map((book, index) => (
                <motion.div
                  key={book._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card hover className="p-4 h-full">
                    <div className="aspect-[3/4] bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="object-cover w-full h-full" />
                      ) : (
                        <div className="text-primary-600 text-4xl">📚</div>
                      )}
                    </div>
                    <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-sm text-secondary-600 mb-3">
                      by {book.author}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                        {book.category}
                      </span>
                      <span className="text-xs text-secondary-500">
                        {book.availableCopies} available
                      </span>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Link to={`/books/${book._id}`} className="flex-1">
                        <Button size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      {isAuthenticated && book.availableCopies > 0 && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="flex-1"
                          onClick={() => handleBorrow(book._id)}
                          disabled={borrowBookMutation.isLoading}
                        >
                          {borrowBookMutation.isLoading ? 'Borrowing...' : 'Borrow'}
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                No books found
              </h3>
              <p className="text-secondary-600 mb-4">
                Try adjusting your search criteria or browse all books.
              </p>
              <Button onClick={() => { setSearchTerm(''); setCategory(''); }}>
                Clear Filters
              </Button>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Books;

