import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function HeroSection() {
  const [destination, setDestination] = useState("");
  const [, navigate] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim()) {
      navigate(`/trips/create?destination=${encodeURIComponent(destination)}`);
    }
  };

  return (
    <section className="relative h-[650px] flex items-center justify-center px-4 text-white overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-800 to-primary-900 opacity-90 z-0" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1494783367193-149034c05e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center mix-blend-overlay" />
      {/* Animated shapes */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-primary-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto text-center z-10">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Explore the world with AI-powered travel planning
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Create personalized itineraries, discover hidden gems, and book your perfect trip with TripSage.
        </p>
        
        {/* Search form */}
        <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-grow relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Where do you want to go?"
                className="pl-10 py-6 text-gray-800"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              className="py-6 px-6"
              disabled={!destination.trim()}
            >
              Plan My Trip
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
