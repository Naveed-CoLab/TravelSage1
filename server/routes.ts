import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { generateTripIdea, generateItinerary } from "./gemini";
import { searchFlights, searchAirports, getAirlineInfo } from "./services/amadeus";
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
      
      if (!trip) {
        return res.status(404).json({ message: "Associated trip not found" });
      }
      
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

  // Flight search APIs using Amadeus
  app.get("/api/airports/search", async (req: Request, res: Response) => {
    try {
      const { keyword } = req.query;
      
      if (!keyword || typeof keyword !== 'string' || keyword.length < 2) {
        return res.status(400).json({ message: "Keyword parameter is required and must be at least 2 characters" });
      }
      
      const airports = await searchAirports(keyword);
      res.json(airports);
    } catch (error) {
      console.error("Error searching airports:", error);
      res.status(500).json({ message: "Failed to search airports", error: (error as Error).message });
    }
  });
  
  app.get("/api/airlines/:code", async (req: Request, res: Response) => {
    try {
      const { code } = req.params;
      
      if (!code) {
        return res.status(400).json({ message: "Airline code is required" });
      }
      
      const airline = await getAirlineInfo(code);
      res.json(airline);
    } catch (error) {
      console.error("Error getting airline info:", error);
      res.status(500).json({ message: "Failed to get airline information", error: (error as Error).message });
    }
  });
  
  app.post("/api/flights/search", async (req: Request, res: Response) => {
    try {
      const { 
        originLocationCode,
        destinationLocationCode,
        departureDate,
        returnDate,
        adults = 1,
        children,
        infants,
        travelClass,
        currencyCode,
        maxPrice,
        max = 50
      } = req.body;
      
      // Validate required parameters
      if (!originLocationCode || !destinationLocationCode || !departureDate) {
        return res.status(400).json({ 
          message: "Missing required parameters", 
          required: ["originLocationCode", "destinationLocationCode", "departureDate"] 
        });
      }
      
      // Validate date format (should be YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(departureDate) || (returnDate && !dateRegex.test(returnDate))) {
        return res.status(400).json({ 
          message: "Invalid date format. Use YYYY-MM-DD format" 
        });
      }
      
      // Search flights
      const flightOffers = await searchFlights({
        originLocationCode,
        destinationLocationCode,
        departureDate,
        returnDate,
        adults,
        children,
        infants,
        travelClass, 
        currencyCode,
        maxPrice,
        max
      });
      
      res.json(flightOffers);
    } catch (error) {
      console.error("Error searching flights:", error);
      res.status(500).json({ 
        message: "Failed to search flights", 
        error: (error as Error).message 
      });
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
      
      // Generate itinerary - this will now use fallback data if API key is missing
      const itinerary = await generateItinerary(trip);
      
      try {
        // Check if the trip already has days/activities before adding new ones
        const existingDays = await storage.getTripDaysByTripId(trip.id);
        if (existingDays.length > 0) {
          // Delete existing days and their activities before adding new ones
          for (const day of existingDays) {
            const activities = await storage.getActivitiesByTripDayId(day.id);
            for (const activity of activities) {
              await storage.deleteActivity(activity.id);
            }
            await storage.deleteTripDay(day.id);
          }
        }
        
        // Delete existing bookings before adding new ones
        const existingBookings = await storage.getBookingsByTripId(trip.id);
        for (const booking of existingBookings) {
          await storage.deleteBooking(booking.id);
        }
        
        // Process and save the generated itinerary
        for (const day of itinerary.days) {
          const dateString = day.date instanceof Date ? day.date.toISOString() : day.date;
          
          const tripDay = await storage.createTripDay({
            tripId: trip.id,
            dayNumber: day.dayNumber,
            title: day.title,
            date: dateString
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
        
        // Update trip status
        await storage.updateTrip(trip.id, {
          ...trip,
          status: "planned"
        });
        
        // Get updated trip data
        const updatedTrip = await storage.getTripById(trip.id);
        const tripDays = await storage.getTripDaysByTripId(trip.id);
        const bookings = await storage.getBookingsByTripId(trip.id);
        
        // Combine trip days with their activities for the response
        const daysWithActivities = await Promise.all(
          tripDays.map(async (day) => {
            const activities = await storage.getActivitiesByTripDayId(day.id);
            return { ...day, activities };
          })
        );
        
        // Send the complete trip data
        res.json({
          ...updatedTrip,
          days: daysWithActivities,
          bookings
        });
      } catch (dbError) {
        console.error("Error saving itinerary data:", dbError);
        res.status(500).json({ 
          message: "Error occurred while saving itinerary",
          itinerary: itinerary // Return the generated itinerary even if saving failed
        });
      }
    } catch (error) {
      console.error("Error in itinerary generation:", error);
      res.status(500).json({ message: "Failed to generate itinerary" });
    }
  });

  // Review endpoints
  app.get("/api/reviews/:targetType/:targetId", async (req: Request, res: Response) => {
    try {
      const { targetType, targetId } = req.params;
      
      if (!targetType || !targetId) {
        return res.status(400).json({ message: "Target type and ID are required" });
      }
      
      const reviews = await storage.getReviewsByTargetTypeAndId(targetType, targetId);
      
      // For each review, fetch the author's username
      const reviewsWithAuthor = await Promise.all(
        reviews.map(async (review) => {
          const user = await storage.getUser(review.userId);
          return {
            ...review,
            authorName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'Anonymous',
          };
        })
      );
      
      res.json(reviewsWithAuthor);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });
  
  app.post("/api/reviews", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to post a review" });
      }
      
      const userId = req.user!.id;
      const reviewData = req.body;
      
      const review = await storage.createReview({
        ...reviewData,
        userId,
      });
      
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });
  
  app.put("/api/reviews/:id", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to update a review" });
      }
      
      const reviewId = parseInt(req.params.id);
      const userId = req.user!.id;
      
      // Check if the review exists and belongs to the user
      const existingReview = await storage.getReviewById(reviewId);
      if (!existingReview) {
        return res.status(404).json({ message: "Review not found" });
      }
      
      if (existingReview.userId !== userId) {
        return res.status(403).json({ message: "You can only edit your own reviews" });
      }
      
      const updatedReview = await storage.updateReview(reviewId, req.body);
      res.json(updatedReview);
    } catch (error) {
      console.error("Error updating review:", error);
      res.status(500).json({ message: "Failed to update review" });
    }
  });
  
  app.delete("/api/reviews/:id", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to delete a review" });
      }
      
      const reviewId = parseInt(req.params.id);
      const userId = req.user!.id;
      
      // Check if the review exists and belongs to the user
      const existingReview = await storage.getReviewById(reviewId);
      if (!existingReview) {
        return res.status(404).json({ message: "Review not found" });
      }
      
      if (existingReview.userId !== userId) {
        return res.status(403).json({ message: "You can only delete your own reviews" });
      }
      
      await storage.deleteReview(reviewId);
      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Failed to delete review" });
    }
  });
  
  app.post("/api/reviews/:id/helpful", async (req: Request, res: Response) => {
    try {
      const reviewId = parseInt(req.params.id);
      
      const review = await storage.markReviewHelpful(reviewId);
      res.json(review);
    } catch (error) {
      console.error("Error marking review as helpful:", error);
      res.status(500).json({ message: "Failed to mark review as helpful" });
    }
  });
  
  app.post("/api/reviews/:id/report", async (req: Request, res: Response) => {
    try {
      const reviewId = parseInt(req.params.id);
      
      const review = await storage.reportReview(reviewId);
      res.json(review);
    } catch (error) {
      console.error("Error reporting review:", error);
      res.status(500).json({ message: "Failed to report review" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
