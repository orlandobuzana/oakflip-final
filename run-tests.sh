#!/bin/bash

# Test Runner Script for Rest Express E-commerce Application
# This script runs the complete test suite including API and frontend tests

echo "🚀 Starting Rest Express Test Suite..."
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js to run tests."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm to run tests."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Check if server is already running
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Server is already running on port 5000"
    SERVER_PID=""
else
    # Start the server in background for testing
    echo "🔧 Starting test server..."
    NODE_ENV=test npm run dev &
    SERVER_PID=$!
    
    # Wait for server to start
    echo "⏳ Waiting for server to start..."
    sleep 5
fi

# Function to cleanup
cleanup() {
    echo "🧹 Cleaning up..."
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null
        wait $SERVER_PID 2>/dev/null
    fi
}

# Set trap to cleanup on script exit
trap cleanup EXIT

# Check if test files exist and run them
if [ -f "tests/api.test.js" ]; then
    echo "🧪 Running API tests..."
    npx jest tests/api.test.js --verbose
    API_TEST_EXIT_CODE=$?
else
    echo "⚠️ API test file not found, skipping..."
    API_TEST_EXIT_CODE=0
fi

echo ""

if [ -f "tests/frontend.test.js" ]; then
    echo "🧪 Running frontend tests..."
    npx jest tests/frontend.test.js --verbose
    FRONTEND_TEST_EXIT_CODE=$?
else
    echo "⚠️ Frontend test file not found, skipping..."
    FRONTEND_TEST_EXIT_CODE=0
fi

echo ""

if [ -f "tests/cart.test.js" ]; then
    echo "🧪 Running cart functionality tests..."
    npx jest tests/cart.test.js --verbose
    CART_TEST_EXIT_CODE=$?
else
    echo "⚠️ Cart test file not found, skipping..."
    CART_TEST_EXIT_CODE=0
fi

echo ""
echo "======================================"
echo "📊 TEST RESULTS SUMMARY"
echo "======================================"

if [ $API_TEST_EXIT_CODE -eq 0 ]; then
    echo "✅ API Tests: PASSED"
else
    echo "❌ API Tests: FAILED"
fi

if [ $FRONTEND_TEST_EXIT_CODE -eq 0 ]; then
    echo "✅ Frontend Tests: PASSED"
else
    echo "❌ Frontend Tests: FAILED"
fi

if [ $CART_TEST_EXIT_CODE -eq 0 ]; then
    echo "✅ Cart Tests: PASSED"
else
    echo "❌ Cart Tests: FAILED"
fi

echo "======================================"

# Exit with error if any test failed
if [ $API_TEST_EXIT_CODE -ne 0 ] || [ $FRONTEND_TEST_EXIT_CODE -ne 0 ] || [ $CART_TEST_EXIT_CODE -ne 0 ]; then
    echo "❌ Some tests failed. Check the output above for details."
    exit 1
else
    echo "🎉 All tests passed successfully!"
    exit 0
fi