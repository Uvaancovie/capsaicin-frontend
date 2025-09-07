#!/bin/bash

# Capsaicin E-commerce Setup Script

echo "🌶️  Setting up Capsaicin E-commerce..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Setup Backend
echo "📦 Setting up backend..."
cd backend
if [ ! -f "package.json" ]; then
    echo "❌ Backend package.json not found!"
    exit 1
fi

npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend npm install failed!"
    exit 1
fi

echo "✅ Backend dependencies installed"

# Setup Frontend
echo "📦 Setting up frontend..."
cd ..
if [ ! -f "package.json" ]; then
    echo "❌ Frontend package.json not found!"
    exit 1
fi

npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend npm install failed!"
    exit 1
fi

echo "✅ Frontend dependencies installed"

# Check environment files
echo "🔧 Checking environment configuration..."

if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Creating from example..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > .env.local
fi

if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env not found. Creating from example..."
    cat > backend/.env << EOL
PORT=4000
MONGODB_URI=mongodb+srv://way2flyagency:way2flymillionaire@mern.7txgf4m.mongodb.net/capsaicin-ecommerce
NODE_ENV=development
EOL
fi

echo "✅ Environment files ready"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start development:"
echo "1. Backend:  cd backend && npm start"
echo "2. Frontend: npm run dev"
echo ""
echo "URLs:"
echo "- Frontend: http://localhost:3001"
echo "- Backend:  http://localhost:4000"
echo "- API Health: http://localhost:4000/health"
echo ""
echo "Admin Login:"
echo "- Username: admincapepharm"
echo "- Password: capepharm123$"
