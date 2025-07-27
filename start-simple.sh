#!/bin/bash

echo "🍎 Starting Rest Express - Simple Version for macOS Big Sur"
echo "This version uses only Node.js built-in features - no TypeScript, no tsx, no complex dependencies"

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js from https://nodejs.org"
    echo "   For Big Sur, use Node.js 16 or 18 LTS versions"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Found Node.js $NODE_VERSION"

# Install minimal dependencies
echo "📦 Installing minimal dependencies..."
if [ -f "package-simple.json" ]; then
    cp package-simple.json package.json
fi

npm install express --save

echo "🚀 Starting simple server with frontend..."
echo "This will run without TypeScript compilation"
echo ""

# Kill any existing Node processes on port 5000
echo "🔄 Stopping any existing servers..."
pkill -f "tsx server" 2>/dev/null || true
pkill -f "node server" 2>/dev/null || true
sleep 2

echo "The application will be available at:"
echo "  🌐 Frontend: http://localhost:5000"
echo "  🔑 Admin Panel: http://localhost:5000/admin (password: admin123)"
echo "  🔌 API: http://localhost:5000/api/products"
echo ""

# Start the simple server (CommonJS version for compatibility)
PORT=5000 node server-simple.cjs