import React from 'react';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { UserCircle, Mail, Phone, MapPin, Calendar, BookOpen } from 'lucide-react';

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="xl" /></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">Not Logged In</h2>
          <p className="text-secondary-600">Please log in to view your profile.</p>
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
          <h1 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-2">User Profile</h1>
          <p className="text-lg text-secondary-600">View and manage your personal information.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="p-8 flex flex-col items-center text-center">
              <UserCircle className="w-24 h-24 text-primary-600 mb-4" />
              <h2 className="text-2xl font-bold text-secondary-900 mb-2">{user.name}</h2>
              <p className="text-secondary-600 text-lg mb-4">{user.role === 'admin' ? 'Administrator' : 'Student'}</p>
              {user.studentId && (
                <p className="text-sm text-secondary-500 mb-2">Student ID: {user.studentId}</p>
              )}
              {user.collegeName && (
                <p className="text-sm text-secondary-500 mb-2">College: {user.collegeName}</p>
              )}
              {user.department && (
                <p className="text-sm text-secondary-500 mb-2">Department: {user.department}</p>
              )}
              {user.currentSemester && (
                <p className="text-sm text-secondary-500 mb-2">Current Semester: {user.currentSemester}</p>
              )}
              <div className="mt-4 space-y-2 text-left w-full">
                <div className="flex items-center text-secondary-700">
                  <Mail className="w-5 h-5 mr-3 text-primary-500" />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center text-secondary-700">
                    <Phone className="w-5 h-5 mr-3 text-primary-500" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.address && (
                  <div className="flex items-center text-secondary-700">
                    <MapPin className="w-5 h-5 mr-3 text-primary-500" />
                    <span>{user.address}</span>
                  </div>
                )}
                {user.currentSemesterCategory && (
                  <div className="flex items-center text-secondary-700">
                    <BookOpen className="w-5 h-5 mr-3 text-primary-500" />
                    <span>Current Semester Study: {user.currentSemesterCategory}</span>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Additional Info / Actions (Right Column) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 space-y-8"
          >
            <Card className="p-8">
              <h3 className="text-xl font-bold text-secondary-900 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-secondary-700">
                <div>
                  <p className="text-sm text-secondary-600">Account Created</p>
                  <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary-600">Last Updated</p>
                  <p className="font-medium">{new Date(user.updatedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary-600">Status</p>
                  <p className={`font-medium ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>{user.isActive ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            </Card>

            {user.role === 'student' && (
              <Card className="p-8">
                <h3 className="text-xl font-bold text-secondary-900 mb-4">Borrowing Summary</h3>
                {/* This section would fetch and display actual borrowing summary, e.g., total borrowed, overdue, etc. */}
                <p className="text-secondary-600">Quick overview of your borrowing activities will be shown here.</p>
              </Card>
            )}

            {user.role === 'admin' && (
              <Card className="p-8">
                <h3 className="text-xl font-bold text-secondary-900 mb-4">Admin Tools</h3>
                <p className="text-secondary-600">Links to user management, book management, and borrowing statistics.</p>
              </Card>
            )}

            {/* Actions: Edit Profile, Change Password (can be added later) */}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

