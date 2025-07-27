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

echo "🚀 Starting simple server..."
echo "This will run without TypeScript compilation"

# Start the simple server
node server-simple.js