import { z } from "zod";

// MongoDB Schema definitions using Zod
export const categorySchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
});

export const productSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  price: z.string(),
  originalPrice: z.string().optional(),
  categoryId: z.string().optional(),
  image: z.string(),
  images: z.array(z.string()).optional(),
  stock: z.number().default(0),
  sku: z.string(),
  status: z.enum(["active", "inactive", "out_of_stock"]).default("active"),
  rating: z.string().default("0"),
  reviewCount: z.number().default(0),
  features: z.array(z.string()).optional(),
});

export const orderSchema = z.object({
  _id: z.string().optional(),
  customerName: z.string(),
  customerEmail: z.string(),
  customerAddress: z.string(),
  customerCity: z.string(),
  customerZip: z.string(),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending"),
  subtotal: z.string(),
  shipping: z.string(),
  tax: z.string(),
  total: z.string(),
  createdAt: z.date().default(() => new Date()),
});

export const orderItemSchema = z.object({
  _id: z.string().optional(),
  orderId: z.string(),
  productId: z.string(),
  quantity: z.number(),
  price: z.string(),
});

export const insertCategorySchema = categorySchema.omit({ _id: true });
export const insertProductSchema = productSchema.omit({ _id: true });
export const insertOrderSchema = orderSchema.omit({ _id: true, createdAt: true });
export const insertOrderItemSchema = orderItemSchema.omit({ _id: true });

export type Category = z.infer<typeof categorySchema>;
export type Product = z.infer<typeof productSchema>;
export type Order = z.infer<typeof orderSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;

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
  id: string;
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
