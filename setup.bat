@echo off
echo 🌶️  Setting up Capsaicin E-commerce...

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version

:: Setup Backend
echo 📦 Setting up backend...
cd backend

if not exist "package.json" (
    echo ❌ Backend package.json not found!
    pause
    exit /b 1
)

call npm install
if %errorlevel% neq 0 (
    echo ❌ Backend npm install failed!
    pause
    exit /b 1
)

echo ✅ Backend dependencies installed

:: Setup Frontend
echo 📦 Setting up frontend...
cd ..

if not exist "package.json" (
    echo ❌ Frontend package.json not found!
    pause
    exit /b 1
)

call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend npm install failed!
    pause
    exit /b 1
)

echo ✅ Frontend dependencies installed

:: Check environment files
echo 🔧 Checking environment configuration...

if not exist ".env.local" (
    echo ⚠️  .env.local not found. Creating from example...
    echo NEXT_PUBLIC_API_URL=http://localhost:4000 > .env.local
)

if not exist "backend\.env" (
    echo ⚠️  backend\.env not found. Creating from example...
    (
    echo PORT=4000
    echo MONGODB_URI=mongodb+srv://way2flyagency:way2flymillionaire@mern.7txgf4m.mongodb.net/capsaicin-ecommerce
    echo NODE_ENV=development
    ) > backend\.env
)

echo ✅ Environment files ready

echo.
echo 🎉 Setup complete!
echo.
echo To start development:
echo 1. Backend:  cd backend ^&^& npm start
echo 2. Frontend: npm run dev
echo.
echo URLs:
echo - Frontend: http://localhost:3001
echo - Backend:  http://localhost:4000
echo - API Health: http://localhost:4000/health
echo.
echo Admin Login:
echo - Username: admincapepharm
echo - Password: capepharm123$
echo.
pause
