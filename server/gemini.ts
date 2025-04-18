import { Trip } from "@shared/schema";

// Type for chat messages
type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

// Type for chatbot response
type ChatbotResponse = {
  reply: string;
  suggestions?: string[];
};

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
    
    // Check if API key is missing - if so, immediately return fallback data
    if (!GEMINI_API_KEY) {
      console.warn("No GEMINI_API_KEY provided. Using fallback trip idea data.");
      return generateFallbackTripIdea(destination, preferencesString, durationString);
    }
    
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
      console.error(`Gemini API error: ${response.statusText}`);
      return generateFallbackTripIdea(destination, preferencesString, durationString);
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
      return generateFallbackTripIdea(destination, preferencesString, durationString);
    }
    
    return result;
  } catch (error) {
    console.error("Error generating trip idea:", error);
    return generateFallbackTripIdea(destination, preferences?.join(", ") || "general tourism", duration || "a week");
  }
}

// Helper function to generate fallback trip ideas when the API is unavailable
function generateFallbackTripIdea(destination: string, preferences: string, duration: string): TripIdea {
  // Create destination-specific trip ideas based on common tourist destinations
  let tripIdea: TripIdea;
  
  // Customize trip idea based on destination
  switch(destination.toLowerCase()) {
    case 'tokyo':
    case 'japan':
      tripIdea = {
        summary: "Experience the perfect blend of ancient traditions and futuristic innovation in Japan. From serene temples and gardens to bustling city streets and technological wonders, Japan offers a unique cultural experience that will captivate any traveler.",
        highlights: [
          "Visit the historic Senso-ji Temple in Asakusa",
          "Experience the organized chaos of Shibuya Crossing",
          "Take in breathtaking views of Mt. Fuji",
          "Explore the pop culture district of Akihabara",
          "Enjoy authentic Japanese cuisine from sushi to ramen"
        ],
        bestTimeToVisit: "Late March to May for cherry blossoms, or October to November for autumn foliage",
        estimatedBudget: "$150-300 per day including accommodations, food, and activities",
        recommendedDuration: "10-14 days to explore Tokyo and surrounding areas"
      };
      break;
      
    case 'paris':
    case 'france':
      tripIdea = {
        summary: "Discover the romance and charm of Paris, the City of Light. Known for its iconic landmarks, world-class museums, and exquisite cuisine, Paris offers a perfect blend of history, culture, and beauty that makes it one of the world's most visited destinations.",
        highlights: [
          "Marvel at the iconic Eiffel Tower",
          "Explore the vast art collections at the Louvre Museum",
          "Visit the Gothic masterpiece Notre-Dame Cathedral",
          "Stroll along the elegant Champs-Élysées",
          "Experience Parisian café culture"
        ],
        bestTimeToVisit: "April to June or September to October for mild weather and fewer crowds",
        estimatedBudget: "$150-250 per day including accommodations, food, and activities",
        recommendedDuration: "5-7 days to experience the main attractions of Paris"
      };
      break;
      
    case 'rome':
    case 'italy':
      tripIdea = {
        summary: "Step back in time in Rome, the Eternal City, where ancient history meets modern Italian life. With its incredible archaeological sites, Renaissance masterpieces, and vibrant streets, Rome offers an unforgettable journey through the layers of Western civilization.",
        highlights: [
          "Explore the ancient Colosseum and Roman Forum",
          "Visit Vatican City and St. Peter's Basilica",
          "Toss a coin in the Trevi Fountain",
          "Marvel at the perfect dome of the Pantheon",
          "Indulge in authentic Italian cuisine"
        ],
        bestTimeToVisit: "April to May or September to October for pleasant weather and thinner crowds",
        estimatedBudget: "$120-200 per day including accommodations, food, and activities",
        recommendedDuration: "4-6 days to see Rome's major attractions"
      };
      break;
      
    case 'new york':
    case 'new york city':
    case 'usa':
      tripIdea = {
        summary: "Experience the energy and diversity of New York City, the city that never sleeps. From iconic skyscrapers and world-class museums to diverse neighborhoods and Broadway shows, NYC offers endless possibilities for exploration and entertainment.",
        highlights: [
          "Take in the views from the Empire State Building or One World Observatory",
          "Stroll through the urban oasis of Central Park",
          "Visit the Metropolitan Museum of Art",
          "Experience the bright lights of Times Square",
          "Explore diverse neighborhoods like Greenwich Village and Brooklyn"
        ],
        bestTimeToVisit: "April to June or September to November for mild weather and fewer tourists",
        estimatedBudget: "$200-350 per day including accommodations, food, and activities",
        recommendedDuration: "5-7 days to experience the highlights of NYC"
      };
      break;
      
    // Default fallback for any other destination
    default:
      tripIdea = {
        summary: `A journey to ${destination} focusing on ${preferences}. This trip offers a perfect balance of exploration, relaxation, and cultural immersion.`,
        highlights: [
          "Explore the main attractions and historical sites",
          "Sample local cuisine and culinary specialties",
          "Immerse yourself in the local culture and traditions",
          "Visit museums and cultural institutions",
          "Discover hidden gems off the typical tourist path"
        ],
        bestTimeToVisit: "Spring or fall for the most pleasant weather conditions",
        estimatedBudget: "$100-200 per day depending on accommodation choices and activities",
        recommendedDuration: duration
      };
  }
  
  return tripIdea;
}

export async function generateItinerary(trip: Trip): Promise<GeneratedItinerary> {
  try {
    const startDate = trip.startDate ? new Date(trip.startDate).toISOString().split('T')[0] : "unspecified start date";
    const endDate = trip.endDate ? new Date(trip.endDate).toISOString().split('T')[0] : "unspecified end date";
    const preferencesString = trip.preferences ? trip.preferences.join(", ") : "general tourism";
    
    // Check if API key is missing - if so, immediately return fallback data
    if (!GEMINI_API_KEY) {
      console.warn("No GEMINI_API_KEY provided. Using fallback itinerary data.");
      return generateFallbackItinerary(trip);
    }
    
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
      console.error(`Gemini API error: ${response.statusText}`);
      return generateFallbackItinerary(trip);
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
      return generateFallbackItinerary(trip);
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
    return generateFallbackItinerary(trip);
  }
}

// AI-powered chatbot function
export async function getAIChatResponse(
  userMessage: string,
  chatHistory: ChatMessage[] = [],
  context: {
    destination?: string;
    tripDates?: {start?: string; end?: string};
    preferences?: string[];
  } = {}
): Promise<ChatbotResponse> {
  try {
    // Check if API key is missing - if so, return a simple fallback response
    if (!GEMINI_API_KEY) {
      console.warn("No GEMINI_API_KEY provided. Using fallback chatbot response.");
      return {
        reply: "I'm your travel assistant! I can help you plan your trip, find destinations, and answer travel questions. However, I'm operating in offline mode right now. Please try again later when the service is fully available.",
        suggestions: ["Tell me about popular destinations", "How to plan a budget trip?", "Best time to visit Europe"]
      };
    }
    
    const historyFormatted = chatHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));
    
    // Build context information
    let contextInfo = "";
    if (context.destination) {
      contextInfo += `User is interested in traveling to: ${context.destination}.\n`;
    }
    if (context.tripDates?.start && context.tripDates?.end) {
      contextInfo += `Their travel dates are from ${context.tripDates.start} to ${context.tripDates.end}.\n`;
    }
    if (context.preferences && context.preferences.length > 0) {
      contextInfo += `Their travel preferences include: ${context.preferences.join(", ")}.\n`;
    }
    
    // Create system message
    const systemMessage = {
      role: "system",
      parts: [{ text: `You are an AI-powered travel companion that helps users plan their trips and answers travel-related questions.
      
      ${contextInfo}
      
      Keep your responses travel-focused, friendly, and concise (under 150 words when possible).
      Always provide helpful, accurate travel information.
      If the user asks about something unrelated to travel, politely redirect them to travel topics.
      At the end of your response, suggest 2-3 relevant follow-up questions the user might want to ask.
      
      Format your response as a JSON object with the following structure:
      {
        "reply": "Your helpful response to the user's query",
        "suggestions": ["Suggested follow-up question 1", "Suggested follow-up question 2", "Suggested follow-up question 3"]
      }
      `}]
    };
    
    // Combine everything for the API request
    let allMessages: any[] = [systemMessage];
    
    // Add history if exists
    if (historyFormatted.length > 0) {
      allMessages = [...allMessages, ...historyFormatted];
    }
    
    // Add the current user message
    allMessages.push({
      role: "user",
      parts: [{ text: userMessage }]
    });
    
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: allMessages,
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error(`Gemini API error: ${response.statusText}`);
      return {
        reply: "I'm sorry, I encountered an issue processing your request. Could you please try again?",
        suggestions: ["Tell me about popular destinations", "What should I pack for my trip?", "Best places to visit"]
      };
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    // Extract the JSON from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*?}/);
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;
    
    let result: ChatbotResponse;
    try {
      result = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse Gemini response as JSON:", e);
      // If we couldn't parse as JSON, use the raw text as the reply
      return {
        reply: text,
        suggestions: ["Tell me more about this", "What else should I know?", "Any recommendations?"]
      };
    }
    
    return result;
  } catch (error) {
    console.error("Error getting chatbot response:", error);
    return {
      reply: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
      suggestions: ["Tell me about popular destinations", "How to plan a budget trip?", "Best time to visit Europe"]
    };
  }
}

// Helper function to generate fallback itinerary data when API fails
function generateFallbackItinerary(trip: Trip): GeneratedItinerary {
  // Calculate number of days for the trip
  const numDays = trip.startDate && trip.endDate
    ? Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 3600 * 24))
    : 3;
  
  // Create destination-specific itinerary based on common tourist destinations
  let activities: Array<{title: string, description: string, time: string, type: string, location?: string}[]> = [];
  let bookings: ItineraryBooking[] = [];
  
  // Customize activities based on destination
  switch(trip.destination.toLowerCase()) {
    case 'tokyo':
    case 'japan':
      activities = [
        [
          { title: "Visit Sensō-ji Temple", description: "Explore Tokyo's oldest and most famous Buddhist temple", time: "9:00 AM", type: "sightseeing", location: "Asakusa" },
          { title: "Lunch at local ramen shop", description: "Try authentic Japanese ramen", time: "12:30 PM", type: "meal", location: "Asakusa area" },
          { title: "Explore Akihabara", description: "Visit the electronics and anime district", time: "2:30 PM", type: "shopping", location: "Akihabara" }
        ],
        [
          { title: "Tokyo Skytree", description: "Visit one of the tallest towers in the world", time: "10:00 AM", type: "sightseeing", location: "Sumida" },
          { title: "Sushi lunch", description: "Experience traditional sushi at a local restaurant", time: "1:00 PM", type: "meal", location: "Tsukiji Outer Market" },
          { title: "Meiji Shrine", description: "Visit the famous Shinto shrine", time: "3:30 PM", type: "sightseeing", location: "Shibuya" }
        ],
        [
          { title: "Shibuya Crossing", description: "Experience the famous pedestrian crossing", time: "9:30 AM", type: "sightseeing", location: "Shibuya" },
          { title: "Shopping in Harajuku", description: "Shop in Tokyo's fashion district", time: "11:30 AM", type: "shopping", location: "Harajuku" },
          { title: "Robot Restaurant Show", description: "Experience a unique Japanese entertainment show", time: "7:00 PM", type: "entertainment", location: "Shinjuku" }
        ]
      ];
      bookings = [
        { type: "hotel", title: "Shinjuku Washington Hotel", provider: "Booking.com", price: "$120 per night", details: { location: "Shinjuku, central Tokyo" } },
        { type: "activity", title: "Robot Restaurant Show Tickets", provider: "Viator", price: "$80 per person", details: { duration: "90 minutes" } },
        { type: "transportation", title: "Tokyo Metro 72-Hour Pass", provider: "Tokyo Metro", price: "$20 per person", details: { validity: "72 hours" } }
      ];
      break;
      
    case 'paris':
    case 'france':
      activities = [
        [
          { title: "Eiffel Tower Visit", description: "Visit the iconic landmark of Paris", time: "9:00 AM", type: "sightseeing", location: "Champ de Mars" },
          { title: "Seine River Cruise", description: "Enjoy a relaxing cruise along the Seine", time: "1:00 PM", type: "tour", location: "Seine River" },
          { title: "Dinner at Le Jules Verne", description: "Fine dining with Eiffel Tower views", time: "7:30 PM", type: "meal", location: "Eiffel Tower" }
        ],
        [
          { title: "Louvre Museum", description: "Visit one of the world's largest art museums", time: "9:30 AM", type: "museum", location: "Rue de Rivoli" },
          { title: "Lunch at Café Marly", description: "Dine with a view of the Louvre Pyramid", time: "1:30 PM", type: "meal", location: "Louvre Museum" },
          { title: "Champs-Élysées shopping", description: "Shop along the famous avenue", time: "3:30 PM", type: "shopping", location: "Champs-Élysées" }
        ],
        [
          { title: "Montmartre & Sacré-Cœur", description: "Explore the artistic neighborhood", time: "10:00 AM", type: "sightseeing", location: "Montmartre" },
          { title: "Lunch at La Maison Rose", description: "Dine at the famous pink restaurant", time: "1:00 PM", type: "meal", location: "Montmartre" },
          { title: "Evening at Moulin Rouge", description: "Experience a classic Parisian cabaret", time: "8:00 PM", type: "entertainment", location: "Pigalle" }
        ]
      ];
      bookings = [
        { type: "hotel", title: "Hôtel Plaza Athénée", provider: "Hotels.com", price: "$350 per night", details: { location: "Avenue Montaigne, 8th arr." } },
        { type: "activity", title: "Skip-the-line Eiffel Tower Tickets", provider: "GetYourGuide", price: "$45 per person", details: { access: "Second floor with option to Summit" } },
        { type: "activity", title: "Moulin Rouge Show with Champagne", provider: "Viator", price: "$120 per person", details: { showtime: "9:00 PM" } }
      ];
      break;
      
    case 'rome':
    case 'italy':
      activities = [
        [
          { title: "Colosseum Tour", description: "Explore the ancient Roman amphitheater", time: "9:00 AM", type: "sightseeing", location: "Piazza del Colosseo" },
          { title: "Roman Forum & Palatine Hill", description: "Visit the heart of ancient Rome", time: "1:00 PM", type: "sightseeing", location: "Via della Salara Vecchia" },
          { title: "Dinner in Trastevere", description: "Authentic Italian dinner in a charming district", time: "7:30 PM", type: "meal", location: "Trastevere" }
        ],
        [
          { title: "Vatican Museums & Sistine Chapel", description: "Explore world-class art and Michelangelo's masterpiece", time: "8:30 AM", type: "museum", location: "Vatican City" },
          { title: "St. Peter's Basilica", description: "Visit one of the world's largest churches", time: "1:30 PM", type: "sightseeing", location: "St. Peter's Square" },
          { title: "Trevi Fountain", description: "Visit the famous baroque fountain", time: "5:00 PM", type: "sightseeing", location: "Piazza di Trevi" }
        ],
        [
          { title: "Spanish Steps", description: "Visit the famous stairway", time: "10:00 AM", type: "sightseeing", location: "Piazza di Spagna" },
          { title: "Shopping on Via Condotti", description: "Luxury shopping experience", time: "11:30 AM", type: "shopping", location: "Via Condotti" },
          { title: "Evening food tour", description: "Sample Roman cuisine across multiple stops", time: "6:00 PM", type: "food tour", location: "Campo de' Fiori area" }
        ]
      ];
      bookings = [
        { type: "hotel", title: "Hotel Artemide", provider: "Booking.com", price: "$180 per night", details: { location: "Via Nazionale, near Repubblica Metro" } },
        { type: "activity", title: "Skip-the-line Colosseum & Roman Forum", provider: "GetYourGuide", price: "$55 per person", details: { duration: "3 hours" } },
        { type: "activity", title: "Early Access Vatican Tour", provider: "Viator", price: "$65 per person", details: { startTime: "8:00 AM" } }
      ];
      break;
      
    // Default fallback for any other destination
    default:
      activities = Array(numDays).fill(0).map(() => [
        { title: "Morning exploration", description: `Explore ${trip.destination} attractions`, time: "9:00 AM", type: "sightseeing" },
        { title: "Lunch at local restaurant", description: "Enjoy local cuisine", time: "1:00 PM", type: "meal" },
        { title: "Afternoon activities", description: "Visit cultural sites", time: "3:00 PM", type: "sightseeing" }
      ]);
      bookings = [
        { type: "hotel", title: `Accommodation in ${trip.destination}`, provider: "Local Hotel", price: trip.budget || "$150 per night", details: { location: "City center" } },
        { type: "transportation", title: "Local Transportation Pass", provider: `${trip.destination} Transit`, price: "$25 per person", details: { validity: "3 days" } }
      ];
  }
  
  // Create the fallback itinerary
  const result: GeneratedItinerary = {
    days: activities.slice(0, numDays).map((dayActivities, index) => ({
      dayNumber: index + 1,
      title: `Day ${index + 1}: Exploring ${trip.destination}`,
      activities: dayActivities
    })),
    bookings: bookings
  };
  
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
}
