import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Users,
  Clock,
  Star,
  ArrowRight,
  Search,
  TrendingUp,
  Shield,
  Zap,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: 'Extensive Book Collection',
      description: 'Access thousands of books across various categories and genres.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Users,
      title: 'User-Friendly Interface',
      description: 'Intuitive design that makes borrowing and returning books effortless.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Clock,
      title: 'Real-time Tracking',
      description: 'Track your borrowings, due dates, and fines in real-time.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security measures.',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Zap,
      title: 'Fast & Efficient',
      description: 'Quick book search, instant borrowing, and streamlined processes.',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: Globe,
      title: 'Accessible Anywhere',
      description: 'Access your library account from any device, anywhere.',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Books Available' },
    { number: '5,000+', label: 'Active Users' },
    { number: '50,000+', label: 'Books Borrowed' },
    { number: '99.9%', label: 'Uptime' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Computer Science Student',
      content: 'The new library system has made borrowing books so much easier. I can search, reserve, and manage everything online.',
      rating: 5
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Professor',
      content: 'As an admin, the management tools are incredibly powerful. I can track all borrowing activities and manage the collection efficiently.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Literature Student',
      content: 'The book recommendations and search features are amazing. I\'ve discovered so many great books I wouldn\'t have found otherwise.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Welcome to the
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  Future of Library
                </span>
                Management
              </h1>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                Discover, borrow, and manage books with our modern, user-friendly library management system. 
                Built for students, by students, with administrators in mind.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard">
                      <Button size="lg" className="bg-white text-primary-700 hover:bg-primary-50">
                        Go to Dashboard
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                    <Link to="/books">
                      <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-700">
                        Browse Books
                        <Search className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register">
                      <Button size="lg" className="bg-white text-primary-700 hover:bg-primary-50">
                        Get Started
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-700">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-white font-medium">System Online</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {stats[0].number} Books Available
                    </div>
                    <div className="text-primary-200">
                      {stats[1].number} Active Users
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-secondary-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              Why Choose Our Library System?
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              We've built a comprehensive solution that addresses all your library management needs 
              with cutting-edge technology and user-centered design.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card hover className="h-full">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-secondary-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what students and administrators are saying about our system.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-secondary-600 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-secondary-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-secondary-500">
                      {testimonial.role}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Library Experience?
            </h2>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Join thousands of students and administrators who are already using our modern library management system.
            </p>
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-primary-700 hover:bg-primary-50">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-700">
                    Sign In to Continue
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

