import { storage } from '../storage';
import type { 
  InsertCategory, 
  InsertProduct, 
  InsertOrder, 
  InsertOrderItem, 
  InsertUser,
  InsertDeal 
} from '@shared/schema';

describe('Storage Layer Tests', () => {
  describe('Categories', () => {
    test('should create a category', async () => {
      const categoryData: InsertCategory = {
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
        image: 'electronics.jpg'
      };

      const category = await storage.createCategory(categoryData);
      
      expect(category).toMatchObject(categoryData);
      expect(category._id).toBeDefined();
    });

    test('should get all categories', async () => {
      const categoryData: InsertCategory = {
        name: 'Electronics',
        description: 'Electronic devices'
      };

      await storage.createCategory(categoryData);
      const categories = await storage.getCategories();
      
      expect(categories).toHaveLength(1);
      expect(categories[0].name).toBe('Electronics');
    });

    test('should get category by id', async () => {
      const categoryData: InsertCategory = {
        name: 'Books',
        description: 'Books and literature'
      };

      const created = await storage.createCategory(categoryData);
      const found = await storage.getCategoryById(created._id!);
      
      expect(found).toMatchObject(categoryData);
      expect(found?._id).toBe(created._id);
    });

    test('should return undefined for non-existent category', async () => {
      const found = await storage.getCategoryById('999');
      expect(found).toBeUndefined();
    });
  });

  describe('Products', () => {
    let categoryId: string;

    beforeEach(async () => {
      const category = await storage.createCategory({
        name: 'Electronics',
        description: 'Electronic devices'
      });
      categoryId = category._id!;
    });

    test('should create a product', async () => {
      const productData: InsertProduct = {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones',
        price: '199.99',
        categoryId,
        image: 'headphones.jpg',
        stock: 50,
        sku: 'WH-001',
        status: 'active'
      };

      const product = await storage.createProduct(productData);
      
      expect(product).toMatchObject(productData);
      expect(product._id).toBeDefined();
    });

    test('should get all products', async () => {
      const productData: InsertProduct = {
        name: 'Smartphone',
        description: 'Latest smartphone',
        price: '699.99',
        categoryId,
        image: 'phone.jpg',
        stock: 25,
        sku: 'SP-001',
        status: 'active'
      };

      await storage.createProduct(productData);
      const products = await storage.getProducts();
      
      expect(products).toHaveLength(1);
      expect(products[0].name).toBe('Smartphone');
    });

    test('should get products by category', async () => {
      const product1: InsertProduct = {
        name: 'Laptop',
        description: 'Gaming laptop',
        price: '1299.99',
        categoryId,
        image: 'laptop.jpg',
        stock: 10,
        sku: 'LP-001',
        status: 'active'
      };

      const otherCategory = await storage.createCategory({
        name: 'Books',
        description: 'Books'
      });

      const product2: InsertProduct = {
        name: 'Novel',
        description: 'Fiction novel',
        price: '19.99',
        categoryId: otherCategory._id!,
        image: 'book.jpg',
        stock: 100,
        sku: 'BK-001',
        status: 'active'
      };

      await storage.createProduct(product1);
      await storage.createProduct(product2);

      const electronicsProducts = await storage.getProductsByCategory(categoryId);
      
      expect(electronicsProducts).toHaveLength(1);
      expect(electronicsProducts[0].name).toBe('Laptop');
    });

    test('should update product', async () => {
      const productData: InsertProduct = {
        name: 'Tablet',
        description: 'Tablet device',
        price: '399.99',
        categoryId,
        image: 'tablet.jpg',
        stock: 20,
        sku: 'TB-001',
        status: 'active'
      };

      const created = await storage.createProduct(productData);
      const updated = await storage.updateProduct(created._id!, {
        price: '349.99',
        stock: 15
      });
      
      expect(updated?.price).toBe('349.99');
      expect(updated?.stock).toBe(15);
      expect(updated?.name).toBe('Tablet'); // Unchanged fields remain
    });

    test('should delete product', async () => {
      const productData: InsertProduct = {
        name: 'Monitor',
        description: '4K Monitor',
        price: '499.99',
        categoryId,
        image: 'monitor.jpg',
        stock: 5,
        sku: 'MN-001',
        status: 'active'
      };

      const created = await storage.createProduct(productData);
      const deleted = await storage.deleteProduct(created._id!);
      
      expect(deleted).toBe(true);
      
      const found = await storage.getProductById(created._id!);
      expect(found).toBeUndefined();
    });

    test('should update product stock', async () => {
      const productData: InsertProduct = {
        name: 'Speaker',
        description: 'Bluetooth speaker',
        price: '79.99',
        categoryId,
        image: 'speaker.jpg',
        stock: 30,
        sku: 'SP-002',
        status: 'active'
      };

      const created = await storage.createProduct(productData);
      const updated = await storage.updateProductStock(created._id!, 25);
      
      expect(updated?.stock).toBe(25);
    });
  });

  describe('Orders', () => {
    let productId: string;

    beforeEach(async () => {
      const category = await storage.createCategory({
        name: 'Electronics',
        description: 'Electronic devices'
      });

      const product = await storage.createProduct({
        name: 'Test Product',
        description: 'Test product for orders',
        price: '99.99',
        categoryId: category._id!,
        image: 'test.jpg',
        stock: 100,
        sku: 'TST-001',
        status: 'active'
      });
      
      productId = product._id!;
    });

    test('should create order with items', async () => {
      const orderData: InsertOrder = {
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerAddress: '123 Main St',
        customerCity: 'Anytown',
        customerZip: '12345',
        status: 'pending',
        subtotal: '99.99',
        shipping: '9.99',
        tax: '8.25',
        total: '118.23'
      };

      const orderItems: InsertOrderItem[] = [{
        orderId: '', // Will be set by createOrder
        productId,
        quantity: 1,
        price: '99.99'
      }];

      const order = await storage.createOrder(orderData, orderItems);
      
      expect(order).toMatchObject(orderData);
      expect(order.items).toHaveLength(1);
      expect(order.items[0].productId).toBe(productId);
    });

    test('should get all orders', async () => {
      const orderData: InsertOrder = {
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerAddress: '456 Oak Ave',
        customerCity: 'Somewhere',
        customerZip: '67890',
        status: 'processing',
        subtotal: '199.99',
        shipping: '12.99',
        tax: '16.50',
        total: '229.48'
      };

      const orderItems: InsertOrderItem[] = [{
        orderId: '',
        productId,
        quantity: 2,
        price: '99.99'
      }];

      await storage.createOrder(orderData, orderItems);
      const orders = await storage.getOrders();
      
      expect(orders).toHaveLength(1);
      expect(orders[0].customerName).toBe('Jane Smith');
    });

    test('should update order status', async () => {
      const orderData: InsertOrder = {
        customerName: 'Bob Johnson',
        customerEmail: 'bob@example.com',
        customerAddress: '789 Pine St',
        customerCity: 'Elsewhere',
        customerZip: '54321',
        status: 'pending',
        subtotal: '49.99',
        shipping: '5.99',
        tax: '4.12',
        total: '60.10'
      };

      const orderItems: InsertOrderItem[] = [{
        orderId: '',
        productId,
        quantity: 1,
        price: '49.99'
      }];

      const created = await storage.createOrder(orderData, orderItems);
      const updated = await storage.updateOrderStatus(created._id!, 'shipped');
      
      expect(updated?.status).toBe('shipped');
    });
  });

  describe('Users', () => {
    test('should create user', async () => {
      const userData: InsertUser = {
        email: 'test@example.com',
        name: 'Test User',
        role: 'customer',
        status: 'active'
      };

      const user = await storage.createUser(userData);
      
      expect(user).toMatchObject(userData);
      expect(user._id).toBeDefined();
      expect(user.createdAt).toBeDefined();
    });

    test('should get all users', async () => {
      const userData: InsertUser = {
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        status: 'active'
      };

      await storage.createUser(userData);
      const users = await storage.getUsers();
      
      expect(users).toHaveLength(1);
      expect(users[0].role).toBe('admin');
    });

    test('should update user', async () => {
      const userData: InsertUser = {
        email: 'user@example.com',
        name: 'Regular User',
        role: 'customer',
        status: 'active'
      };

      const created = await storage.createUser(userData);
      const updated = await storage.updateUser(created._id!, {
        status: 'suspended',
        totalOrders: 5
      });
      
      expect(updated?.status).toBe('suspended');
      expect(updated?.totalOrders).toBe(5);
    });

    test('should delete user', async () => {
      const userData: InsertUser = {
        email: 'delete@example.com',
        name: 'Delete User',
        role: 'customer',
        status: 'active'
      };

      const created = await storage.createUser(userData);
      const deleted = await storage.deleteUser(created._id!);
      
      expect(deleted).toBe(true);
      
      const found = await storage.getUserById(created._id!);
      expect(found).toBeUndefined();
    });
  });

  describe('Deals', () => {
    test('should create deal', async () => {
      const dealData: InsertDeal = {
        title: 'Summer Sale',
        description: '20% off all electronics',
        discountType: 'percentage',
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
      
      expect(deal).toMatchObject(dealData);
      expect(deal._id).toBeDefined();
      expect(deal.createdAt).toBeDefined();
    });

    test('should get all deals', async () => {
      const dealData: InsertDeal = {
        title: 'Black Friday',
        description: 'Huge discounts on everything',
        discountType: 'fixed',
        discountValue: 50,
        startDate: '2024-11-29',
        endDate: '2024-11-30',
        isActive: true,
        minOrderAmount: 0,
        maxUses: null,
        currentUses: 0,
        applicableProducts: ['1', '2'],
        excludedProducts: [],
        applyToAll: false
      };

      await storage.createDeal(dealData);
      const deals = await storage.getDeals();
      
      expect(deals).toHaveLength(1);
      expect(deals[0].title).toBe('Black Friday');
    });

    test('should update deal', async () => {
      const dealData: InsertDeal = {
        title: 'Flash Sale',
        description: 'Limited time offer',
        discountType: 'percentage',
        discountValue: 15,
        startDate: '2024-07-01',
        endDate: '2024-07-02',
        isActive: true,
        minOrderAmount: 25,
        maxUses: 50,
        currentUses: 0,
        applicableProducts: [],
        excludedProducts: [],
        applyToAll: true
      };

      const created = await storage.createDeal(dealData);
      const updated = await storage.updateDeal(created._id!, {
        discountValue: 25,
        currentUses: 10
      });
      
      expect(updated?.discountValue).toBe(25);
      expect(updated?.currentUses).toBe(10);
      expect(updated?.updatedAt).toBeDefined();
    });

    test('should delete deal', async () => {
      const dealData: InsertDeal = {
        title: 'Clearance',
        description: 'Final clearance sale',
        discountType: 'fixed',
        discountValue: 30,
        startDate: '2024-12-01',
        endDate: '2024-12-31',
        isActive: false,
        minOrderAmount: 0,
        maxUses: null,
        currentUses: 0,
        applicableProducts: [],
        excludedProducts: [],
        applyToAll: true
      };

      const created = await storage.createDeal(dealData);
      const deleted = await storage.deleteDeal(created._id!);
      
      expect(deleted).toBe(true);
      
      const found = await storage.getDealById(created._id!);
      expect(found).toBeUndefined();
    });
  });

  describe('Dashboard Stats', () => {
    beforeEach(async () => {
      // Create test data for dashboard stats
      const category = await storage.createCategory({
        name: 'Test Category',
        description: 'Test category for stats'
      });

      const product = await storage.createProduct({
        name: 'Test Product',
        description: 'Test product for stats',
        price: '100.00',
        categoryId: category._id!,
        image: 'test.jpg',
        stock: 50,
        sku: 'TST-STATS',
        status: 'active'
      });

      // Create a test order
      await storage.createOrder({
        customerName: 'Stats Customer',
        customerEmail: 'stats@example.com',
        customerAddress: '123 Stats St',
        customerCity: 'Statsville',
        customerZip: '12345',
        status: 'completed',
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

      // Create a test user
      await storage.createUser({
        email: 'stats-user@example.com',
        name: 'Stats User',
        role: 'customer',
        status: 'active'
      });
    });

    test('should get dashboard stats', async () => {
      const stats = await storage.getDashboardStats();
      
      expect(stats.totalRevenue).toBe('118.00');
      expect(stats.totalOrders).toBe(1);
      expect(stats.totalProducts).toBe(1);
      expect(stats.activeCustomers).toBe(1);
    });
  });
});