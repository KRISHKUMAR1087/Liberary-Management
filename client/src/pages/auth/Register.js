import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, BookOpen, Mail, Lock, User, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

const Register = () => {
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    const result = await registerUser(data);
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
          <p className="text-secondary-600 mt-2">Create your account</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                icon={User}
                error={errors.name?.message}
                {...register('name', {
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  },
                  maxLength: {
                    value: 50,
                    message: 'Name cannot exceed 50 characters'
                  }
                })}
              />

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

              {/* Phone Field */}
              <Input
                label="Phone Number"
                type="tel"
                placeholder="Enter your phone number"
                icon={Phone}
                error={errors.phone?.message}
                {...register('phone', {
                  pattern: {
                    value: /^[\+]?[1-9][\d]{0,15}$/,
                    message: 'Invalid phone number'
                  }
                })}
              />

              {/* Address Field */}
              <Input
                label="Address"
                type="text"
                placeholder="Enter your address"
                icon={MapPin}
                error={errors.address?.message}
                {...register('address', {
                  maxLength: {
                    value: 200,
                    message: 'Address cannot exceed 200 characters'
                  }
                })}
              />

              {/* Role Selection - Removed for default student registration */}

              {/* Password Field */}
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  icon={Lock}
                  error={errors.password?.message}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
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

              {/* Confirm Password Field */}
              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  icon={Lock}
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value =>
                      value === password || 'Passwords do not match'
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500 mt-1"
                  {...register('agreeTerms', {
                    required: 'You must agree to the terms and conditions'
                  })}
                />
                <label className="ml-2 text-sm text-secondary-700">
                  I agree to the{' '}
                  <Link to="#" className="text-primary-600 hover:text-primary-700">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="#" className="text-primary-600 hover:text-primary-700">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreeTerms && (
                <p className="error-message">{errors.agreeTerms.message}</p>
              )}

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
                Create Account
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-secondary-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                >
                  Sign in here
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
            Join our community and start managing your library experience
          </p>
          <div className="flex justify-center space-x-6 text-xs text-secondary-400">
            <span>✓ Free Registration</span>
            <span>✓ Instant Access</span>
            <span>✓ 24/7 Support</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;

