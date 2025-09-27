export const BOOK_CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Science',
  'Technology',
  'History',
  'Biography',
  'Literature',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Medicine',
  'Art',
  'Music',
  'Philosophy',
  'Religion',
  'Business',
  'Economics',
  'Politics',
  'Education',
  'Other'
];

export const BORROWING_STATUS = {
  ACTIVE: 'active',
  RETURNED: 'returned',
  OVERDUE: 'overdue',
  LOST: 'lost'
};

export const USER_ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student'
};

export const SORT_OPTIONS = [
  { value: 'title', label: 'Title (A-Z)' },
  { value: 'author', label: 'Author (A-Z)' },
  { value: 'rating', label: 'Rating (High to Low)' },
  { value: 'publishedYear', label: 'Published Year (Newest)' },
  { value: 'createdAt', label: 'Recently Added' }
];

export const BORROWING_LIMIT = 5;
export const DEFAULT_BORROWING_PERIOD = 14; // days
export const DEFAULT_FINE_PER_DAY = 5; // dollars

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    ME: '/api/auth/me',
    LOGOUT: '/api/auth/logout',
    UPDATE_DETAILS: '/api/auth/updatedetails',
    UPDATE_PASSWORD: '/api/auth/updatepassword'
  },
  BOOKS: {
    LIST: '/api/books',
    DETAIL: (id) => `/api/books/${id}`,
    CREATE: '/api/books',
    UPDATE: (id) => `/api/books/${id}`,
    DELETE: (id) => `/api/books/${id}`,
    CATEGORIES: '/api/books/categories',
    POPULAR: '/api/books/popular',
    SEARCH: '/api/books/search',
    REVIEW: (id) => `/api/books/${id}/reviews`,
    HISTORY: (id) => `/api/books/${id}/history`
  },
  BORROWINGS: {
    LIST: '/api/borrowings',
    MY_BORROWINGS: '/api/borrowings/my-borrowings',
    MY_HISTORY: '/api/borrowings/my-history',
    OVERDUE: '/api/borrowings/overdue',
    STATS: '/api/borrowings/stats',
    DETAIL: (id) => `/api/borrowings/${id}`,
    BORROW: '/api/borrowings',
    RETURN: (id) => `/api/borrowings/${id}/return`,
    RENEW: (id) => `/api/borrowings/${id}/renew`,
    UPDATE: (id) => `/api/borrowings/${id}`,
    DELETE: (id) => `/api/borrowings/${id}`
  }
};

export const COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  }
};

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500
};

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

