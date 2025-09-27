TEAM DETAILS :- 

TL = 24DCE027 , KRISHKUMAR DARJI

TM 1 = 24DCE030, HARSHIL DESAI

TM 2 = 24DCE004, ASHITI AGATH

TM 3 = 24DCE042, JENSHI GHORI

RUN SERVER BEFORE STARTING WEBSITE 

RUN COMMANDS :- 
npm install

client/ :- npm install

mian folder:- npm run dev

**WORKIG URL OF WEBSITE :- https://68d7d59c1814c89961a215ba--fanciful-unicorn-ae2aa0.netlify.app/**


# Library Management System

A modern, full-stack library management system built with React, Node.js, Express, and MongoDB. Features beautiful UI/UX with animations, comprehensive book management, borrowing system, and admin controls.

## 🚀 Features

### For Students
- **User Registration & Authentication** - Secure login with JWT tokens
- **Book Browsing** - Search and filter books by category, author, title
- **Book Borrowing** - Borrow books with automatic due date calculation
- **My Borrowings** - Track current borrowings and due dates
- **Borrowing History** - View complete borrowing history
- **Profile Management** - Update personal information and settings

### For Administrators
- **Admin Dashboard** - Overview of library statistics and activities
- **Book Management** - Add, edit, delete books with full details
- **User Management** - Manage student accounts and permissions
- **Borrowing Management** - Monitor all borrowing activities
- **Overdue Tracking** - Track overdue books and calculate fines
- **Analytics** - View borrowing statistics and popular books

### System Features
- **Real-time Updates** - Live status updates for borrowings
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Modern UI/UX** - Beautiful interface with smooth animations
- **Secure Authentication** - JWT-based authentication with role-based access
- **Data Validation** - Comprehensive input validation and error handling
- **Search & Filter** - Advanced search and filtering capabilities

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling and validation
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## 🚀 Installation & Setup

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd library-management-system
\`\`\`

### 2. Install Dependencies

#### Install Backend Dependencies
\`\`\`bash
npm install
\`\`\`

#### Install Frontend Dependencies
\`\`\`bash
cd client
npm install
cd ..
\`\`\`

### 3. Environment Configuration

Create a \`.env\` file in the root directory:

\`\`\`env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library_management
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
\`\`\`

**Important:** Replace \`your_super_secret_jwt_key_here_make_it_long_and_secure\` with a strong, random secret key.

### 4. Database Setup

#### Start MongoDB
Make sure MongoDB is running on your system:

**Windows:**
\`\`\`bash
net start MongoDB
\`\`\`

**macOS:**
\`\`\`bash
brew services start mongodb-community
\`\`\`

**Linux:**
\`\`\`bash
sudo systemctl start mongod
\`\`\`

#### Seed the Database (Optional)
\`\`\`bash
npm run seed
\`\`\`

### 5. Start the Application

#### Development Mode (Both Frontend & Backend)
\`\`\`bash
npm run dev
\`\`\`

This will start:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:3000

#### Start Only Backend
\`\`\`bash
npm run server
\`\`\`

#### Start Only Frontend
\`\`\`bash
npm run client
\`\`\`

## 📱 Usage

### 1. Access the Application
Open your browser and navigate to http://localhost:3000

### 2. Demo Accounts
The system comes with pre-configured demo accounts:

**Admin Account:**
- Email: `admin@gmail.com`
- Password: `admin@1234`

**Student Account:**
- Email: `student@gmail.com`
- Password: `student@1234`

### 3. Getting Started

#### For Students:
1. Register a new account or use the demo student account
2. Browse the book collection
3. Borrow books and track due dates
4. Manage your borrowing history

#### For Administrators:
1. Use the admin demo account
2. Access the admin dashboard
3. Manage books and users
4. Monitor borrowing activities

## 🗂️ Project Structure

\`\`\`
library-management-system/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── utils/         # Utility functions
│   │   └── App.js         # Main App component
│   ├── package.json
│   └── tailwind.config.js
├── server/                # Express backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   └── index.js          # Server entry point
├── config.js             # Configuration
├── package.json          # Root package.json
└── README.md
\`\`\`

## 🔧 API Endpoints

### Authentication
- \`POST /api/auth/register\` - Register new user
- \`POST /api/auth/login\` - Login user
- \`GET /api/auth/me\` - Get current user
- \`GET /api/auth/logout\` - Logout user

### Books
- \`GET /api/books\` - Get all books
- \`GET /api/books/:id\` - Get book by ID
- \`POST /api/books\` - Create book (Admin only)
- \`PUT /api/books/:id\` - Update book (Admin only)
- \`DELETE /api/books/:id\` - Delete book (Admin only)

### Borrowings
- \`GET /api/borrowings\` - Get all borrowings (Admin only)
- \`GET /api/borrowings/my-borrowings\` - Get user's borrowings
- \`POST /api/borrowings\` - Borrow a book
- \`PUT /api/borrowings/:id/return\` - Return a book

## 🎨 UI/UX Features

- **Responsive Design** - Optimized for all screen sizes
- **Dark/Light Mode** - Automatic theme switching
- **Smooth Animations** - Framer Motion powered transitions
- **Loading States** - Beautiful loading spinners and skeletons
- **Error Handling** - User-friendly error messages
- **Toast Notifications** - Real-time feedback
- **Interactive Components** - Hover effects and micro-interactions

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt password encryption
- **Input Validation** - Comprehensive data validation
- **Rate Limiting** - API rate limiting protection
- **CORS Configuration** - Cross-origin request handling
- **Security Headers** - Helmet.js security headers

## 🧪 Testing

### Run Tests
\`\`\`bash
# Run frontend tests
cd client
npm test

# Run backend tests
npm test
\`\`\`

# Run Website
npm run dev

## 📦 Production Build

### Build Frontend
\`\`\`bash
cd client
npm run build
\`\`\`

### Start Production Server
\`\`\`bash
NODE_ENV=production npm start
\`\`\`

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: \`cd client && npm run build\`
2. Deploy the \`build\` folder to your hosting service
3. Update API URLs in production

### Backend Deployment (Heroku/DigitalOcean)
1. Set environment variables in your hosting platform
2. Ensure MongoDB is accessible (MongoDB Atlas recommended)
3. Deploy the server code

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: \`git checkout -b feature-name\`
3. Commit changes: \`git commit -am 'Add feature'\`
4. Push to branch: \`git push origin feature-name\`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](link-to-issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for smooth animations
- MongoDB team for the database solution
- All contributors and testers

---


