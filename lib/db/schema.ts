import { pgTable, text, timestamp, integer, varchar, pgEnum } from 'drizzle-orm/pg-core';

// Enums for status fields
export const checkoutStatusEnum = pgEnum('checkout_status', [
  'pending',
  'completed',
  'expired',
  'canceled'
]);

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'paid',
  'failed',
  'refunded'
]);

export const orderTypeEnum = pgEnum('order_type', [
  'onetime',
  'recurring'
]);

// Checkout sessions table
export const checkoutSessions = pgTable('checkout_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(), // Supabase user ID
  productId: text('product_id').notNull(),
  productName: text('product_name').notNull(),
  requestId: text('request_id'),
  checkoutUrl: text('checkout_url'),
  successUrl: text('success_url'),
  status: checkoutStatusEnum('status').default('pending'),
  units: integer('units').default(1),
  amount: integer('amount').notNull(), // Amount in cents
  currency: varchar('currency', { length: 3 }).default('USD'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Orders table (for completed payments)
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  checkoutSessionId: text('checkout_session_id').references(() => checkoutSessions.id),
  userId: text('user_id').notNull(),
  customerId: text('customer_id'), // Creem customer ID
  productId: text('product_id').notNull(),
  productName: text('product_name').notNull(),
  orderId: text('order_id'), // Creem order ID
  subscriptionId: text('subscription_id'), // For recurring payments
  status: orderStatusEnum('status').default('pending'),
  type: orderTypeEnum('type').notNull(),
  amount: integer('amount').notNull(),
  currency: varchar('currency', { length: 3 }).default('USD'),
  signature: text('signature'), // Creem signature for verification
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Type exports for TypeScript
export type InsertCheckoutSession = typeof checkoutSessions.$inferInsert;
export type SelectCheckoutSession = typeof checkoutSessions.$inferSelect;

export type InsertOrder = typeof orders.$inferInsert;
export type SelectOrder = typeof orders.$inferSelect; 