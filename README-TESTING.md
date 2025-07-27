# Rest Express E-commerce Testing Guide

## Overview

This document provides instructions for running tests on the Rest Express e-commerce application. The test suite includes both backend API tests and frontend functionality tests.

## Test Structure

```
tests/
├── api.test.js          # Backend API endpoint tests
├── frontend.test.js     # Frontend functionality tests
run-tests.sh             # Automated test runner script
jest.config.js           # Jest testing configuration (auto-generated)
```

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- Server running on port 5000 (or will be started automatically)

## Quick Start

### 1. Run All Tests (Recommended)

```bash
# Make the script executable and run all tests
chmod +x run-tests.sh
./run-tests.sh
```

This script will:
- Check dependencies
- Install test packages if needed
- Start the server if not running
- Run all tests
- Generate coverage reports
- Clean up automatically

### 2. Manual Test Running

If you prefer to run tests manually:

```bash
# Install test dependencies
npm install --save-dev jest supertest @types/jest @types/supertest

# Make sure server is running
npm run dev
# OR (for macOS Big Sur compatibility)
node server-simple.cjs

# Run tests in another terminal
npm test tests/
```

## Test Categories

### API Tests (`api.test.js`)

Tests the backend REST API endpoints:

- ✅ **Server Health Check** - Verifies server is running
- ✅ **Products API** - GET/POST operations for products
- ✅ **Categories API** - Category listing and management
- ✅ **Authentication** - Login/registration endpoints
- ✅ **Reviews System** - Review submission and approval
- ✅ **Cart Operations** - Shopping cart functionality
- ✅ **Deals Management** - Special deals and promotions
- ✅ **Analytics Tracking** - User behavior analytics

### Frontend Tests (`frontend.test.js`)

Tests the client-side functionality:

- ✅ **Product Display** - Product cards and detail pages
- ✅ **Cart Management** - Add/remove items, cart counter
- ✅ **Page Navigation** - Product detail page switching
- ✅ **User Authentication** - Login state management
- ✅ **Heart Rating System** - Product rating functionality
- ✅ **Review System** - Review form validation
- ✅ **Purchase Verification** - Purchase history checks
- ✅ **Product Filtering** - Category-based filtering

## Test Coverage

The tests cover these key features:

### 🛒 **E-commerce Core**
- Product catalog management
- Shopping cart operations
- Order processing
- Category filtering

### 👤 **User Management**
- User registration and login
- Role-based access (customer/admin)
- Session management

### ⭐ **Review System**
- Heart ratings (all customers)
- Written reviews (purchase required)
- Admin approval workflow

### 📊 **Analytics**
- User session tracking
- Page view analytics
- Purchase behavior

### 🎯 **Special Features**
- Deals and promotions
- Multi-image product gallery
- Responsive design elements

## Understanding Test Results

### ✅ **Green (Passing Tests)**
- All functionality working correctly
- API endpoints responding properly
- Frontend features operational

### ❌ **Red (Failing Tests)**
- Check if server is running on port 5000
- Verify database connections
- Review error messages for specific issues

### ⚠️ **Yellow (Warnings)**
- Non-critical issues
- Missing optional features
- Performance suggestions

## Troubleshooting

### Common Issues

**Server Not Running**
```bash
# Start the server manually
npm run dev
# OR for macOS Big Sur
node server-simple.cjs
```

**Port 5000 Already in Use**
```bash
# Find and kill process using port 5000
lsof -ti:5000 | xargs kill -9
```

**Missing Dependencies**
```bash
# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install
```

**Tests Timing Out**
- Increase timeout in `jest.config.js`
- Check server performance
- Verify network connectivity

### Manual Testing

You can also test the application manually:

1. **Frontend**: Open `http://localhost:5000` in browser
2. **Admin Panel**: Visit `http://localhost:5000/admin.html`
3. **API Endpoints**: Use tools like Postman or curl

Example API test:
```bash
curl http://localhost:5000/api/products
```

## Test Configuration

The `jest.config.js` file is automatically created with these settings:

```javascript
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testTimeout: 10000
};
```

## Coverage Reports

After running tests, coverage reports are generated:

- **HTML Report**: `coverage/index.html` (open in browser)
- **Terminal Output**: Shows coverage percentages
- **Text Report**: Detailed line-by-line coverage

## Continuous Integration

For automated testing in CI/CD pipelines:

```bash
# CI-friendly test command
npm test -- --ci --coverage --watchAll=false
```

## Adding New Tests

### API Test Example
```javascript
test('GET /api/new-endpoint - should work', async () => {
  const response = await request(baseURL).get('/api/new-endpoint');
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('data');
});
```

### Frontend Test Example
```javascript
test('New feature should work correctly', () => {
  const element = document.getElementById('new-feature');
  expect(element).toBeTruthy();
});
```

## Performance Testing

For performance testing, you can use:

```bash
# Install additional tools
npm install --save-dev @jest/test-utils

# Run performance-focused tests
npm test -- --detectOpenHandles --forceExit
```

---

**Happy Testing! 🧪**

For questions or issues, check the main project documentation or create an issue in the repository.