import { pgTable, text, serial, integer, boolean, timestamp, json, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  googleId: text("google_id").unique(),
  role: text("role").default("user").notNull(), // 'user', 'admin', 'moderator'
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  googleId: true,
  role: true,
  isActive: true,
});

export const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  destination: text("destination").notNull(),
  startDate: date("start_date"),
  endDate: date("end_date"),
  budget: text("budget"),
  preferences: text("preferences").array(),
  status: text("status").default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTripSchema = createInsertSchema(trips).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const tripRelations = relations(trips, ({ one, many }) => ({
  user: one(users, {
    fields: [trips.userId],
    references: [users.id],
  }),
  days: many(tripDays),
  bookings: many(bookings),
}));

export const tripDays = pgTable("trip_days", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id").notNull().references(() => trips.id),
  dayNumber: integer("day_number").notNull(),
  date: date("date"),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTripDaySchema = createInsertSchema(tripDays).omit({
  id: true,
  createdAt: true,
});

export const tripDayRelations = relations(tripDays, ({ one, many }) => ({
  trip: one(trips, {
    fields: [tripDays.tripId],
    references: [trips.id],
  }),
  activities: many(activities),
}));

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  tripDayId: integer("trip_day_id").notNull().references(() => tripDays.id),
  title: text("title").notNull(),
  description: text("description"),
  time: text("time"),
  location: text("location"),
  type: text("type"),
  bookingId: integer("booking_id").references(() => bookings.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const activityRelations = relations(activities, ({ one }) => ({
  tripDay: one(tripDays, {
    fields: [activities.tripDayId],
    references: [tripDays.id],
  }),
  booking: one(bookings, {
    fields: [activities.bookingId],
    references: [bookings.id],
  }),
}));

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id").notNull().references(() => trips.id),
  type: text("type").notNull(), // "flight", "hotel", "activity"
  title: text("title").notNull(),
  provider: text("provider"),
  price: text("price"),
  details: json("details"),
  confirmed: boolean("confirmed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export const bookingRelations = relations(bookings, ({ one, many }) => ({
  trip: one(trips, {
    fields: [bookings.tripId],
    references: [trips.id],
  }),
  activities: many(activities),
}));

export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  rating: text("rating"),
  reviewCount: integer("review_count"),
  priceEstimate: text("price_estimate"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true,
  createdAt: true,
});

// Analytics tables
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(), // 'login', 'trip_created', 'search', etc.
  userId: integer("user_id").references(() => users.id),
  data: json("data"), // Store event-specific data
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  createdAt: true,
});

// Admin logs
export const adminLogs = pgTable("admin_logs", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id").references(() => users.id).notNull(),
  action: text("action").notNull(), // 'user_blocked', 'destination_added', etc.
  entityType: text("entity_type"), // 'user', 'trip', 'destination', etc.
  entityId: integer("entity_id"), // ID of the affected entity
  details: text("details"), // Additional information
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAdminLogSchema = createInsertSchema(adminLogs).omit({
  id: true,
  createdAt: true,
});

// AI prompts for admins to customize
export const aiPrompts = pgTable("ai_prompts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  prompt: text("prompt").notNull(),
  description: text("description"),
  category: text("category").notNull(), // 'trip_planning', 'destination_info', etc.
  isActive: boolean("is_active").default(true).notNull(),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAiPromptSchema = createInsertSchema(aiPrompts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Reviews table for user reviews
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  targetType: text("target_type").notNull(), // 'hotel', 'restaurant', 'attraction', 'trip'
  targetId: text("target_id").notNull(), // Could be an external ID for hotels/restaurants or an internal ID for trips
  title: text("title").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(), // 1-5 rating
  images: text("images").array(), // Array of image URLs
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  isApproved: boolean("is_approved").default(true),
  helpfulCount: integer("helpful_count").default(0),
  reportCount: integer("report_count").default(0),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  helpfulCount: true,
  reportCount: true,
});

export const reviewRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

// Export type declarations for all tables
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Trip = typeof trips.$inferSelect;
export type InsertTrip = z.infer<typeof insertTripSchema>;
export type TripDay = typeof tripDays.$inferSelect;
export type InsertTripDay = z.infer<typeof insertTripDaySchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Destination = typeof destinations.$inferSelect;
export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type AdminLog = typeof adminLogs.$inferSelect;
export type InsertAdminLog = z.infer<typeof insertAdminLogSchema>;
export type AiPrompt = typeof aiPrompts.$inferSelect;
export type InsertAiPrompt = z.infer<typeof insertAiPromptSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
