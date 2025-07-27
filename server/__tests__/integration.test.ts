import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../routes';

let app: express.Application;

beforeAll(async () => {
  app = express();
  app.use(express.json());
  await registerRoutes(app);
});

describe('Integration Tests - E-commerce Workflow', () => {
  test('Complete e-commerce flow: Category -> Product -> Order', async () => {
    // 1. Create a category
    const categoryData = {
      name: 'Electronics Integration',
      description: 'Electronics category for integration test',
      image: 'electronics-int.jpg'
    };

    const categoryResponse = await request(app)
      .post('/api/categories')
      .send(categoryData)
      .expect(201);

    const categoryId = categoryResponse.body._id;
    expect(categoryResponse.body).toMatchObject(categoryData);

    // 2. Create a product in the category
    const productData = {
      name: 'Integration Test Headphones',
      description: 'High-quality headphones for integration testing',
      price: '299.99',
      categoryId,
      image: 'headphones-int.jpg',
      stock: 25,
      sku: 'INT-HP-001',
      status: 'active'
    };

    const productResponse = await request(app)
      .post('/api/products')
      .send(productData)
      .expect(201);

    const productId = productResponse.body._id;
    expect(productResponse.body).toMatchObject(productData);

    // 3. Verify product appears in category listing
    const categoryProductsResponse = await request(app)
      .get(`/api/products?category=${categoryId}`)
      .expect(200);

    expect(categoryProductsResponse.body).toHaveLength(1);
    expect(categoryProductsResponse.body[0].name).toBe('Integration Test Headphones');

    // 4. Create an order with the product
    const orderData = {
      order: {
        customerName: 'Integration Test Customer',
        customerEmail: 'integration@test.com',
        customerAddress: '123 Integration St',
        customerCity: 'Test City',
        customerZip: '12345',
        status: 'pending',
        subtotal: '599.98',
        shipping: '19.99',
        tax: '49.60',
        total: '669.57'
      },
      items: [{
        productId,
        quantity: 2,
        price: '299.99'
      }]
    };

    const orderResponse = await request(app)
      .post('/api/orders')
      .send(orderData)
      .expect(201);

    const orderId = orderResponse.body._id;
    expect(orderResponse.body).toMatchObject(orderData.order);
    expect(orderResponse.body.items).toHaveLength(1);
    expect(orderResponse.body.items[0].quantity).toBe(2);

    // 5. Update order status through the workflow
    const statusUpdates = ['processing', 'shipped', 'delivered'];
    
    for (const status of statusUpdates) {
      const statusResponse = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .send({ status })
        .expect(200);

      expect(statusResponse.body.status).toBe(status);
    }

    // 6. Verify final order state
    const finalOrderResponse = await request(app)
      .get(`/api/orders/${orderId}`)
      .expect(200);

    expect(finalOrderResponse.body.status).toBe('delivered');
    expect(finalOrderResponse.body.items[0].product.name).toBe('Integration Test Headphones');

    // 7. Check dashboard stats reflect the order
    const statsResponse = await request(app)
      .get('/api/dashboard/stats')
      .expect(200);

    expect(parseFloat(statsResponse.body.totalRevenue)).toBeGreaterThanOrEqual(669.57);
    expect(statsResponse.body.totalOrders).toBeGreaterThanOrEqual(1);
    expect(statsResponse.body.totalProducts).toBeGreaterThanOrEqual(1);
  });

  test('Deal application workflow', async () => {
    // 1. Create category and products
    const categoryResponse = await request(app)
      .post('/api/categories')
      .send({
        name: 'Deal Test Category',
        description: 'Category for deal testing'
      });

    const product1Response = await request(app)
      .post('/api/products')
      .send({
        name: 'Deal Product 1',
        description: 'First product for deal testing',
        price: '100.00',
        categoryId: categoryResponse.body._id,
        image: 'deal1.jpg',
        stock: 50,
        sku: 'DEAL-001',
        status: 'active'
      });

    const product2Response = await request(app)
      .post('/api/products')
      .send({
        name: 'Deal Product 2',
        description: 'Second product for deal testing',
        price: '200.00',
        categoryId: categoryResponse.body._id,
        image: 'deal2.jpg',
        stock: 30,
        sku: 'DEAL-002',
        status: 'active'
      });

    // 2. Create a percentage deal for specific products
    const dealData = {
      title: 'Integration Test Deal',
      description: '25% off selected products',
      discountType: 'percentage',
      discountValue: 25,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      isActive: true,
      minOrderAmount: 50,
      maxUses: 100,
      currentUses: 0,
      applicableProducts: [product1Response.body._id],
      excludedProducts: [],
      applyToAll: false
    };

    const dealResponse = await request(app)
      .post('/api/deals')
      .send(dealData)
      .expect(201);

    expect(dealResponse.body).toMatchObject(dealData);
    expect(dealResponse.body._id).toBeDefined();

    // 3. Update deal usage (simulate applying the deal)
    const updatedDealResponse = await request(app)
      .put(`/api/deals/${dealResponse.body._id}`)
      .send({ currentUses: 1 })
      .expect(200);

    expect(updatedDealResponse.body.currentUses).toBe(1);

    // 4. Create another deal that applies to all products except one
    const allProductsDealData = {
      title: 'Site-wide Sale',
      description: '10% off everything except Deal Product 2',
      discountType: 'percentage',
      discountValue: 10,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      isActive: true,
      minOrderAmount: 0,
      maxUses: null,
      currentUses: 0,
      applicableProducts: [],
      excludedProducts: [product2Response.body._id],
      applyToAll: true
    };

    const allProductsDealResponse = await request(app)
      .post('/api/deals')
      .send(allProductsDealData)
      .expect(201);

    expect(allProductsDealResponse.body.applyToAll).toBe(true);
    expect(allProductsDealResponse.body.excludedProducts).toContain(product2Response.body._id);

    // 5. Verify both deals exist
    const allDealsResponse = await request(app)
      .get('/api/deals')
      .expect(200);

    expect(allDealsResponse.body).toHaveLength(2);
    
    const dealTitles = allDealsResponse.body.map((deal: any) => deal.title);
    expect(dealTitles).toContain('Integration Test Deal');
    expect(dealTitles).toContain('Site-wide Sale');
  });

  test('User management workflow', async () => {
    // 1. Create multiple users with different roles
    const customerData = {
      email: 'customer@integration.test',
      name: 'Integration Customer',
      role: 'customer',
      status: 'active'
    };

    const adminData = {
      email: 'admin@integration.test',
      name: 'Integration Admin',
      role: 'admin',
      status: 'active'
    };

    const customerResponse = await request(app)
      .post('/api/users')
      .send(customerData)
      .expect(201);

    const adminResponse = await request(app)
      .post('/api/users')
      .send(adminData)
      .expect(201);

    expect(customerResponse.body.role).toBe('customer');
    expect(adminResponse.body.role).toBe('admin');

    // 2. Update user activity (simulate customer making purchases)
    const updatedCustomerResponse = await request(app)
      .put(`/api/users/${customerResponse.body._id}`)
      .send({
        totalOrders: 3,
        totalSpent: '459.97',
        lastLogin: new Date().toISOString()
      })
      .expect(200);

    expect(updatedCustomerResponse.body.totalOrders).toBe(3);
    expect(updatedCustomerResponse.body.totalSpent).toBe('459.97');

    // 3. Suspend a user
    const suspendedUserResponse = await request(app)
      .put(`/api/users/${customerResponse.body._id}`)
      .send({ status: 'suspended' })
      .expect(200);

    expect(suspendedUserResponse.body.status).toBe('suspended');

    // 4. Get all users and verify counts
    const allUsersResponse = await request(app)
      .get('/api/users')
      .expect(200);

    expect(allUsersResponse.body).toHaveLength(2);
    
    const userRoles = allUsersResponse.body.map((user: any) => user.role);
    expect(userRoles).toContain('customer');
    expect(userRoles).toContain('admin');

    const userStatuses = allUsersResponse.body.map((user: any) => user.status);
    expect(userStatuses).toContain('suspended');
    expect(userStatuses).toContain('active');
  });

  test('Error handling and validation', async () => {
    // Test invalid category creation
    await request(app)
      .post('/api/categories')
      .send({ description: 'Missing name field' })
      .expect(400);

    // Test invalid product creation
    await request(app)
      .post('/api/products')
      .send({
        name: 'Invalid Product',
        description: 'Missing required fields'
        // Missing price, categoryId, etc.
      })
      .expect(400);

    // Test invalid deal creation
    await request(app)
      .post('/api/deals')
      .send({
        title: 'Invalid Deal',
        description: 'Missing required fields'
        // Missing discountType, discountValue, dates, etc.
      })
      .expect(400);

    // Test accessing non-existent resources
    await request(app)
      .get('/api/categories/999999')
      .expect(404);

    await request(app)
      .get('/api/products/999999')
      .expect(404);

    await request(app)
      .get('/api/orders/999999')
      .expect(404);

    await request(app)
      .get('/api/users/999999')
      .expect(404);

    await request(app)
      .get('/api/deals/999999')
      .expect(404);

    // Test updating non-existent resources
    await request(app)
      .put('/api/products/999999')
      .send({ price: '99.99' })
      .expect(404);

    await request(app)
      .put('/api/orders/999999/status')
      .send({ status: 'processing' })
      .expect(404);

    // Test deleting non-existent resources
    await request(app)
      .delete('/api/products/999999')
      .expect(404);

    await request(app)
      .delete('/api/users/999999')
      .expect(404);

    await request(app)
      .delete('/api/deals/999999')
      .expect(404);
  });

  test('Data consistency and relationships', async () => {
    // Create category and product
    const categoryResponse = await request(app)
      .post('/api/categories')
      .send({
        name: 'Consistency Test Category',
        description: 'Testing data consistency'
      });

    const productResponse = await request(app)
      .post('/api/products')
      .send({
        name: 'Consistency Test Product',
        description: 'Product for consistency testing',
        price: '150.00',
        categoryId: categoryResponse.body._id,
        image: 'consistency.jpg',
        stock: 10,
        sku: 'CONS-001',
        status: 'active'
      });

    // Create order with the product
    const orderResponse = await request(app)
      .post('/api/orders')
      .send({
        order: {
          customerName: 'Consistency Customer',
          customerEmail: 'consistency@test.com',
          customerAddress: '123 Consistency St',
          customerCity: 'Consistent City',
          customerZip: '12345',
          status: 'pending',
          subtotal: '150.00',
          shipping: '10.00',
          tax: '12.00',
          total: '172.00'
        },
        items: [{
          productId: productResponse.body._id,
          quantity: 1,
          price: '150.00'
        }]
      });

    // Verify order contains complete product information
    const orderWithItemsResponse = await request(app)
      .get(`/api/orders/${orderResponse.body._id}`)
      .expect(200);

    expect(orderWithItemsResponse.body.items[0].product.name).toBe('Consistency Test Product');
    expect(orderWithItemsResponse.body.items[0].product.categoryId).toBe(categoryResponse.body._id);

    // Update product stock and verify it's reflected
    await request(app)
      .put(`/api/products/${productResponse.body._id}`)
      .send({ stock: 5 })
      .expect(200);

    const updatedProductResponse = await request(app)
      .get(`/api/products/${productResponse.body._id}`)
      .expect(200);

    expect(updatedProductResponse.body.stock).toBe(5);

    // Verify dashboard stats are updated correctly
    const finalStatsResponse = await request(app)
      .get('/api/dashboard/stats')
      .expect(200);

    expect(parseFloat(finalStatsResponse.body.totalRevenue)).toBeGreaterThan(0);
    expect(finalStatsResponse.body.totalOrders).toBeGreaterThan(0);
    expect(finalStatsResponse.body.totalProducts).toBeGreaterThan(0);
  });
});