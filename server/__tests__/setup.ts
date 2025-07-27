// Test setup file
import { storage } from '../storage';

// Extend Jest global types for TypeScript
declare global {
  function beforeEach(fn: () => void | Promise<void>): void;
}

// Reset storage before each test
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