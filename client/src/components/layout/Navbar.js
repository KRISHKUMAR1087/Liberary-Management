import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
  Home,
  Library,
  History,
  Settings,
  Users,
  BarChart3,
  Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Books', href: '/books', icon: Library },
    { name: 'My Borrowings', href: '/my-borrowings', icon: BookOpen },
    { name: 'History', href: '/my-history', icon: History },
  ];

  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Manage Books', href: '/admin/books', icon: Library },
    { name: 'Manage Users', href: '/admin/users', icon: Users },
    { name: 'Manage Borrowings', href: '/admin/borrowings', icon: History },
  ];

  const isActivePath = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white shadow-soft border-b border-secondary-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center"
            >
              <BookOpen className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold text-gradient">
              LibraryMS
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActivePath(item.href)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-secondary-700 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
              
              {user?.role === 'admin' && (
                <div className="relative group">
                  <button className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-secondary-700 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200">
                    Admin
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-medium border border-secondary-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {adminNavigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center px-4 py-2 text-sm hover:bg-primary-50 transition-colors duration-200 ${
                            isActivePath(item.href) ? 'text-primary-700 bg-primary-50' : 'text-secondary-700'
                          }`}
                        >
                          <Icon className="w-4 h-4 mr-3" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            {isAuthenticated && (
              <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200">
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Profile/Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary-50 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden md:block text-sm font-medium text-secondary-700">
                    {user?.name}
                  </span>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-medium border border-secondary-200"
                    >
                      <div className="p-4 border-b border-secondary-200">
                        <p className="text-sm font-medium text-secondary-900">{user?.name}</p>
                        <p className="text-xs text-secondary-600">{user?.email}</p>
                        {user?.studentId && (
                          <p className="text-xs text-secondary-600">ID: {user.studentId}</p>
                        )}
                      </div>
                      <div className="p-2">
                        <Link
                          to="/profile"
                          className="flex items-center px-3 py-2 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors duration-200"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Profile Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-3 py-2 text-sm text-danger-600 hover:bg-danger-50 rounded-lg transition-colors duration-200"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            {isAuthenticated && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-secondary-200"
            >
              <div className="py-4 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        isActivePath(item.href)
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-secondary-700 hover:text-primary-600 hover:bg-primary-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
                
                {user?.role === 'admin' && (
                  <div className="pt-2 border-t border-secondary-200">
                    <p className="px-3 py-2 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                      Admin
                    </p>
                    {adminNavigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            isActivePath(item.href)
                              ? 'bg-primary-100 text-primary-700'
                              : 'text-secondary-700 hover:text-primary-600 hover:bg-primary-50'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Icon className="w-4 h-4 mr-3" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;

