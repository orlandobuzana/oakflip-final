import { 
  categories, 
  products, 
  orders, 
  orderItems,
  type Category, 
  type Product, 
  type Order, 
  type OrderItem,
  type InsertCategory, 
  type InsertProduct, 
  type InsertOrder, 
  type InsertOrderItem,
  type ProductWithCategory,
  type OrderWithItems,
  type DashboardStats
} from "@shared/schema";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  updateProductStock(id: number, stock: number): Promise<Product | undefined>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrderById(id: number): Promise<OrderWithItems | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<OrderWithItems>;
  updateOrderStatus(id: number, status: Order["status"]): Promise<Order | undefined>;

  // Dashboard
  getDashboardStats(): Promise<DashboardStats>;
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private currentCategoryId: number;
  private currentProductId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;

  constructor() {
    this.categories = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.currentCategoryId = 1;
    this.currentProductId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;

    this.initializeData();
  }

  private initializeData() {
    // Initialize categories
    const categoriesData: InsertCategory[] = [
      {
        name: "Electronics",
        description: "Latest technology and gadgets",
        image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
      },
      {
        name: "Fashion",
        description: "Stylish clothing and accessories",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
      },
      {
        name: "Home & Garden",
        description: "Everything for your home",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
      },
      {
        name: "Sports",
        description: "Sports equipment and gear",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
      }
    ];

    categoriesData.forEach(cat => {
      const category: Category = { ...cat, id: this.currentCategoryId++ };
      this.categories.set(category.id, category);
    });

    // Initialize products
    const productsData: InsertProduct[] = [
      {
        name: "Premium Wireless Headphones",
        description: "High-quality sound with noise cancellation",
        price: "199.99",
        categoryId: 1,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"],
        stock: 50,
        sku: "WH-001",
        rating: "4.8",
        reviewCount: 156,
        features: ["Noise Cancellation", "30-hour Battery", "Wireless Charging"]
      },
      {
        name: "Latest Smartphone",
        description: "Advanced camera and lightning-fast performance",
        price: "799.99",
        categoryId: 1,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"],
        stock: 30,
        sku: "SP-001",
        rating: "4.7",
        reviewCount: 89,
        features: ["Triple Camera System", "5G Ready", "Face ID"]
      },
      {
        name: "Professional Laptop",
        description: "High-performance computing for work and creativity",
        price: "1299.99",
        originalPrice: "1499.99",
        categoryId: 1,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"],
        stock: 15,
        sku: "LP-001",
        rating: "4.9",
        reviewCount: 234,
        features: ["Intel Core i7", "16GB RAM", "512GB SSD", "Dedicated Graphics"]
      },
      {
        name: "Designer Sneakers",
        description: "Comfortable and stylish everyday footwear",
        price: "129.99",
        categoryId: 2,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"],
        stock: 75,
        sku: "SN-001",
        rating: "4.5",
        reviewCount: 67,
        features: ["Premium Materials", "Comfortable Fit", "Durable Design"]
      },
      {
        name: "Digital Camera",
        description: "Professional DSLR with advanced features",
        price: "899.99",
        originalPrice: "1199.99",
        categoryId: 1,
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        images: ["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"],
        stock: 25,
        sku: "DC-001",
        rating: "4.6",
        reviewCount: 124,
        features: ["24MP Sensor", "4K Video", "Image Stabilization"]
      },
      {
        name: "Wireless Earbuds",
        description: "True wireless audio with premium sound quality",
        price: "79.99",
        categoryId: 1,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"],
        stock: 45,
        sku: "WE-001",
        rating: "4.4",
        reviewCount: 89,
        features: ["Touch Controls", "Water Resistant", "Quick Charge"]
      }
    ];

    productsData.forEach(prod => {
      const product: Product = { ...prod, id: this.currentProductId++ };
      this.products.set(product.id, product);
    });
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.categoryId === categoryId);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  async updateProductStock(id: number, stock: number): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, stock };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrderById(id: number): Promise<OrderWithItems | undefined> {
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
    const orderId = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder, 
      id: orderId, 
      createdAt: new Date() 
    };
    this.orders.set(orderId, order);

    const orderItemsWithProduct: (OrderItem & { product: Product })[] = [];
    
    for (const item of items) {
      const orderItemId = this.currentOrderItemId++;
      const orderItem: OrderItem = { 
        ...item, 
        id: orderItemId, 
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
        await this.updateProductStock(product.id, product.stock - item.quantity);
      }
    }

    return { ...order, items: orderItemsWithProduct };
  }

  async updateOrderStatus(id: number, status: Order["status"]): Promise<Order | undefined> {
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
}

export const storage = new MemStorage();
