import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import type {
  Category,
  Product,
  Order,
  OrderItem,
  InsertCategory,
  InsertProduct,
  InsertOrder,
  InsertOrderItem,
  OrderWithItems,
  DashboardStats
} from '@shared/schema';

class MongoDB {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  async connect(): Promise<void> {
    try {
      const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
      this.client = new MongoClient(uri);
      await this.client.connect();
      this.db = this.client.db();
      console.log('Connected to MongoDB');
      
      // Initialize with sample data if collections are empty
      await this.initializeData();
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      console.log('Disconnected from MongoDB');
    }
  }

  private getCollection(name: string): Collection {
    if (!this.db) {
      throw new Error('Database not connected');
    }
    return this.db.collection(name);
  }

  private async initializeData(): Promise<void> {
    const categoriesCol = this.getCollection<Category>('categories');
    const productsCol = this.getCollection<Product>('products');

    const categoryCount = await categoriesCol.countDocuments();
    const productCount = await productsCol.countDocuments();

    if (categoryCount === 0) {
      const categories: InsertCategory[] = [
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

      await categoriesCol.insertMany(categories);
    }

    if (productCount === 0) {
      const electronicsCategory = await categoriesCol.findOne({ name: "Electronics" });
      const fashionCategory = await categoriesCol.findOne({ name: "Fashion" });

      const products: InsertProduct[] = [
        {
          name: "Premium Wireless Headphones",
          description: "High-quality sound with noise cancellation",
          price: "199.99",
          categoryId: electronicsCategory?._id?.toString(),
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
          name: "Latest Smartphone",
          description: "Advanced camera and lightning-fast performance",
          price: "799.99",
          categoryId: electronicsCategory?._id?.toString(),
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
          name: "Professional Laptop",
          description: "High-performance computing for work and creativity",
          price: "1299.99",
          originalPrice: "1499.99",
          categoryId: electronicsCategory?._id?.toString(),
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
          name: "Designer Sneakers",
          description: "Comfortable and stylish everyday footwear",
          price: "129.99",
          categoryId: fashionCategory?._id?.toString(),
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
          name: "Digital Camera",
          description: "Professional DSLR with advanced features",
          price: "899.99",
          originalPrice: "1199.99",
          categoryId: electronicsCategory?._id?.toString(),
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
          name: "Wireless Earbuds",
          description: "True wireless audio with premium sound quality",
          price: "79.99",
          categoryId: electronicsCategory?._id?.toString(),
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

      await productsCol.insertMany(products);
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const categories = await this.getCollection<Category>('categories')
      .find({})
      .toArray();
    
    return categories.map(cat => ({
      ...cat,
      _id: cat._id?.toString()
    }));
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    const category = await this.getCollection<Category>('categories')
      .findOne({ _id: new ObjectId(id) });
    
    if (!category) return undefined;
    
    return {
      ...category,
      _id: category._id?.toString()
    };
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await this.getCollection<InsertCategory>('categories')
      .insertOne(category);
    
    return {
      ...category,
      _id: result.insertedId.toString()
    };
  }

  // Products
  async getProducts(): Promise<Product[]> {
    const products = await this.getCollection<Product>('products')
      .find({})
      .toArray();
    
    return products.map(product => ({
      ...product,
      _id: product._id?.toString()
    }));
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const product = await this.getCollection<Product>('products')
      .findOne({ _id: new ObjectId(id) });
    
    if (!product) return undefined;
    
    return {
      ...product,
      _id: product._id?.toString()
    };
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const products = await this.getCollection<Product>('products')
      .find({ categoryId })
      .toArray();
    
    return products.map(product => ({
      ...product,
      _id: product._id?.toString()
    }));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await this.getCollection<InsertProduct>('products')
      .insertOne(product);
    
    return {
      ...product,
      _id: result.insertedId.toString()
    };
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const result = await this.getCollection<Product>('products')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updates },
        { returnDocument: 'after' }
      );
    
    if (!result) return undefined;
    
    return {
      ...result,
      _id: result._id?.toString()
    };
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await this.getCollection<Product>('products')
      .deleteOne({ _id: new ObjectId(id) });
    
    return result.deletedCount > 0;
  }

  async updateProductStock(id: string, stock: number): Promise<Product | undefined> {
    const result = await this.getCollection<Product>('products')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { stock } },
        { returnDocument: 'after' }
      );
    
    if (!result) return undefined;
    
    return {
      ...result,
      _id: result._id?.toString()
    };
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    const orders = await this.getCollection<Order>('orders')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return orders.map(order => ({
      ...order,
      _id: order._id?.toString()
    }));
  }

  async getOrderById(id: string): Promise<OrderWithItems | undefined> {
    const order = await this.getCollection<Order>('orders')
      .findOne({ _id: new ObjectId(id) });
    
    if (!order) return undefined;

    const orderItems = await this.getCollection<OrderItem>('orderItems')
      .find({ orderId: id })
      .toArray();

    const itemsWithProducts = await Promise.all(
      orderItems.map(async (item) => {
        const product = await this.getProductById(item.productId);
        return {
          ...item,
          _id: item._id?.toString(),
          product: product!
        };
      })
    );

    return {
      ...order,
      _id: order._id?.toString(),
      items: itemsWithProducts
    };
  }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<OrderWithItems> {
    const orderWithDate = {
      ...order,
      createdAt: new Date()
    };

    const orderResult = await this.getCollection<typeof orderWithDate>('orders')
      .insertOne(orderWithDate);

    const orderId = orderResult.insertedId.toString();

    const orderItemsWithOrderId = items.map(item => ({
      ...item,
      orderId
    }));

    const itemsResult = await this.getCollection<typeof orderItemsWithOrderId[0]>('orderItems')
      .insertMany(orderItemsWithOrderId);

    // Update product stock
    for (const item of items) {
      const product = await this.getProductById(item.productId);
      if (product) {
        await this.updateProductStock(item.productId, product.stock - item.quantity);
      }
    }

    const itemsWithProducts = await Promise.all(
      orderItemsWithOrderId.map(async (item, index) => {
        const product = await this.getProductById(item.productId);
        return {
          ...item,
          _id: itemsResult.insertedIds[index].toString(),
          product: product!
        };
      })
    );

    return {
      ...orderWithDate,
      _id: orderId,
      items: itemsWithProducts
    };
  }

  async updateOrderStatus(id: string, status: Order["status"]): Promise<Order | undefined> {
    const result = await this.getCollection<Order>('orders')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { status } },
        { returnDocument: 'after' }
      );
    
    if (!result) return undefined;
    
    return {
      ...result,
      _id: result._id?.toString()
    };
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const orders = await this.getOrders();
    const products = await this.getProducts();
    
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

export const mongodb = new MongoDB();