import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import MainLayout from "@/components/layout/main-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  CalendarIcon,
  Search,
  Plane,
  Filter,
  ArrowRight,
  Clock,
  XCircle,
  Loader2,
  CreditCard,
  Heart,
  Share2,
  Calendar as CalendarIcon2,
  MapPin,
  User,
  BarChart,
  ChevronsUpDown,
  CheckCircle,
  Info,
  Wallet,
  Sparkles,
  ShieldCheck,
  Clock12,
  ArrowUpRight
} from "lucide-react";

// Flight types
type Airport = {
  code: string;
  name: string;
  city: string;
  country: string;
};

type Airline = {
  code: string;
  name: string;
  logo: string;
};

type Flight = {
  id: string;
  airline: Airline;
  flightNumber: string;
  departureAirport: Airport;
  arrivalAirport: Airport;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  stops: number;
  cabinClass: string;
  seatsAvailable: number;
};

// Mock data
const popularAirports: Airport[] = [
  { code: "JFK", name: "John F. Kennedy International Airport", city: "New York", country: "USA" },
  { code: "LAX", name: "Los Angeles International Airport", city: "Los Angeles", country: "USA" },
  { code: "LHR", name: "Heathrow Airport", city: "London", country: "United Kingdom" },
  { code: "CDG", name: "Charles de Gaulle Airport", city: "Paris", country: "France" },
  { code: "DXB", name: "Dubai International Airport", city: "Dubai", country: "UAE" },
  { code: "HND", name: "Haneda Airport", city: "Tokyo", country: "Japan" },
  { code: "SIN", name: "Changi Airport", city: "Singapore", country: "Singapore" },
  { code: "SYD", name: "Sydney Airport", city: "Sydney", country: "Australia" },
];

const airlines: Airline[] = [
  { code: "DL", name: "Delta Air Lines", logo: "https://logos-world.net/wp-content/uploads/2020/11/Delta-Air-Lines-Logo.png" },
  { code: "AA", name: "American Airlines", logo: "https://logos-world.net/wp-content/uploads/2020/11/American-Airlines-Logo.png" },
  { code: "UA", name: "United Airlines", logo: "https://logos-world.net/wp-content/uploads/2023/01/United-Airlines-Logo-1993.png" },
  { code: "LH", name: "Lufthansa", logo: "https://logos-world.net/wp-content/uploads/2020/11/Lufthansa-Logo.png" },
  { code: "BA", name: "British Airways", logo: "https://logos-world.net/wp-content/uploads/2020/03/British-Airways-Logo.png" },
  { code: "AF", name: "Air France", logo: "https://logos-world.net/wp-content/uploads/2021/08/Air-France-Logo.png" },
  { code: "EK", name: "Emirates", logo: "https://logos-world.net/wp-content/uploads/2020/03/Emirates-Logo-700x394.png" },
  { code: "SQ", name: "Singapore Airlines", logo: "https://logos-world.net/wp-content/uploads/2020/03/Singapore-Airlines-Logo-700x394.png" },
];

// Helper functions
function getRandomAirport(exclude?: string): Airport {
  const filtered = popularAirports.filter(airport => airport.code !== exclude);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function getRandomAirline(): Airline {
  return airlines[Math.floor(Math.random() * airlines.length)];
}

function generateRandomFlightNumber(): string {
  const airline = getRandomAirline();
  const number = Math.floor(Math.random() * 9000) + 1000;
  return `${airline.code}${number}`;
}

function getRandomDuration(): string {
  const hours = Math.floor(Math.random() * 10) + 1;
  const minutes = Math.floor(Math.random() * 60);
  return `${hours}h ${minutes}m`;
}

function getRandomPrice(): number {
  return Math.floor(Math.random() * 800) + 200;
}

function getRandomStops(): number {
  const random = Math.random();
  if (random < 0.5) return 0; // 50% direct flights
  if (random < 0.8) return 1; // 30% one stop
  return 2; // 20% two stops
}

function formatDate(date: Date | null | undefined): string {
  if (!date) return '';
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(timeString: string): string {
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

// Generate mock flights
function generateMockFlights(
  from: string,
  to: string,
  departDate: Date | null,
  returnDate: Date | null,
  passengers: number
): Flight[] {
  if (!departDate) return [];

  const departureAirport = popularAirports.find(a => a.code === from) || 
    popularAirports.find(a => a.city.toLowerCase().includes(from.toLowerCase())) ||
    getRandomAirport();

  const arrivalAirport = popularAirports.find(a => a.code === to) || 
    popularAirports.find(a => a.city.toLowerCase().includes(to.toLowerCase())) ||
    getRandomAirport(departureAirport.code);

  const numFlights = Math.floor(Math.random() * 5) + 5; // 5-10 flights
  const flights: Flight[] = [];

  for (let i = 0; i < numFlights; i++) {
    const airline = getRandomAirline();
    const flightNumber = generateRandomFlightNumber();
    const duration = getRandomDuration();
    const stops = getRandomStops();
    const price = getRandomPrice() * passengers; // Scale price by passengers
    
    // Generate departure time (between 6 AM and 10 PM)
    const departureDate = new Date(departDate);
    departureDate.setHours(Math.floor(Math.random() * 16) + 6);
    departureDate.setMinutes(Math.floor(Math.random() * 60));
    
    // Calculate arrival time based on duration
    const arrivalDate = new Date(departureDate);
    const durationHours = parseInt(duration.split('h')[0]);
    const durationMinutes = parseInt(duration.split('h ')[1].split('m')[0]);
    arrivalDate.setHours(arrivalDate.getHours() + durationHours);
    arrivalDate.setMinutes(arrivalDate.getMinutes() + durationMinutes);
    
    flights.push({
      id: `flight-${i}-${Date.now()}`,
      airline,
      flightNumber,
      departureAirport,
      arrivalAirport,
      departureTime: departureDate.toISOString(),
      arrivalTime: arrivalDate.toISOString(),
      duration,
      price,
      currency: 'USD',
      stops,
      cabinClass: ['Economy', 'Premium Economy', 'Business', 'First'][Math.floor(Math.random() * 4)],
      seatsAvailable: Math.floor(Math.random() * 50) + 1,
    });
  }
  
  // Sort by price
  return flights.sort((a, b) => a.price - b.price);
}

export default function FlightsPage() {
  const [, setLocation] = useLocation();
  const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search));
  
  // Form state
  const [origin, setOrigin] = useState<string>(searchParams.get('from') || searchParams.get('destination') || '');
  const [destination, setDestination] = useState<string>(searchParams.get('to') || searchParams.get('destination') || '');
  const [departDate, setDepartDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [passengers, setPassengers] = useState<string>("1");
  const [cabinClass, setCabinClass] = useState<string>("Economy");
  const [tripType, setTripType] = useState<string>("roundtrip");
  
  // UI state
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [returnFlights, setReturnFlights] = useState<Flight[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [selectedOutbound, setSelectedOutbound] = useState<string | null>(null);
  const [selectedReturn, setSelectedReturn] = useState<string | null>(null);
  
  // Filter state
  const [priceFilter, setPriceFilter] = useState<[number, number]>([0, 2000]);
  const [airlineFilter, setAirlineFilter] = useState<string[]>([]);
  const [stopsFilter, setStopsFilter] = useState<number[]>([]);
  
  // Set initial dates
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    setDepartDate(tomorrow);
    setReturnDate(nextWeek);
  }, []);
  
  // Search function
  const handleSearch = async () => {
    if (!origin || !destination || !departDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate a response with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const outboundFlights = generateMockFlights(
        origin,
        destination,
        departDate,
        null,
        parseInt(passengers)
      );
      
      setFlights(outboundFlights);
      
      if (tripType === "roundtrip" && returnDate) {
        const inboundFlights = generateMockFlights(
          destination,
          origin,
          returnDate,
          null,
          parseInt(passengers)
        );
        setReturnFlights(inboundFlights);
      } else {
        setReturnFlights([]);
      }
      
      setShowResults(true);
      
      // Reset selections
      setSelectedOutbound(null);
      setSelectedReturn(null);
      
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Failed",
        description: "Unable to complete your search. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle flight selection
  const handleFlightSelect = (flightId: string, type: 'outbound' | 'return') => {
    if (type === 'outbound') {
      setSelectedOutbound(flightId);
    } else {
      setSelectedReturn(flightId);
    }
  };
  
  // Handle booking
  const handleBooking = () => {
    if (!selectedOutbound) {
      toast({
        title: "Flight Selection Required",
        description: "Please select an outbound flight",
        variant: "destructive"
      });
      return;
    }
    
    if (tripType === "roundtrip" && !selectedReturn) {
      toast({
        title: "Flight Selection Required",
        description: "Please select a return flight",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Booking initiated",
      description: "Your booking is being processed...",
    });
    
    // In a real app, this would redirect to a booking page
    setTimeout(() => {
      toast({
        title: "Booking Confirmed",
        description: "Your flight has been booked successfully!",
      });
    }, 2000);
  };

  return (
    <MainLayout>
      <div>
        {/* Hero Banner */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 h-80 overflow-hidden">
          <div className="absolute inset-0 bg-blue-800 mix-blend-multiply opacity-30"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1536516677467-a8cf206e1066?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" 
            }}
          ></div>
          
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <h1 className="text-4xl font-bold text-white mb-2">Find Your Next Adventure</h1>
                <p className="text-xl text-white/80 mb-8">Search flights to destinations worldwide with our easy-to-use flight finder</p>
                
                {/* Stats */}
                <div className="flex flex-wrap gap-x-8 gap-y-2 text-white/90 text-sm">
                  <div className="flex items-center">
                    <Plane className="h-4 w-4 mr-2" />
                    <span>100+ Airlines</span>
                  </div>
                  <div className="flex items-center">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    <span>Secure Booking</span>
                  </div>
                  <div className="flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    <span>Best Price Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Search Form Card */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-20 mb-6 relative z-10">
          <Card className="shadow-xl border-0">
            <CardContent className="p-6">
              <Tabs defaultValue={tripType} onValueChange={setTripType} className="w-full">
                <div className="flex justify-between items-center mb-6">
                  <TabsList className="grid grid-cols-3 w-auto">
                    <TabsTrigger value="roundtrip" className="px-6">Round Trip</TabsTrigger>
                    <TabsTrigger value="oneway" className="px-6">One Way</TabsTrigger>
                    <TabsTrigger value="multicity" className="px-6">Multi-City</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Label htmlFor="flexible-dates" className="cursor-pointer">Flexible Dates</Label>
                    <Switch id="flexible-dates" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                  {/* Origin */}
                  <div className="lg:col-span-2 space-y-2">
                    <Label htmlFor="origin" className="text-sm font-medium">From</Label>
                    <div className="relative">
                      <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4 rotate-45" />
                      <Input
                        id="origin"
                        placeholder="City or Airport"
                        className="pl-10 h-12"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        list="origin-options"
                      />
                      <datalist id="origin-options">
                        {popularAirports.map(airport => (
                          <option key={airport.code} value={airport.city}>
                            {airport.code} - {airport.name}
                          </option>
                        ))}
                      </datalist>
                      
                      {origin && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full text-gray-400 hover:text-gray-600"
                          onClick={() => setOrigin('')}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Destination */}
                  <div className="lg:col-span-2 space-y-2">
                    <Label htmlFor="destination" className="text-sm font-medium">To</Label>
                    <div className="relative">
                      <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4 -rotate-45" />
                      <Input
                        id="destination"
                        placeholder="City or Airport"
                        className="pl-10 h-12"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        list="destination-options"
                      />
                      <datalist id="destination-options">
                        {popularAirports.map(airport => (
                          <option key={airport.code} value={airport.city}>
                            {airport.code} - {airport.name}
                          </option>
                        ))}
                      </datalist>
                      
                      {destination && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full text-gray-400 hover:text-gray-600"
                          onClick={() => setDestination('')}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Date Selection */}
                  <div className="lg:col-span-2">
                    <Label className="text-sm font-medium mb-2 block">
                      {tripType === "roundtrip" ? "Departure - Return" : "Departure"}
                    </Label>
                    <div className="flex gap-2">
                      {/* Depart Date */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`justify-start text-left font-normal h-12 flex-1 ${!departDate ? 'text-gray-400' : ''}`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {departDate ? formatDate(departDate) : "Depart"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={departDate || undefined}
                            onSelect={(date: Date | undefined) => setDepartDate(date || null)}
                            initialFocus
                            className="rounded-md border"
                          />
                        </PopoverContent>
                      </Popover>
                      
                      {/* Return Date - Only shown for round trip */}
                      {tripType === "roundtrip" && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={`justify-start text-left font-normal h-12 flex-1 ${!returnDate ? 'text-gray-400' : ''}`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {returnDate ? formatDate(returnDate) : "Return"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={returnDate || undefined}
                              onSelect={(date: Date | undefined) => setReturnDate(date || null)}
                              initialFocus
                              className="rounded-md border"
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
                  {/* Passengers */}
                  <div className="lg:col-span-3 space-y-2">
                    <Label htmlFor="passengers" className="text-sm font-medium">Passengers</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Select value={passengers} onValueChange={setPassengers}>
                        <SelectTrigger className="pl-10 h-12">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Passenger</SelectItem>
                          <SelectItem value="2">2 Passengers</SelectItem>
                          <SelectItem value="3">3 Passengers</SelectItem>
                          <SelectItem value="4">4 Passengers</SelectItem>
                          <SelectItem value="5">5 Passengers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Cabin Class */}
                  <div className="lg:col-span-3 space-y-2">
                    <Label htmlFor="cabin-class" className="text-sm font-medium">Cabin Class</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Select value={cabinClass} onValueChange={setCabinClass}>
                        <SelectTrigger className="pl-10 h-12">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Economy">Economy</SelectItem>
                          <SelectItem value="Premium Economy">Premium Economy</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="First">First Class</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Search Button */}
                  <div className="lg:col-span-6 flex items-end">
                    <Button 
                      onClick={handleSearch} 
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                      disabled={isSearching}
                    >
                      {isSearching ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Searching for the best flights...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-5 w-5" />
                          Search Flights
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Search Results */}
        {showResults && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filters */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-4 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Filter className="h-5 w-5 text-gray-500" />
                </div>
                
                <div className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Price Range</h3>
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>${priceFilter[0]}</span>
                      <span>${priceFilter[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      step="50"
                      value={priceFilter[1]}
                      onChange={(e) => setPriceFilter([priceFilter[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Stops */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Stops</h3>
                    <div className="space-y-2">
                      {[0, 1, 2].map((stop) => (
                        <label key={stop} className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded text-blue-500 mr-2"
                            checked={stopsFilter.includes(stop)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setStopsFilter([...stopsFilter, stop]);
                              } else {
                                setStopsFilter(stopsFilter.filter(s => s !== stop));
                              }
                            }}
                          />
                          {stop === 0 ? "Nonstop" : stop === 1 ? "1 Stop" : "2+ Stops"}
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Airlines */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Airlines</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {airlines.map((airline) => (
                        <label key={airline.code} className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded text-blue-500 mr-2"
                            checked={airlineFilter.includes(airline.code)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAirlineFilter([...airlineFilter, airline.code]);
                              } else {
                                setAirlineFilter(airlineFilter.filter(a => a !== airline.code));
                              }
                            }}
                          />
                          {airline.name}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Flight Results */}
            <div className="md:col-span-3 space-y-6">
              {/* Outbound Flights */}
              <div>
                <h2 className="text-xl font-bold mb-4">
                  {origin} to {destination} ({formatDate(departDate)})
                </h2>
                
                {flights.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <p className="text-gray-500">No flights found. Please try different search criteria.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {flights.map((flight) => (
                      <div 
                        key={flight.id}
                        className={`bg-white rounded-xl shadow-md p-4 transition-all ${
                          selectedOutbound === flight.id
                            ? "ring-2 ring-blue-500"
                            : "hover:shadow-lg"
                        }`}
                      >
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
                          <div className="flex items-center mb-2 md:mb-0">
                            <div className="w-10 h-10 mr-3">
                              <img
                                src={flight.airline.logo}
                                alt={flight.airline.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${flight.airline.name}&background=random`;
                                }}
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium">{flight.airline.name}</div>
                              <div className="text-xs text-gray-500">{flight.flightNumber}</div>
                            </div>
                          </div>
                          
                          <div className="flex-1 mx-4 grid grid-cols-7 gap-2 items-center">
                            <div className="col-span-2">
                              <div className="text-lg font-bold">{formatTime(flight.departureTime)}</div>
                              <div className="text-sm text-gray-500">{flight.departureAirport.code}</div>
                            </div>
                            
                            <div className="col-span-3 flex flex-col items-center">
                              <div className="text-xs text-gray-500">{flight.duration}</div>
                              <div className="w-full flex items-center">
                                <div className="h-0.5 flex-1 bg-gray-300"></div>
                                <Plane className="h-4 w-4 text-gray-400 mx-1" />
                                <div className="h-0.5 flex-1 bg-gray-300"></div>
                              </div>
                              <div className="text-xs text-gray-500">
                                {flight.stops === 0
                                  ? "Nonstop"
                                  : flight.stops === 1
                                  ? "1 Stop"
                                  : `${flight.stops} Stops`}
                              </div>
                            </div>
                            
                            <div className="col-span-2 text-right">
                              <div className="text-lg font-bold">{formatTime(flight.arrivalTime)}</div>
                              <div className="text-sm text-gray-500">{flight.arrivalAirport.code}</div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">${flight.price}</div>
                            <div className="text-xs text-gray-500">{flight.cabinClass}</div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center border-t pt-4">
                          <div className="text-sm text-gray-500">
                            {flight.seatsAvailable} seats left
                          </div>
                          
                          <Button
                            variant={selectedOutbound === flight.id ? "default" : "outline"}
                            onClick={() => handleFlightSelect(flight.id, 'outbound')}
                          >
                            {selectedOutbound === flight.id ? "Selected" : "Select"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Return Flights for Round Trip */}
              {tripType === "roundtrip" && returnFlights.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">
                    {destination} to {origin} ({formatDate(returnDate)})
                  </h2>
                  
                  <div className="space-y-4">
                    {returnFlights.map((flight) => (
                      <div 
                        key={flight.id}
                        className={`bg-white rounded-xl shadow-md p-4 transition-all ${
                          selectedReturn === flight.id
                            ? "ring-2 ring-blue-500"
                            : "hover:shadow-lg"
                        }`}
                      >
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
                          <div className="flex items-center mb-2 md:mb-0">
                            <div className="w-10 h-10 mr-3">
                              <img
                                src={flight.airline.logo}
                                alt={flight.airline.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${flight.airline.name}&background=random`;
                                }}
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium">{flight.airline.name}</div>
                              <div className="text-xs text-gray-500">{flight.flightNumber}</div>
                            </div>
                          </div>
                          
                          <div className="flex-1 mx-4 grid grid-cols-7 gap-2 items-center">
                            <div className="col-span-2">
                              <div className="text-lg font-bold">{formatTime(flight.departureTime)}</div>
                              <div className="text-sm text-gray-500">{flight.departureAirport.code}</div>
                            </div>
                            
                            <div className="col-span-3 flex flex-col items-center">
                              <div className="text-xs text-gray-500">{flight.duration}</div>
                              <div className="w-full flex items-center">
                                <div className="h-0.5 flex-1 bg-gray-300"></div>
                                <Plane className="h-4 w-4 text-gray-400 mx-1" />
                                <div className="h-0.5 flex-1 bg-gray-300"></div>
                              </div>
                              <div className="text-xs text-gray-500">
                                {flight.stops === 0
                                  ? "Nonstop"
                                  : flight.stops === 1
                                  ? "1 Stop"
                                  : `${flight.stops} Stops`}
                              </div>
                            </div>
                            
                            <div className="col-span-2 text-right">
                              <div className="text-lg font-bold">{formatTime(flight.arrivalTime)}</div>
                              <div className="text-sm text-gray-500">{flight.arrivalAirport.code}</div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">${flight.price}</div>
                            <div className="text-xs text-gray-500">{flight.cabinClass}</div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center border-t pt-4">
                          <div className="text-sm text-gray-500">
                            {flight.seatsAvailable} seats left
                          </div>
                          
                          <Button
                            variant={selectedReturn === flight.id ? "default" : "outline"}
                            onClick={() => handleFlightSelect(flight.id, 'return')}
                          >
                            {selectedReturn === flight.id ? "Selected" : "Select"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Booking Section - Only show if flights are selected */}
              {selectedOutbound && (tripType !== "roundtrip" || selectedReturn) && (
                <div className="bg-white rounded-xl shadow-md p-6 mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Your Selection</h2>
                    <div className="text-lg font-bold text-blue-600">
                      Total: $
                      {(flights.find(f => f.id === selectedOutbound)?.price || 0) +
                        (selectedReturn ? (returnFlights.find(f => f.id === selectedReturn)?.price || 0) : 0)}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Outbound Flight</h3>
                      {selectedOutbound && (
                        <div className="flex items-center">
                          <div className="w-8 h-8 mr-3">
                            <img
                              src={flights.find(f => f.id === selectedOutbound)?.airline.logo}
                              alt={flights.find(f => f.id === selectedOutbound)?.airline.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${flights.find(f => f.id === selectedOutbound)?.airline.name}&background=random`;
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              {flights.find(f => f.id === selectedOutbound)?.departureAirport.code} to {flights.find(f => f.id === selectedOutbound)?.arrivalAirport.code}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatTime(flights.find(f => f.id === selectedOutbound)?.departureTime || '')} - 
                              {formatTime(flights.find(f => f.id === selectedOutbound)?.arrivalTime || '')}
                            </div>
                          </div>
                          <div className="text-sm font-bold">
                            ${flights.find(f => f.id === selectedOutbound)?.price}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {tripType === "roundtrip" && selectedReturn && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Return Flight</h3>
                        <div className="flex items-center">
                          <div className="w-8 h-8 mr-3">
                            <img
                              src={returnFlights.find(f => f.id === selectedReturn)?.airline.logo}
                              alt={returnFlights.find(f => f.id === selectedReturn)?.airline.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${returnFlights.find(f => f.id === selectedReturn)?.airline.name}&background=random`;
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              {returnFlights.find(f => f.id === selectedReturn)?.departureAirport.code} to {returnFlights.find(f => f.id === selectedReturn)?.arrivalAirport.code}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatTime(returnFlights.find(f => f.id === selectedReturn)?.departureTime || '')} - 
                              {formatTime(returnFlights.find(f => f.id === selectedReturn)?.arrivalTime || '')}
                            </div>
                          </div>
                          <div className="text-sm font-bold">
                            ${returnFlights.find(f => f.id === selectedReturn)?.price}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t">
                      <Button onClick={handleBooking} className="w-full bg-blue-600 hover:bg-blue-700">
                        Continue to Booking
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Popular Destinations (shown when no results) */}
        {!showResults && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Flight Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[
                { name: "New York", code: "JFK", image: "https://images.unsplash.com/photo-1534430480872-3b397132e8ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", price: 299 },
                { name: "London", code: "LHR", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", price: 499 },
                { name: "Tokyo", code: "HND", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", price: 899 },
                { name: "Paris", code: "CDG", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", price: 449 },
                { name: "Dubai", code: "DXB", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", price: 649 },
                { name: "Sydney", code: "SYD", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", price: 999 },
                { name: "Singapore", code: "SIN", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", price: 749 },
                { name: "Rome", code: "FCO", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", price: 399 },
              ].map((destination) => (
                <div
                  key={destination.code}
                  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => {
                    setDestination(destination.name);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">{destination.name}</h3>
                        <p className="text-gray-500 text-sm">{destination.code}</p>
                      </div>
                      <div className="text-blue-600 font-bold">
                        from ${destination.price}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}