#!/bin/bash

# Rest Express E-commerce Testing Script
# This script runs all tests for the e-commerce application

echo "🧪 Rest Express E-commerce Test Suite"
echo "====================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Checking project dependencies..."

# Install test dependencies if not already installed
if [ ! -d "node_modules" ]; then
    print_status "Installing project dependencies..."
    npm install
fi

# Install test-specific dependencies
print_status "Installing test dependencies..."
npm install --save-dev jest supertest @types/jest @types/supertest

print_status "Setting up test environment..."

# Create jest.config.js if it doesn't exist
if [ ! -f "jest.config.js" ]; then
    print_status "Creating Jest configuration..."
    cat > jest.config.js << 'EOF'
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html'],
  testTimeout: 10000
};
EOF
fi

# Check if server is running
print_status "Checking if server is running on port 5000..."
if curl -f http://localhost:5000/api/products > /dev/null 2>&1; then
    print_success "Server is running on port 5000"
    SERVER_RUNNING=true
else
    print_warning "Server is not running on port 5000"
    print_status "Starting server for testing..."
    
    # Start server in background for testing
    if [ -f "server-simple.cjs" ]; then
        node server-simple.cjs &
        SERVER_PID=$!
        print_status "Started simple server (PID: $SERVER_PID)"
    elif [ -f "start-simple.sh" ]; then
        ./start-simple.sh &
        SERVER_PID=$!
        print_status "Started server using start-simple.sh (PID: $SERVER_PID)"
    else
        npm run dev &
        SERVER_PID=$!
        print_status "Started development server (PID: $SERVER_PID)"
    fi
    
    # Wait for server to start
    print_status "Waiting for server to start..."
    sleep 5
    
    # Check again
    if curl -f http://localhost:5000/api/products > /dev/null 2>&1; then
        print_success "Server started successfully"
        SERVER_RUNNING=false
    else
        print_error "Failed to start server"
        if [ ! -z "$SERVER_PID" ]; then
            kill $SERVER_PID 2>/dev/null
        fi
        exit 1
    fi
fi

echo ""
print_status "Running test suite..."
echo ""

# Run the tests
npm test tests/

TEST_EXIT_CODE=$?

echo ""
if [ $TEST_EXIT_CODE -eq 0 ]; then
    print_success "All tests passed! ✅"
else
    print_error "Some tests failed. Check the output above."
fi

# Cleanup: Kill server if we started it
if [ "$SERVER_RUNNING" = false ] && [ ! -z "$SERVER_PID" ]; then
    print_status "Stopping test server..."
    kill $SERVER_PID 2>/dev/null
    print_success "Test server stopped"
fi

echo ""
echo "📊 Test Results Summary:"
echo "========================"
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "✅ All tests passed"
else
    echo "❌ Some tests failed"
fi

echo ""
echo "📁 Generated Files:"
echo "- Coverage report: coverage/index.html"
echo "- Test configuration: jest.config.js"
echo ""

print_status "Test run completed!"

exit $TEST_EXIT_CODE