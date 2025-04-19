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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  googleId: true,
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
