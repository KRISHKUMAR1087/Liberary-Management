import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from 'react-query';
import { ArrowLeft, BookOpen, User, Calendar, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BookDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();

  const { data: book, isLoading, refetch } = useQuery(
    ['book', id],
    () => api.get(`/api/books/${id}`),
    {
      select: (response) => response.data.data,
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Failed to fetch book details');
      }
    }
  );

  const borrowBookMutation = useMutation((bookId) => api.post(`/api/borrowings/${bookId}`),
    {
      onSuccess: () => {
        toast.success('Book borrowed successfully!');
        refetch(); // Refetch book details to update available copies
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Failed to borrow book');
      }
    }
  );

  const handleBorrow = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to borrow a book.');
      return;
    }
    borrowBookMutation.mutate(book._id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            Book not found
          </h2>
          <Link to="/books">
            <Button>Back to Books</Button>
          </Link>
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
        >
          <Link to="/books" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Books
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="p-6">
              <div className="aspect-[3/4] bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                {book.coverImage ? (
                  <img src={book.coverImage} alt={book.title} className="object-cover w-full h-full" />
                ) : (
                  <BookOpen className="w-24 h-24 text-primary-600" />
                )}
              </div>
              
              <div className="space-y-4">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleBorrow}
                  disabled={!isAuthenticated || book.availableCopies <= 0 || borrowBookMutation.isLoading}
                >
                  {borrowBookMutation.isLoading ? 'Borrowing...' : 'Borrow Book'}
                </Button>
                <Button variant="outline" className="w-full">
                  Add to Favorites
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="p-8">
              <h1 className="text-3xl font-bold text-secondary-900 mb-4">
                {book.title}
              </h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <User className="w-4 h-4 text-secondary-500 mr-2" />
                  <span className="text-secondary-600">{book.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-secondary-500 mr-2" />
                  <span className="text-secondary-600">{book.publishedYear}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-secondary-600">{book.rating?.average || 0}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-secondary-50 p-4 rounded-lg">
                  <p className="text-sm text-secondary-600">Category</p>
                  <p className="font-semibold text-secondary-900">{book.category}</p>
                </div>
                <div className="bg-secondary-50 p-4 rounded-lg">
                  <p className="text-sm text-secondary-600">Available</p>
                  <p className="font-semibold text-secondary-900">{book.availableCopies}</p>
                </div>
                <div className="bg-secondary-50 p-4 rounded-lg">
                  <p className="text-sm text-secondary-600">Total Copies</p>
                  <p className="font-semibold text-secondary-900">{book.totalCopies}</p>
                </div>
                <div className="bg-secondary-50 p-4 rounded-lg">
                  <p className="text-sm text-secondary-600">Pages</p>
                  <p className="font-semibold text-secondary-900">{book.pages || 'N/A'}</p>
                </div>
              </div>

              {book.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                    Description
                  </h3>
                  <p className="text-secondary-600 leading-relaxed">
                    {book.description}
                  </p>
                </div>
              )}

              <div className="border-t border-secondary-200 pt-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                  Book Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-secondary-600">ISBN</p>
                    <p className="font-medium text-secondary-900">{book.isbn}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-600">Publisher</p>
                    <p className="font-medium text-secondary-900">{book.publisher || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-600">Language</p>
                    <p className="font-medium text-secondary-900">{book.language}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-600">Borrowing Period</p>
                    <p className="font-medium text-secondary-900">{book.borrowingPeriod} days</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;

