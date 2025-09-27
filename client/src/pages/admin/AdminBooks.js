import React from 'react';
import { motion } from 'framer-motion';
import { Library } from 'lucide-react';
import Card from '../../components/common/Card';

const AdminBooks = () => {
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
            Manage Books
          </h1>
          <p className="text-lg text-secondary-600">
            Add, edit, and manage your book collection.
          </p>
        </motion.div>

        <Card className="p-12 text-center">
          <Library className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-secondary-900 mb-2">
            Book Management Coming Soon
          </h3>
          <p className="text-secondary-600">
            Advanced book management features will be available here.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default AdminBooks;

