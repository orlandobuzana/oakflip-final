import { 
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
}

import { mongodb } from './mongodb';

// Initialize MongoDB connection
mongodb.connect().catch(console.error);

export const storage = mongodb;
