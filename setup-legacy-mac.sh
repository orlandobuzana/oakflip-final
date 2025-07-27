#!/bin/bash

echo "🍎 Setting up Rest Express for older macOS systems..."

# Check if nvm is installed
if ! command -v nvm &> /dev/null; then
    echo "Installing nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    source ~/.bashrc
    source ~/.zshrc 2>/dev/null || true
fi

# Install and use Node.js 18
echo "Installing Node.js 18 (compatible with older systems)..."
nvm install 18
nvm use 18
nvm alias default 18

# Install dependencies
echo "Installing dependencies..."
npm install

# Try to install ts-node as backup
echo "Installing ts-node as tsx alternative..."
npm install --save-dev ts-node

# Test which method works
echo "Testing TypeScript execution methods..."

if npm run dev --dry-run 2>/dev/null; then
    echo "✅ tsx method works - you can use: npm run dev"
elif npm run dev:legacy --dry-run 2>/dev/null; then
    echo "✅ ts-node method works - you can use: npm run dev:legacy"
    echo "Consider updating package.json scripts to use ts-node"
else
    echo "⚠️  TypeScript execution issues detected"
    echo "Building to JavaScript as fallback..."
    npm run build
    echo "✅ Use: npm start (for pre-compiled JavaScript)"
fi

echo "🎉 Setup complete! Your e-commerce app is ready."
echo ""
echo "Available commands:"
echo "  npm run dev        - Development with tsx"
echo "  npm run dev:legacy - Development with ts-node"
echo "  npm run build      - Build to JavaScript"
echo "  npm start          - Run pre-compiled version"
echo ""
echo "Visit http://localhost:5000 when running!"