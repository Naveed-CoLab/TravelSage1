import { 
  users, 
  trips, 
  tripDays, 
  activities, 
  bookings,
  destinations,
  type User, 
  type InsertUser, 
  type Trip, 
  type InsertTrip,
  type TripDay,
  type InsertTripDay,
  type Activity,
  type InsertActivity,
  type Booking,
  type InsertBooking,
  type Destination,
  type InsertDestination
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Trip methods
  getTripsByUserId(userId: number): Promise<Trip[]>;
  getTripById(id: number): Promise<Trip | undefined>;
  createTrip(trip: InsertTrip): Promise<Trip>;
  updateTrip(id: number, trip: InsertTrip): Promise<Trip>;
  deleteTrip(id: number): Promise<void>;

  // Trip day methods
  getTripDaysByTripId(tripId: number): Promise<TripDay[]>;
  getTripDayById(id: number): Promise<TripDay | undefined>;
  createTripDay(tripDay: InsertTripDay): Promise<TripDay>;
  updateTripDay(id: number, tripDay: InsertTripDay): Promise<TripDay>;
  deleteTripDay(id: number): Promise<void>;

  // Activity methods
  getActivitiesByTripDayId(tripDayId: number): Promise<Activity[]>;
  getActivityById(id: number): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: number, activity: InsertActivity): Promise<Activity>;
  deleteActivity(id: number): Promise<void>;

  // Booking methods
  getBookingsByTripId(tripId: number): Promise<Booking[]>;
  getBookingById(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, booking: InsertBooking): Promise<Booking>;
  deleteBooking(id: number): Promise<void>;

  // Destination methods
  getAllDestinations(): Promise<Destination[]>;
  getDestinationById(id: number): Promise<Destination | undefined>;
  createDestination(destination: InsertDestination): Promise<Destination>;

  // Session store
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Trip methods
  async getTripsByUserId(userId: number): Promise<Trip[]> {
    return db.select().from(trips).where(eq(trips.userId, userId)).orderBy(desc(trips.createdAt));
  }

  async getTripById(id: number): Promise<Trip | undefined> {
    const [trip] = await db.select().from(trips).where(eq(trips.id, id));
    return trip;
  }

  async createTrip(trip: InsertTrip): Promise<Trip> {
    const [newTrip] = await db.insert(trips).values(trip).returning();
    return newTrip;
  }

  async updateTrip(id: number, trip: InsertTrip): Promise<Trip> {
    const [updatedTrip] = await db
      .update(trips)
      .set({ ...trip, updatedAt: new Date() })
      .where(eq(trips.id, id))
      .returning();
    return updatedTrip;
  }

  async deleteTrip(id: number): Promise<void> {
    try {
      // Start transaction for atomicity
      await db.transaction(async (tx) => {
        // First, get all trip days to find related activities
        const tripDaysResult = await tx.select().from(tripDays).where(eq(tripDays.tripId, id));
        
        // Delete activities for each trip day
        for (const day of tripDaysResult) {
          await tx.delete(activities).where(eq(activities.tripDayId, day.id));
        }
        
        // Delete bookings that might be related to activities
        await tx.delete(bookings).where(eq(bookings.tripId, id));
        
        // Delete the trip days after activities are removed
        await tx.delete(tripDays).where(eq(tripDays.tripId, id));
        
        // Finally delete the trip itself
        const result = await tx.delete(trips).where(eq(trips.id, id)).returning({ id: trips.id });
        
        if (result.length === 0) {
          throw new Error(`Trip with ID ${id} not found or could not be deleted`);
        }
      });
      
      console.log(`Successfully deleted trip with ID ${id} and all related data`);
    } catch (error) {
      console.error(`Error deleting trip with ID ${id}:`, error);
      throw error;
    }
  }

  // Trip day methods
  async getTripDaysByTripId(tripId: number): Promise<TripDay[]> {
    return db.select().from(tripDays).where(eq(tripDays.tripId, tripId)).orderBy(tripDays.dayNumber);
  }

  async getTripDayById(id: number): Promise<TripDay | undefined> {
    const [day] = await db.select().from(tripDays).where(eq(tripDays.id, id));
    return day;
  }

  async createTripDay(tripDay: InsertTripDay): Promise<TripDay> {
    const [newDay] = await db.insert(tripDays).values(tripDay).returning();
    return newDay;
  }

  async updateTripDay(id: number, tripDay: InsertTripDay): Promise<TripDay> {
    const [updatedDay] = await db
      .update(tripDays)
      .set(tripDay)
      .where(eq(tripDays.id, id))
      .returning();
    return updatedDay;
  }

  async deleteTripDay(id: number): Promise<void> {
    try {
      await db.transaction(async (tx) => {
        // Delete associated activities first
        await tx.delete(activities).where(eq(activities.tripDayId, id));
        
        // Then delete the trip day
        const result = await tx.delete(tripDays).where(eq(tripDays.id, id)).returning({ id: tripDays.id });
        
        if (result.length === 0) {
          throw new Error(`Trip day with ID ${id} not found or could not be deleted`);
        }
      });
      
      console.log(`Successfully deleted trip day with ID ${id} and all related activities`);
    } catch (error) {
      console.error(`Error deleting trip day with ID ${id}:`, error);
      throw error;
    }
  }

  // Activity methods
  async getActivitiesByTripDayId(tripDayId: number): Promise<Activity[]> {
    return db.select().from(activities).where(eq(activities.tripDayId, tripDayId));
  }

  async getActivityById(id: number): Promise<Activity | undefined> {
    const [activity] = await db.select().from(activities).where(eq(activities.id, id));
    return activity;
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  async updateActivity(id: number, activity: InsertActivity): Promise<Activity> {
    const [updatedActivity] = await db
      .update(activities)
      .set(activity)
      .where(eq(activities.id, id))
      .returning();
    return updatedActivity;
  }

  async deleteActivity(id: number): Promise<void> {
    await db.delete(activities).where(eq(activities.id, id));
  }

  // Booking methods
  async getBookingsByTripId(tripId: number): Promise<Booking[]> {
    return db.select().from(bookings).where(eq(bookings.tripId, tripId));
  }

  async getBookingById(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }

  async updateBooking(id: number, booking: InsertBooking): Promise<Booking> {
    const [updatedBooking] = await db
      .update(bookings)
      .set(booking)
      .where(eq(bookings.id, id))
      .returning();
    return updatedBooking;
  }

  async deleteBooking(id: number): Promise<void> {
    // Update any activities that reference this booking
    await db
      .update(activities)
      .set({ bookingId: null })
      .where(eq(activities.bookingId, id));
    
    await db.delete(bookings).where(eq(bookings.id, id));
  }

  // Destination methods
  async getAllDestinations(): Promise<Destination[]> {
    return db.select().from(destinations);
  }

  async getDestinationById(id: number): Promise<Destination | undefined> {
    const [destination] = await db.select().from(destinations).where(eq(destinations.id, id));
    return destination;
  }

  async createDestination(destination: InsertDestination): Promise<Destination> {
    const [newDestination] = await db.insert(destinations).values(destination).returning();
    return newDestination;
  }
}

export const storage = new DatabaseStorage();
