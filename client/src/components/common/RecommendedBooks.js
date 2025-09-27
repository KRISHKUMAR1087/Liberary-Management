import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import Card from './Card';
import LoadingSpinner from './LoadingSpinner';

const fetchRecommendedBooks = async () => {
  const { data } = await axios.get('/api/books/recommendations');
  return data.data;
};

export const RecommendedBooks = () => {
  const { data: recommendedBooks, isLoading, isError, error } = useQuery(
    'recommendedBooks',
    fetchRecommendedBooks
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  if (!recommendedBooks || recommendedBooks.length === 0) {
    return <div className="text-gray-600">No recommendations available. Borrow some books to get started!</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {recommendedBooks.map((book) => (
        <Card
          key={book._id}
          title={book.title}
          description={book.author}
          link={`/books/${book._id}`}
        >
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
        </Card>
      ))}
    </div>
  );
};

