import { Trip } from "@shared/schema";

type TripIdea = {
  summary: string;
  highlights: string[];
  bestTimeToVisit: string;
  estimatedBudget: string;
  recommendedDuration: string;
};

type ItineraryDay = {
  dayNumber: number;
  title: string;
  date?: Date;
  activities: Array<{
    title: string;
    description?: string;
    time?: string;
    location?: string;
    type?: string;
  }>;
};

type ItineraryBooking = {
  type: string;
  title: string;
  provider?: string;
  price?: string;
  details?: any;
};

type GeneratedItinerary = {
  days: ItineraryDay[];
  bookings: ItineraryBooking[];
};

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set! AI features will not work properly.");
}

export async function generateTripIdea(
  destination: string,
  preferences?: string[],
  duration?: string
): Promise<TripIdea> {
  try {
    const preferencesString = preferences ? preferences.join(", ") : "general tourism";
    const durationString = duration || "a week";
    
    const prompt = `
      Create a travel plan idea for a trip to ${destination}.
      The traveler is interested in: ${preferencesString}.
      The trip duration is approximately ${durationString}.
      
      Format your response as a JSON object with the following structure:
      {
        "summary": "Brief overview of the destination and trip",
        "highlights": ["Must-see attraction 1", "Must-see attraction 2", "Must-see attraction 3"],
        "bestTimeToVisit": "Season or months that are ideal",
        "estimatedBudget": "Price range in USD for this trip",
        "recommendedDuration": "Ideal length of stay"
      }
    `;
    
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    // Extract the JSON from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*?}/);
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;
    
    let result: TripIdea;
    try {
      result = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON:", e);
      console.error("Raw response:", text);
      
      // Fallback to a dummy response when parsing fails
      result = {
        summary: `A trip to ${destination} focusing on ${preferencesString}.`,
        highlights: ["Visit local attractions", "Experience local cuisine", "Explore cultural sites"],
        bestTimeToVisit: "Depends on the season",
        estimatedBudget: "$1,000 - $3,000 per person",
        recommendedDuration: durationString,
      };
    }
    
    return result;
  } catch (error) {
    console.error("Error generating trip idea:", error);
    throw new Error("Failed to generate trip idea. Please try again later.");
  }
}

export async function generateItinerary(trip: Trip): Promise<GeneratedItinerary> {
  try {
    const startDate = trip.startDate ? new Date(trip.startDate).toISOString().split('T')[0] : "unspecified start date";
    const endDate = trip.endDate ? new Date(trip.endDate).toISOString().split('T')[0] : "unspecified end date";
    const preferencesString = trip.preferences ? trip.preferences.join(", ") : "general tourism";
    
    const prompt = `
      Create a detailed day-by-day itinerary for a trip to ${trip.destination}.
      The trip is from ${startDate} to ${endDate}.
      The traveler's preferences include: ${preferencesString}.
      The trip title is: ${trip.title}.
      Budget range: ${trip.budget || "moderate"}.
      
      Format your response as a JSON object with the following structure:
      {
        "days": [
          {
            "dayNumber": 1,
            "title": "Day 1: Arrival & Orientation",
            "activities": [
              {
                "title": "Activity name",
                "description": "Brief description",
                "time": "Approximate time (e.g., '9:00 AM')",
                "location": "Location name",
                "type": "Type of activity (e.g., 'sightseeing', 'meal', 'transportation')"
              }
            ]
          }
        ],
        "bookings": [
          {
            "type": "Type of booking (hotel, flight, activity)",
            "title": "Name of the booking",
            "provider": "Service provider name",
            "price": "Estimated price",
            "details": { "Additional details": "as needed" }
          }
        ]
      }
      
      Include approximately 3-4 activities per day.
      For bookings, include at least one accommodation option, transportation options if applicable, and key attractions that require booking.
    `;
    
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    // Extract the JSON from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*?}/);
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;
    
    let result: GeneratedItinerary;
    try {
      result = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON:", e);
      console.error("Raw response:", text);
      
      // Generate a basic fallback itinerary when parsing fails
      const numDays = trip.startDate && trip.endDate
        ? Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 3600 * 24))
        : 3;
      
      result = {
        days: Array.from({ length: numDays }, (_, i) => ({
          dayNumber: i + 1,
          title: `Day ${i + 1}: Exploring ${trip.destination}`,
          activities: [
            {
              title: "Morning exploration",
              description: "Explore local attractions",
              time: "9:00 AM",
              type: "sightseeing"
            },
            {
              title: "Lunch at local restaurant",
              description: "Enjoy local cuisine",
              time: "1:00 PM",
              type: "meal"
            },
            {
              title: "Afternoon activities",
              description: "Visit cultural sites",
              time: "3:00 PM",
              type: "sightseeing"
            }
          ]
        })),
        bookings: [
          {
            type: "hotel",
            title: `Accommodation in ${trip.destination}`,
            provider: "Local Hotel",
            price: trip.budget || "$150 per night",
            details: { location: "City center" }
          }
        ]
      };
    }
    
    // Add dates to the days if trip dates are specified
    if (trip.startDate) {
      const startDateObj = new Date(trip.startDate);
      result.days.forEach((day, index) => {
        const dayDate = new Date(startDateObj);
        dayDate.setDate(startDateObj.getDate() + index);
        day.date = dayDate;
      });
    }
    
    return result;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw new Error("Failed to generate itinerary. Please try again later.");
  }
}
