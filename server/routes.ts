import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { generateTripIdea, generateItinerary } from "./gemini";
import { trips, insertTripSchema, insertTripDaySchema, insertActivitySchema, insertBookingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Trip routes
  app.get("/api/trips", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const userTrips = await storage.getTripsByUserId(req.user.id);
      res.json(userTrips);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trips" });
    }
  });

  app.get("/api/trips/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const tripId = parseInt(req.params.id);
      const trip = await storage.getTripById(tripId);
      
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      
      if (trip.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to view this trip" });
      }
      
      const tripDays = await storage.getTripDaysByTripId(tripId);
      const bookings = await storage.getBookingsByTripId(tripId);
      
      // Get activities for each day
      const daysWithActivities = await Promise.all(
        tripDays.map(async (day) => {
          const activities = await storage.getActivitiesByTripDayId(day.id);
          return { ...day, activities };
        })
      );
      
      res.json({
        ...trip,
        days: daysWithActivities,
        bookings
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trip details" });
    }
  });

  app.post("/api/trips", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const tripData = insertTripSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const newTrip = await storage.createTrip(tripData);
      res.status(201).json(newTrip);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid trip data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create trip" });
    }
  });

  app.put("/api/trips/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const tripId = parseInt(req.params.id);
      const existingTrip = await storage.getTripById(tripId);
      
      if (!existingTrip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      
      if (existingTrip.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to update this trip" });
      }
      
      const tripData = insertTripSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const updatedTrip = await storage.updateTrip(tripId, tripData);
      res.json(updatedTrip);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid trip data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update trip" });
    }
  });

  app.delete("/api/trips/:id", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const tripId = parseInt(req.params.id);
      const existingTrip = await storage.getTripById(tripId);
      
      if (!existingTrip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      
      if (existingTrip.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to delete this trip" });
      }
      
      await storage.deleteTrip(tripId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete trip" });
    }
  });

  // Trip days routes
  app.post("/api/trips/:tripId/days", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const tripId = parseInt(req.params.tripId);
      const trip = await storage.getTripById(tripId);
      
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      
      if (trip.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to modify this trip" });
      }
      
      const dayData = insertTripDaySchema.parse({
        ...req.body,
        tripId
      });
      
      const newDay = await storage.createTripDay(dayData);
      res.status(201).json(newDay);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid day data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create trip day" });
    }
  });

  // Activities routes
  app.post("/api/days/:dayId/activities", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const dayId = parseInt(req.params.dayId);
      const day = await storage.getTripDayById(dayId);
      
      if (!day) {
        return res.status(404).json({ message: "Trip day not found" });
      }
      
      const trip = await storage.getTripById(day.tripId);
      
      if (trip.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to modify this trip" });
      }
      
      const activityData = insertActivitySchema.parse({
        ...req.body,
        tripDayId: dayId
      });
      
      const newActivity = await storage.createActivity(activityData);
      res.status(201).json(newActivity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid activity data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create activity" });
    }
  });

  // Bookings routes
  app.post("/api/trips/:tripId/bookings", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const tripId = parseInt(req.params.tripId);
      const trip = await storage.getTripById(tripId);
      
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      
      if (trip.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to modify this trip" });
      }
      
      const bookingData = insertBookingSchema.parse({
        ...req.body,
        tripId
      });
      
      const newBooking = await storage.createBooking(bookingData);
      res.status(201).json(newBooking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Destinations
  app.get("/api/destinations", async (req: Request, res: Response) => {
    try {
      const destinations = await storage.getAllDestinations();
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destinations" });
    }
  });

  app.get("/api/destinations/:id", async (req: Request, res: Response) => {
    try {
      const destinationId = parseInt(req.params.id);
      const destination = await storage.getDestinationById(destinationId);
      
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }
      
      res.json(destination);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destination" });
    }
  });

  // AI trip generation routes
  app.post("/api/ai/trip-idea", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const { destination, preferences, duration } = req.body;
      
      if (!destination) {
        return res.status(400).json({ message: "Destination is required" });
      }
      
      const tripIdea = await generateTripIdea(destination, preferences, duration);
      res.json({ tripIdea });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate trip idea" });
    }
  });

  app.post("/api/ai/generate-itinerary", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const { tripId } = req.body;
      
      if (!tripId) {
        return res.status(400).json({ message: "Trip ID is required" });
      }
      
      const trip = await storage.getTripById(parseInt(tripId));
      
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      
      if (trip.userId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to access this trip" });
      }
      
      const itinerary = await generateItinerary(trip);
      
      // Process and save the generated itinerary
      for (const day of itinerary.days) {
        const tripDay = await storage.createTripDay({
          tripId: trip.id,
          dayNumber: day.dayNumber,
          title: day.title,
          date: day.date
        });
        
        for (const activity of day.activities) {
          await storage.createActivity({
            tripDayId: tripDay.id,
            title: activity.title,
            description: activity.description,
            time: activity.time,
            location: activity.location,
            type: activity.type
          });
        }
      }
      
      // Save bookings if any
      if (itinerary.bookings && itinerary.bookings.length > 0) {
        for (const booking of itinerary.bookings) {
          await storage.createBooking({
            tripId: trip.id,
            type: booking.type,
            title: booking.title,
            provider: booking.provider,
            price: booking.price,
            details: booking.details,
            confirmed: false
          });
        }
      }
      
      const updatedTrip = await storage.getTripById(trip.id);
      const tripDays = await storage.getTripDaysByTripId(trip.id);
      const bookings = await storage.getBookingsByTripId(trip.id);
      
      const daysWithActivities = await Promise.all(
        tripDays.map(async (day) => {
          const activities = await storage.getActivitiesByTripDayId(day.id);
          return { ...day, activities };
        })
      );
      
      res.json({
        ...updatedTrip,
        days: daysWithActivities,
        bookings
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate itinerary" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
