import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Hotel, Utensils, Plane, Car } from "lucide-react";

export default function HeroSection() {
  const [destination, setDestination] = useState("");
  const [, navigate] = useLocation();
  const [searchCategory, setSearchCategory] = useState("all");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim()) {
      navigate(`/trips/create?destination=${encodeURIComponent(destination)}`);
    }
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center px-4 text-slate-800 overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 pt-10 pb-16">
      <div className="max-w-6xl mx-auto w-full z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
            Where to?
          </h1>
        </div>
        
        {/* Search tabs and form */}
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl mx-auto p-5">
          {/* Search categories */}
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            <Button 
              variant={searchCategory === "all" ? "default" : "outline"} 
              className="rounded-full px-4 py-2 flex items-center gap-2 border-gray-200"
              onClick={() => setSearchCategory("all")}
            >
              <Search className="h-4 w-4" />
              <span>Search All</span>
            </Button>
            <Button 
              variant={searchCategory === "hotels" ? "default" : "outline"} 
              className="rounded-full px-4 py-2 flex items-center gap-2 border-gray-200"
              onClick={() => setSearchCategory("hotels")}
            >
              <Hotel className="h-4 w-4" />
              <span>Hotels</span>
            </Button>
            <Button 
              variant={searchCategory === "things" ? "default" : "outline"} 
              className="rounded-full px-4 py-2 flex items-center gap-2 border-gray-200"
              onClick={() => setSearchCategory("things")}
            >
              <MapPin className="h-4 w-4" />
              <span>Things to Do</span>
            </Button>
            <Button 
              variant={searchCategory === "restaurants" ? "default" : "outline"} 
              className="rounded-full px-4 py-2 flex items-center gap-2 border-gray-200"
              onClick={() => setSearchCategory("restaurants")}
            >
              <Utensils className="h-4 w-4" />
              <span>Restaurants</span>
            </Button>
            <Button 
              variant={searchCategory === "flights" ? "default" : "outline"} 
              className="rounded-full px-4 py-2 flex items-center gap-2 border-gray-200"
              onClick={() => setSearchCategory("flights")}
            >
              <Plane className="h-4 w-4" />
              <span>Flights</span>
            </Button>
            <Button 
              variant={searchCategory === "rentals" ? "default" : "outline"} 
              className="rounded-full px-4 py-2 flex items-center gap-2 border-gray-200"
              onClick={() => setSearchCategory("rentals")}
            >
              <Car className="h-4 w-4" />
              <span>Vacation Rentals</span>
            </Button>
          </div>
          
          {/* Search input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="flex-grow relative rounded-full border border-gray-200 bg-gray-50">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Places to go, things to do, hotels..."
                className="pl-12 py-6 pr-4 text-gray-800 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              className="py-6 px-8 rounded-full bg-emerald-500 hover:bg-emerald-600"
              disabled={!destination.trim()}
            >
              Search
            </Button>
          </form>
        </div>
        
        {/* AI trip planner banner */}
        <div className="mt-10 w-full max-w-4xl mx-auto bg-gradient-to-r from-blue-900 to-indigo-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-3/5 text-white">
              <div className="inline-block mb-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                <span className="font-semibold">Powered by AI</span>
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">BETA</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Plan your kind of trip</h2>
              <p className="text-white/80 mb-5">
                Get custom recs for all the things you're into with AI trip builder.
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-full bg-white text-blue-900 hover:bg-gray-100 border-none px-4"
                onClick={() => navigate("/trips/create")}
              >
                <span className="mr-2">Start a trip with AI</span>
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
            <div className="md:w-2/5 h-48 md:h-auto flex items-center justify-center">
              <img 
                src="/src/assets/ai-trip-planner.jpg" 
                alt="AI Trip Planner" 
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1494783367193-149034c05e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
