import Amadeus from 'amadeus';

// Initialize the Amadeus client
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY || '',
  clientSecret: process.env.AMADEUS_API_SECRET || ''
});

export interface FlightOffer {
  id: string;
  source: string;
  itineraries: {
    segments: {
      departure: {
        iataCode: string;
        terminal?: string;
        at: string; // ISO date string
      };
      arrival: {
        iataCode: string;
        terminal?: string;
        at: string; // ISO date string
      };
      carrierCode: string;
      number: string;
      aircraft: {
        code: string;
      };
      operating?: {
        carrierCode: string;
      };
      duration: string;
      id: string;
    }[];
    duration?: string;
  }[];
  price: {
    currency: string;
    total: string;
    base: string;
    fees: {
      amount: string;
      type: string;
    }[];
    grandTotal: string;
  };
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: {
    travelerId: string;
    fareOption: string;
    travelerType: string;
    price: {
      currency: string;
      total: string;
      base: string;
    };
    fareDetailsBySegment: {
      segmentId: string;
      cabin: string;
      fareBasis: string;
      brandedFare?: string;
      class: string;
      includedCheckedBags: {
        quantity: number;
      };
    }[];
  }[];
  numberOfBookableSeats?: number;
}

export interface LocationSearchResult {
  type: string;
  subType: string;
  name: string;
  iataCode: string;
  address?: {
    cityName: string;
    countryName: string;
  };
}

export async function searchFlights(params: {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD
  adults: number;
  children?: number;
  infants?: number;
  travelClass?: string; // ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
  currencyCode?: string;
  maxPrice?: number;
  max?: number;
}): Promise<FlightOffer[]> {
  try {
    // Prepare parameters for the API call, removing undefined values
    const searchParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined)
    );

    // Make the API call
    const response = await amadeus.shopping.flightOffersSearch.get(searchParams);
    
    // Return the flight offers
    return response.data;
  } catch (error) {
    console.error('Error searching flights with Amadeus API:', error);
    throw error;
  }
}

export async function searchAirports(keyword: string): Promise<LocationSearchResult[]> {
  try {
    const response = await amadeus.referenceData.locations.get({
      keyword,
      subType: Amadeus.location.any,
      page: {
        limit: 10
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error searching airports with Amadeus API:', error);
    throw error;
  }
}

export async function getAirlineInfo(airlineCode: string): Promise<any> {
  try {
    const response = await amadeus.referenceData.airlines.get({
      airlineCodes: airlineCode
    });
    
    return response.data[0];
  } catch (error) {
    console.error('Error getting airline info with Amadeus API:', error);
    throw error;
  }
}

export async function flightOffersToPricing(flightOffers: FlightOffer[]): Promise<any> {
  try {
    const response = await amadeus.shopping.flightOffersSearch.pricing.post(
      JSON.stringify({
        data: {
          type: 'flight-offers-pricing',
          flightOffers: flightOffers
        }
      })
    );
    
    return response.data;
  } catch (error) {
    console.error('Error getting pricing with Amadeus API:', error);
    throw error;
  }
}