import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, BookOpen, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    trigger,
    setValue // Import setValue from useForm
  } = useForm();

  const onSubmit = async (data) => {
    // Manually trigger validation for all fields
    const isValid = await trigger();
    if (!isValid) {
      return; // If validation fails, stop submission
    }

    const result = await login(data.email, data.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError('root', { message: result.message });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center"
            >
              <BookOpen className="w-7 h-7 text-white" />
            </motion.div>
            <span className="text-2xl font-bold text-gradient">
              LibraryMS
            </span>
          </Link>
          <p className="text-secondary-600 mt-2">Sign in to your account</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                icon={Mail}
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />

              {/* Password Field */}
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  icon={Lock}
                  error={errors.password?.message}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-secondary-700">Remember me</span>
                </label>
                <Link
                  to="#"
                  className="text-sm text-primary-600 hover:text-primary-700 transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error Message */}
              {errors.root && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-danger-50 border border-danger-200 rounded-lg p-3"
                >
                  <p className="text-danger-600 text-sm">{errors.root.message}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                fullWidth
                loading={loading}
                disabled={loading}
              >
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-secondary-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-secondary-500">Or continue with</span>
                </div>
              </div>
            </div>

            {/* Demo Accounts */}
            <div className="mt-6 space-y-3">
              <p className="text-sm text-secondary-600 text-center">
                Try with demo accounts:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Set demo admin credentials using setValue
                    setValue('email', 'admin@gmail.com');
                    setValue('password', 'admin@1234');
                  }}
                >
                  Admin Demo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Set demo student credentials using setValue
                    setValue('email', 'student@gmail.com');
                    setValue('password', 'student@1234');
                  }}
                >
                  Student Demo
                </Button>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-secondary-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-secondary-500 mb-4">
            Join thousands of users who trust our library management system
          </p>
          <div className="flex justify-center space-x-6 text-xs text-secondary-400">
            <span>✓ Secure Authentication</span>
            <span>✓ Real-time Tracking</span>
            <span>✓ Mobile Friendly</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

