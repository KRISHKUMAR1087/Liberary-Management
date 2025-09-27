const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Library Management System...\n');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  const envContent = `NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library_management
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure_${Date.now()}
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file');
} else {
  console.log('ℹ️ .env file already exists');
}

// Create public folder if it doesn't exist
const publicPath = path.join(__dirname, 'client', 'public');
if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath, { recursive: true });
  console.log('✅ Created public folder');
}

// Create index.html for client
const indexPath = path.join(publicPath, 'index.html');
const indexContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Modern Library Management System"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>Library Management System</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`;

if (!fs.existsSync(indexPath)) {
  fs.writeFileSync(indexPath, indexContent);
  console.log('✅ Created index.html');
}

// Create manifest.json
const manifestPath = path.join(publicPath, 'manifest.json');
const manifestContent = `{
  "short_name": "LibraryMS",
  "name": "Library Management System",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}`;

if (!fs.existsSync(manifestPath)) {
  fs.writeFileSync(manifestPath, manifestContent);
  console.log('✅ Created manifest.json');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Install dependencies: npm run install-all');
console.log('2. Start MongoDB service');
console.log('3. Seed the database: npm run seed');
console.log('4. Start the application: npm run dev');
console.log('\n🌐 The application will be available at:');
console.log('- Frontend: http://localhost:3000');
console.log('- Backend API: http://localhost:5000');
console.log('\n👤 Demo accounts:');
console.log('- Admin: admin@library.com / admin123');
console.log('- Student: student@library.com / student123');

