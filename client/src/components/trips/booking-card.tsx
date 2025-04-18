import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, Hotel, Ticket, DollarSign, Check, ExternalLink, Calendar } from "lucide-react";

type BookingCardProps = {
  booking: {
    id: number;
    tripId: number;
    type: string;
    title: string;
    provider: string | null;
    price: string | null;
    details: any;
    confirmed: boolean;
  };
};

// List of hotel booking providers with their URLs for redirection
const hotelBookingProviders = [
  {
    name: "Booking.com",
    url: "https://www.booking.com/searchresults.html",
    searchParams: (query: string) => `?ss=${encodeURIComponent(query)}`
  },
  {
    name: "Hotels.com",
    url: "https://www.hotels.com/search.do",
    searchParams: (query: string) => `?q-destination=${encodeURIComponent(query)}`
  },
  {
    name: "Expedia",
    url: "https://www.expedia.com/Hotel-Search",
    searchParams: (query: string) => `?destination=${encodeURIComponent(query)}`
  },
  {
    name: "Airbnb",
    url: "https://www.airbnb.com/s",
    searchParams: (query: string) => `/${encodeURIComponent(query)}/homes`
  }
];

export default function BookingCard({ booking }: BookingCardProps) {
  const [bookingUrl, setBookingUrl] = useState<string | null>(null);
  const [showBookingOptions, setShowBookingOptions] = useState(false);
  
  // Function to get icon based on booking type
  const getBookingIcon = () => {
    switch (booking.type.toLowerCase()) {
      case "flight":
        return <Plane className="h-5 w-5 text-blue-500" />;
      case "hotel":
      case "accommodation":
        return <Hotel className="h-5 w-5 text-green-500" />;
      case "activity":
      case "ticket":
      case "tour":
        return <Ticket className="h-5 w-5 text-purple-500" />;
      default:
        return <DollarSign className="h-5 w-5 text-primary-500" />;
    }
  };

  // Function to get background color based on booking type
  const getBookingColor = () => {
    switch (booking.type.toLowerCase()) {
      case "flight":
        return "bg-blue-50 border-blue-200";
      case "hotel":
      case "accommodation":
        return "bg-green-50 border-green-200";
      case "activity":
      case "ticket":
      case "tour":
        return "bg-purple-50 border-purple-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const formatDetails = () => {
    if (!booking.details) return null;
    
    const details = typeof booking.details === 'string' 
      ? JSON.parse(booking.details) 
      : booking.details;
    
    return (
      <div className="mt-3 space-y-1 text-sm">
        {Object.entries(details).map(([key, value]) => {
          // Skip if value is null, undefined, or an empty string
          if (value === null || value === undefined || value === '') return null;
          
          const formattedKey = key
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
            
          return (
            <div key={key} className="flex justify-between">
              <span className="text-gray-500">{formattedKey}:</span>
              <span className="font-medium">{String(value)}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // Handle booking action based on type
  const handleBookingAction = () => {
    const bookingType = booking.type.toLowerCase();
    
    if (bookingType === 'hotel' || bookingType === 'accommodation') {
      setShowBookingOptions(true);
    } else {
      // For other booking types, just show details
      console.log("Viewing details for:", booking.title);
    }
  };

  const redirectToBookingProvider = (provider: typeof hotelBookingProviders[0]) => {
    // Construct search query from booking details
    let searchQuery = booking.title;
    
    // If booking has location details, include those
    if (booking.details && booking.details.location) {
      searchQuery = booking.details.location;
    }
    
    // Create the full URL with search parameters
    const fullUrl = `${provider.url}${provider.searchParams(searchQuery)}`;
    
    // Open in a new tab
    window.open(fullUrl, '_blank');
  };

  return (
    <Card className={`overflow-hidden border ${getBookingColor()} hover:shadow-md transition-all`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="rounded-full p-2 bg-white shadow-sm">
              {getBookingIcon()}
            </div>
            <div>
              <h3 className="font-medium">{booking.title}</h3>
              {booking.provider && (
                <p className="text-sm text-gray-500">{booking.provider}</p>
              )}
            </div>
          </div>
          
          {booking.confirmed ? (
            <Badge className="bg-green-100 text-green-800">
              <Check className="h-3 w-3 mr-1" /> Confirmed
            </Badge>
          ) : (
            <Badge variant="outline">Pending</Badge>
          )}
        </div>
        
        {booking.price && (
          <div className="mt-3 flex items-center text-lg font-semibold">
            <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
            {booking.price}
          </div>
        )}
        
        {formatDetails()}
        
        {/* Booking options for hotels */}
        {showBookingOptions && (booking.type.toLowerCase() === 'hotel' || booking.type.toLowerCase() === 'accommodation') && (
          <div className="mt-4 border-t pt-3">
            <p className="text-sm text-gray-600 mb-2">Book this accommodation with:</p>
            <div className="grid grid-cols-2 gap-2">
              {hotelBookingProviders.map((provider) => (
                <Button 
                  key={provider.name}
                  variant="outline" 
                  size="sm"
                  className="justify-start"
                  onClick={() => redirectToBookingProvider(provider)}
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  {provider.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-white p-3 border-t flex justify-end">
        {!showBookingOptions ? (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleBookingAction}
          >
            {booking.type.toLowerCase() === 'hotel' || booking.type.toLowerCase() === 'accommodation' ? (
              <>
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                Book Now
              </>
            ) : (
              <>
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                View Details
              </>
            )}
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowBookingOptions(false)}
          >
            Hide Options
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
