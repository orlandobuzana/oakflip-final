import { 
  type Category, 
  type Product, 
  type Order, 
  type OrderItem,
  type User,
  type Deal,
  type InsertCategory, 
  type InsertProduct, 
  type InsertOrder, 
  type InsertOrderItem,
  type InsertUser,
  type InsertDeal,
  type ProductWithCategory,
  type OrderWithItems,
  type DashboardStats,
  type SalesData,
  type TopProduct,
  type UserManagementData
} from "@shared/schema";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  updateProductStock(id: string, stock: number): Promise<Product | undefined>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<OrderWithItems | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<OrderWithItems>;
  updateOrderStatus(id: string, status: Order["status"]): Promise<Order | undefined>;

  // Dashboard
  getDashboardStats(): Promise<DashboardStats>;
  
  // Sales Analytics
  getSalesData(days?: number): Promise<SalesData[]>;
  getTopProducts(limit?: number): Promise<TopProduct[]>;
  
  // User Management
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  updateUserStatus(id: string, status: User["status"]): Promise<User | undefined>;
  getUserManagementData(): Promise<UserManagementData>;

  // Deal Management
  getDeals(): Promise<Deal[]>;
  getDealById(id: string): Promise<Deal | undefined>;
  createDeal(deal: InsertDeal): Promise<Deal>;
  updateDeal(id: string, updateData: Partial<InsertDeal>): Promise<Deal | undefined>;
  deleteDeal(id: string): Promise<boolean>;
}

// Temporary in-memory storage implementation with string IDs
export class MemStorage implements IStorage {
  private categories: Map<string, Category>;
  private products: Map<string, Product>;
  private orders: Map<string, Order>;
  private orderItems: Map<string, OrderItem>;
  private users: Map<string, User>;
  private currentCategoryId: number;
  private currentProductId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;
  private currentUserId: number;

  constructor() {
    this.categories = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.users = new Map();
    this.currentCategoryId = 1;
    this.currentProductId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentUserId = 1;

    this.initializeData();
  }

  private initializeData() {
    // Initialize sample users
    const usersData: (InsertUser & { id: string })[] = [
      {
        id: "1",
        email: "admin@store.com",
        name: "Admin User",
        role: "admin",
        status: "active",
        totalOrders: 0,
        totalSpent: "0.00"
      },
      {
        id: "2", 
        email: "customer@store.com",
        name: "Customer User",
        role: "customer",
        status: "active",
        totalOrders: 3,
        totalSpent: "299.97"
      },
      {
        id: "3",
        email: "john.doe@email.com",
        name: "John Doe",
        role: "customer", 
        status: "active",
        totalOrders: 1,
        totalSpent: "99.99"
      },
      {
        id: "4",
        email: "jane.smith@email.com",
        name: "Jane Smith",
        role: "customer",
        status: "suspended",
        totalOrders: 5,
        totalSpent: "549.95"
      }
    ];

    usersData.forEach(userData => {
      const user: User = { 
        ...userData, 
        _id: userData.id,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date within last week
      };
      this.users.set(user._id!, user);
    });
    // Initialize categories
    const categoriesData: (InsertCategory & { id: string })[] = [
      {
        id: "1",
        name: "Electronics",
        description: "Latest technology and gadgets",
        image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
      },
      {
        id: "2",
        name: "Fashion",
        description: "Stylish clothing and accessories",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
      },
      {
        id: "3",
        name: "Home & Garden",
        description: "Everything for your home",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
      },
      {
        id: "4",
        name: "Sports",
        description: "Sports equipment and gear",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
      }
    ];

    categoriesData.forEach(cat => {
      const category: Category = { ...cat, _id: cat.id };
      this.categories.set(category._id!, category);
    });

    // Initialize products
    const productsData: (InsertProduct & { id: string })[] = [
      {
        id: "1",
        name: "Premium Wireless Headphones",
        description: "High-quality sound with noise cancellation",
        price: "199.99",
        categoryId: "1",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"],
        stock: 50,
        sku: "WH-001",
        status: "active",
        rating: "4.8",
        reviewCount: 156,
        features: ["Noise Cancellation", "30-hour Battery", "Wireless Charging"]
      },
      {
        id: "2",
        name: "Latest Smartphone",
        description: "Advanced camera and lightning-fast performance",
        price: "799.99",
        categoryId: "1",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"],
        stock: 30,
        sku: "SP-001",
        status: "active",
        rating: "4.7",
        reviewCount: 89,
        features: ["Triple Camera System", "5G Ready", "Face ID"]
      },
      {
        id: "3",
        name: "Professional Laptop",
        description: "High-performance computing for work and creativity",
        price: "1299.99",
        originalPrice: "1499.99",
        categoryId: "1",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"],
        stock: 15,
        sku: "LP-001",
        status: "active",
        rating: "4.9",
        reviewCount: 234,
        features: ["Intel Core i7", "16GB RAM", "512GB SSD", "Dedicated Graphics"]
      },
      {
        id: "4",
        name: "Designer Sneakers",
        description: "Comfortable and stylish everyday footwear",
        price: "129.99",
        categoryId: "2",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"],
        stock: 75,
        sku: "SN-001",
        status: "active",
        rating: "4.5",
        reviewCount: 67,
        features: ["Premium Materials", "Comfortable Fit", "Durable Design"]
      },
      {
        id: "5",
        name: "Digital Camera",
        description: "Professional DSLR with advanced features",
        price: "899.99",
        originalPrice: "1199.99",
        categoryId: "1",
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        images: ["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"],
        stock: 25,
        sku: "DC-001",
        status: "active",
        rating: "4.6",
        reviewCount: 124,
        features: ["24MP Sensor", "4K Video", "Image Stabilization"]
      },
      {
        id: "6",
        name: "Wireless Earbuds",
        description: "True wireless audio with premium sound quality",
        price: "79.99",
        categoryId: "1",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"],
        stock: 45,
        sku: "WE-001",
        status: "active",
        rating: "4.4",
        reviewCount: 89,
        features: ["Touch Controls", "Water Resistant", "Quick Charge"]
      }
    ];

    productsData.forEach(prod => {
      const product: Product = { ...prod, _id: prod.id };
      this.products.set(product._id!, product);
    });
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = (this.currentCategoryId++).toString();
    const category: Category = { ...insertCategory, _id: id };
    this.categories.set(id, category);
    return category;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.categoryId === categoryId);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = (this.currentProductId++).toString();
    const product: Product = { ...insertProduct, _id: id };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async updateProductStock(id: string, stock: number): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, stock };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrderById(id: string): Promise<OrderWithItems | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const items = Array.from(this.orderItems.values())
      .filter(item => item.orderId === id)
      .map(item => {
        const product = this.products.get(item.productId);
        return {
          ...item,
          product: product!
        };
      });

    return { ...order, items };
  }

  async createOrder(insertOrder: InsertOrder, items: InsertOrderItem[]): Promise<OrderWithItems> {
    const orderId = (this.currentOrderId++).toString();
    const order: Order = { 
      ...insertOrder, 
      _id: orderId, 
      createdAt: new Date() 
    };
    this.orders.set(orderId, order);

    const orderItemsWithProduct: (OrderItem & { product: Product })[] = [];
    
    for (const item of items) {
      const orderItemId = (this.currentOrderItemId++).toString();
      const orderItem: OrderItem = { 
        ...item, 
        _id: orderItemId, 
        orderId 
      };
      this.orderItems.set(orderItemId, orderItem);

      const product = this.products.get(item.productId);
      if (product) {
        orderItemsWithProduct.push({
          ...orderItem,
          product
        });

        // Update product stock
        await this.updateProductStock(product._id!, product.stock - item.quantity);
      }
    }

    return { ...order, items: orderItemsWithProduct };
  }

  async updateOrderStatus(id: string, status: Order["status"]): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const orders = Array.from(this.orders.values());
    const products = Array.from(this.products.values());
    
    const totalRevenue = orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, order) => sum + parseFloat(order.total), 0);
    
    const uniqueCustomers = new Set(orders.map(o => o.customerEmail)).size;

    return {
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders: orders.length,
      totalProducts: products.length,
      activeCustomers: uniqueCustomers
    };
  }

  // Sales Analytics Methods
  async getSalesData(days: number = 30): Promise<SalesData[]> {
    const orders = Array.from(this.orders.values())
      .filter(o => o.status === 'delivered')
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    const salesMap = new Map<string, { revenue: number; orders: number }>();
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    // Initialize all dates with 0 values
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      salesMap.set(dateStr, { revenue: 0, orders: 0 });
    }

    // Populate with actual data
    orders.forEach(order => {
      const dateStr = order.createdAt.toISOString().split('T')[0];
      if (salesMap.has(dateStr)) {
        const current = salesMap.get(dateStr)!;
        salesMap.set(dateStr, {
          revenue: current.revenue + parseFloat(order.total),
          orders: current.orders + 1
        });
      }
    });

    return Array.from(salesMap.entries()).map(([date, data]) => ({
      date,
      revenue: data.revenue,
      orders: data.orders
    }));
  }

  async getTopProducts(limit: number = 10): Promise<TopProduct[]> {
    const orderItems = Array.from(this.orderItems.values());
    const productSales = new Map<string, { sales: number; revenue: number }>();

    orderItems.forEach(item => {
      const current = productSales.get(item.productId) || { sales: 0, revenue: 0 };
      productSales.set(item.productId, {
        sales: current.sales + item.quantity,
        revenue: current.revenue + (parseFloat(item.price) * item.quantity)
      });
    });

    const topProducts: TopProduct[] = [];
    for (const [productId, data] of productSales.entries()) {
      const product = this.products.get(productId);
      if (product) {
        topProducts.push({
          id: productId,
          name: product.name,
          sales: data.sales,
          revenue: data.revenue
        });
      }
    }

    return topProducts
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);
  }

  // User Management Methods
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const userId = (this.currentUserId++).toString();
    const user: User = {
      ...insertUser,
      _id: userId,
      createdAt: new Date()
    };
    this.users.set(userId, user);
    return user;
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserStatus(id: string, status: User["status"]): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, status };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUserManagementData(): Promise<UserManagementData> {
    const users = Array.from(this.users.values());
    return {
      users,
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      suspendedUsers: users.filter(u => u.status === 'suspended').length
    };
  }

  // Deal Management Methods
  private deals = new Map<string, Deal>();
  private currentDealId = 1;

  async getDeals(): Promise<Deal[]> {
    return Array.from(this.deals.values());
  }

  async getDealById(id: string): Promise<Deal | undefined> {
    return this.deals.get(id);
  }

  async createDeal(insertDeal: InsertDeal): Promise<Deal> {
    const dealId = (this.currentDealId++).toString();
    const deal: Deal = {
      ...insertDeal,
      _id: dealId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.deals.set(dealId, deal);
    return deal;
  }

  async updateDeal(id: string, updateData: Partial<InsertDeal>): Promise<Deal | undefined> {
    const deal = this.deals.get(id);
    if (!deal) return undefined;

    const updatedDeal = { 
      ...deal, 
      ...updateData, 
      updatedAt: new Date().toISOString() 
    };
    this.deals.set(id, updatedDeal);
    return updatedDeal;
  }

  async deleteDeal(id: string): Promise<boolean> {
    return this.deals.delete(id);
  }
}

export const storage = new MemStorage();
