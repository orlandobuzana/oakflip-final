import { pgTable, text, serial, integer, decimal, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  categoryId: integer("category_id").references(() => categories.id),
  image: text("image").notNull(),
  images: text("images").array(),
  stock: integer("stock").notNull().default(0),
  sku: text("sku").notNull().unique(),
  status: text("status", { enum: ["active", "inactive", "out_of_stock"] }).notNull().default("active"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  features: text("features").array(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerAddress: text("customer_address").notNull(),
  customerCity: text("customer_city").notNull(),
  customerZip: text("customer_zip").notNull(),
  status: text("status", { enum: ["pending", "processing", "shipped", "delivered", "cancelled"] }).notNull().default("pending"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shipping: decimal("shipping", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

// Additional types for API responses
export type ProductWithCategory = Product & {
  category?: Category;
};

export type OrderWithItems = Order & {
  items: (OrderItem & { product: Product })[];
};

export type CartItem = {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
};

export type DashboardStats = {
  totalRevenue: string;
  totalOrders: number;
  totalProducts: number;
  activeCustomers: number;
};
