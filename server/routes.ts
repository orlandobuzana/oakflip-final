import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  createUserSession, 
  trackPageView, 
  trackCartEvent, 
  trackConversion, 
  getUserSession,
  getAnalyticsSummary,
  getDailyStats,
  getCountryFromIP,
  getLanguageFromCountry 
} from "./analytics";
import { insertProductSchema, insertOrderSchema, insertOrderItemSchema, insertUserSchema, insertDealSchema } from "@shared/schema";
import { z } from "zod";

const createOrderWithItemsSchema = z.object({
  order: insertOrderSchema,
  items: z.array(insertOrderItemSchema)
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const category = await storage.getCategoryById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category } = req.query;
      let products;
      
      if (category && typeof category === 'string') {
        products = await storage.getProductsByCategory(category);
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Shipping routes
  app.post("/api/shipping/calculate", async (req, res) => {
    try {
      const { state, subtotal, itemCount } = req.body;
      
      if (!state || !subtotal || !itemCount) {
        return res.status(400).json({ message: "State, subtotal, and item count are required" });
      }

      const { calculateShippingRates, calculateTax } = await import('./shippingRates');
      
      const shippingRates = calculateShippingRates(state, parseFloat(subtotal), parseInt(itemCount));
      const tax = calculateTax(parseFloat(subtotal), state);
      
      res.json({
        shippingRates,
        tax: tax.toFixed(2),
        taxRate: state
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate shipping rates" });
    }
  });

  // Orders routes
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const order = await storage.getOrderById(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = createOrderWithItemsSchema.parse(req.body);
      const order = await storage.createOrder(validatedData.order, validatedData.items);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      const id = req.params.id;
      const { status } = req.body;
      
      if (!["pending", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const order = await storage.updateOrderStatus(id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Sales Analytics routes
  app.get("/api/analytics/sales", async (req, res) => {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const salesData = await storage.getSalesData(days);
      res.json(salesData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sales data" });
    }
  });

  app.get("/api/analytics/top-products", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const topProducts = await storage.getTopProducts(limit);
      res.json(topProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top products" });
    }
  });

  // User Management routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/management", async (req, res) => {
    try {
      const data = await storage.getUserManagementData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user management data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const user = await storage.getUserById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const validatedData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(id, validatedData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.put("/api/users/:id/status", async (req, res) => {
    try {
      const id = req.params.id;
      const { status } = req.body;
      
      if (!["active", "suspended", "inactive"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const user = await storage.updateUserStatus(id, status);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user status" });
    }
  });

  // Deals Management routes
  app.get("/api/deals", async (req, res) => {
    try {
      const deals = await storage.getDeals();
      res.json(deals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });

  app.get("/api/deals/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const deal = await storage.getDealById(id);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      res.json(deal);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deal" });
    }
  });

  app.post("/api/deals", async (req, res) => {
    try {
      const validatedData = insertDealSchema.parse(req.body);
      const deal = await storage.createDeal(validatedData);
      res.status(201).json(deal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid deal data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create deal" });
    }
  });

  app.put("/api/deals/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const validatedData = insertDealSchema.partial().parse(req.body);
      const deal = await storage.updateDeal(id, validatedData);
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      res.json(deal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid deal data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update deal" });
    }
  });

  app.delete("/api/deals/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const success = await storage.deleteDeal(id);
      if (!success) {
        return res.status(404).json({ message: "Deal not found" });
      }
      res.json({ message: "Deal deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete deal" });
    }
  });

  // Analytics tracking routes
  app.post('/api/analytics/session', (req, res) => {
    const sessionId = req.body.sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const ipAddress = req.ip || req.connection.remoteAddress || '127.0.0.1';
    const userAgent = req.get('User-Agent') || '';
    
    const session = createUserSession(sessionId, ipAddress, userAgent);
    res.json({ sessionId, language: session.language, country: session.country });
  });

  app.post('/api/analytics/page-view', (req, res) => {
    const { sessionId, path, referrer } = req.body;
    trackPageView(sessionId, path, referrer);
    res.json({ success: true });
  });

  app.post('/api/analytics/cart-event', (req, res) => {
    const { sessionId, type, productId, quantity, value } = req.body;
    trackCartEvent(sessionId, type, productId, quantity, value);
    res.json({ success: true });
  });

  app.post('/api/analytics/conversion', (req, res) => {
    const { sessionId, type, orderId, value } = req.body;
    trackConversion(sessionId, type, orderId, value);
    res.json({ success: true });
  });

  app.get('/api/analytics/summary', (req, res) => {
    const days = parseInt(req.query.days as string) || 7;
    const summary = getAnalyticsSummary(days);
    res.json(summary);
  });

  app.get('/api/analytics/daily/:date', (req, res) => {
    const stats = getDailyStats(req.params.date);
    res.json(stats || {});
  });

  // User language preference routes
  app.get('/api/user/language-preference', (req, res) => {
    const ipAddress = req.ip || req.connection.remoteAddress || '127.0.0.1';
    const country = getCountryFromIP(ipAddress);
    const language = getLanguageFromCountry(country);
    
    res.json({ language, country });
  });

  app.post('/api/user/language-preference', (req, res) => {
    const { language } = req.body;
    // In a real app, save to user profile or session
    res.json({ success: true, language });
  });

  const httpServer = createServer(app);
  return httpServer;
}
