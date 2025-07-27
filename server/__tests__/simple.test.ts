// Simple test to verify Jest is working
import { storage } from '../storage';

describe('Simple Backend Tests', () => {
  beforeEach(async () => {
    // Clear all data
    (storage as any).categories.clear();
    (storage as any).products.clear();
    (storage as any).orders.clear();
    (storage as any).orderItems.clear();
    (storage as any).users.clear();
    (storage as any).deals.clear();
    
    // Reset counters
    (storage as any).currentCategoryId = 1;
    (storage as any).currentProductId = 1;
    (storage as any).currentOrderId = 1;
    (storage as any).currentOrderItemId = 1;
    (storage as any).currentUserId = 1;
    (storage as any).currentDealId = 1;
  });

  test('Storage should create a category', async () => {
    const categoryData = {
      name: 'Test Electronics',
      description: 'Electronic devices for testing',
      image: 'test-electronics.jpg'
    };

    const category = await storage.createCategory(categoryData);
    
    expect(category.name).toBe('Test Electronics');
    expect(category.description).toBe('Electronic devices for testing');
    expect(category._id).toBeDefined();
  });

  test('Storage should create a product', async () => {
    // First create a category
    const category = await storage.createCategory({
      name: 'Electronics',
      description: 'Electronic category'
    });

    const productData = {
      name: 'Test Headphones',
      description: 'High-quality test headphones',
      price: '199.99',
      categoryId: category._id!,
      image: 'test-headphones.jpg',
      stock: 50,
      sku: 'TEST-HP-001',
      status: 'active' as const,
      rating: '4.5',
      reviewCount: 10
    };

    const product = await storage.createProduct(productData);
    
    expect(product.name).toBe('Test Headphones');
    expect(product.price).toBe('199.99');
    expect(product.stock).toBe(50);
    expect(product._id).toBeDefined();
  });

  test('Storage should create an order with items', async () => {
    // Create category and product first
    const category = await storage.createCategory({
      name: 'Test Category',
      description: 'Test category'
    });

    const product = await storage.createProduct({
      name: 'Test Product',
      description: 'Test product for orders',
      price: '99.99',
      categoryId: category._id!,
      image: 'test.jpg',
      stock: 100,
      sku: 'TST-001',
      status: 'active' as const,
      rating: '4.0',
      reviewCount: 5
    });

    const orderData = {
      customerName: 'John Test',
      customerEmail: 'john@test.com',
      customerAddress: '123 Test St',
      customerCity: 'Test City',
      customerZip: '12345',
      status: 'pending' as const,
      subtotal: '99.99',
      shipping: '9.99',
      tax: '8.25',
      total: '118.23'
    };

    const orderItems = [{
      orderId: '', // Will be set by createOrder
      productId: product._id!,
      quantity: 1,
      price: '99.99'
    }];

    const order = await storage.createOrder(orderData, orderItems);
    
    expect(order.customerName).toBe('John Test');
    expect(order.total).toBe('118.23');
    expect(order.items).toHaveLength(1);
    expect(order.items[0].productId).toBe(product._id);
  });

  test('Storage should create a user', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User',
      role: 'customer' as const,
      status: 'active' as const,
      totalOrders: 0,
      totalSpent: '0.00'
    };

    const user = await storage.createUser(userData);
    
    expect(user.email).toBe('test@example.com');
    expect(user.name).toBe('Test User');
    expect(user.role).toBe('customer');
    expect(user._id).toBeDefined();
  });

  test('Storage should create a deal', async () => {
    const dealData = {
      title: 'Test Sale',
      description: '20% off test products',
      discountType: 'percentage' as const,
      discountValue: 20,
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      isActive: true,
      minOrderAmount: 50,
      maxUses: 100,
      currentUses: 0,
      applicableProducts: [],
      excludedProducts: [],
      applyToAll: true
    };

    const deal = await storage.createDeal(dealData);
    
    expect(deal.title).toBe('Test Sale');
    expect(deal.discountType).toBe('percentage');
    expect(deal.discountValue).toBe(20);
    expect(deal._id).toBeDefined();
  });

  test('Storage should get dashboard stats', async () => {
    // Create some test data
    const category = await storage.createCategory({
      name: 'Test Category',
      description: 'Test category for stats'
    });

    const product = await storage.createProduct({
      name: 'Stats Product',
      description: 'Product for stats testing',
      price: '100.00',
      categoryId: category._id!,
      image: 'stats.jpg',
      stock: 50,
      sku: 'STATS-001',
      status: 'active' as const,
      rating: '4.2',
      reviewCount: 8
    });

    await storage.createOrder({
      customerName: 'Stats Customer',
      customerEmail: 'stats@test.com',
      customerAddress: '123 Stats St',
      customerCity: 'Stats City',
      customerZip: '12345',
      status: 'delivered' as const,
      subtotal: '100.00',
      shipping: '10.00',
      tax: '8.00',
      total: '118.00'
    }, [{
      orderId: '',
      productId: product._id!,
      quantity: 1,
      price: '100.00'
    }]);

    await storage.createUser({
      email: 'stats-user@test.com',
      name: 'Stats User',
      role: 'customer' as const,
      status: 'active' as const,
      totalOrders: 1,
      totalSpent: '118.00'
    });

    const stats = await storage.getDashboardStats();
    
    expect(stats.totalRevenue).toBe('118.00');
    expect(stats.totalOrders).toBe(1);
    expect(stats.totalProducts).toBe(1);
    expect(stats.activeCustomers).toBe(1);
  });

  test('Storage should update and delete records', async () => {
    // Test product update and delete
    const category = await storage.createCategory({
      name: 'Update Test Category',
      description: 'Category for update tests'
    });

    const product = await storage.createProduct({
      name: 'Update Test Product',
      description: 'Product for update testing',
      price: '50.00',
      categoryId: category._id!,
      image: 'update.jpg',
      stock: 20,
      sku: 'UPD-001',
      status: 'active' as const,
      rating: '3.8',
      reviewCount: 3
    });

    // Update product
    const updatedProduct = await storage.updateProduct(product._id!, {
      price: '45.00',
      stock: 15
    });

    expect(updatedProduct?.price).toBe('45.00');
    expect(updatedProduct?.stock).toBe(15);

    // Delete product
    const deleted = await storage.deleteProduct(product._id!);
    expect(deleted).toBe(true);

    // Verify deletion
    const found = await storage.getProductById(product._id!);
    expect(found).toBeUndefined();
  });
});