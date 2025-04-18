import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import DestinationCard from "@/components/trips/destination-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";

export default function PopularDestinations() {
  const { data: destinations, isLoading, error } = useQuery({
    queryKey: ["/api/destinations"],
  });

  // Fallback destinations if API doesn't return data
  const fallbackDestinations = [
    {
      id: 1,
      name: "Tokyo",
      country: "Japan",
      description: "Experience the perfect blend of tradition and modernity in Japan's vibrant capital.",
      imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=500&q=60",
      rating: "4.8",
      reviewCount: 2450,
      priceEstimate: "From $1,200"
    },
    {
      id: 2,
      name: "Paris",
      country: "France",
      description: "Experience the romance, art, and cuisine of the iconic City of Light.",
      imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=500&q=60",
      rating: "4.9",
      reviewCount: 3210,
      priceEstimate: "From $950"
    },
    {
      id: 3,
      name: "Santorini",
      country: "Greece",
      description: "Discover the breathtaking views and pristine beaches of this Mediterranean paradise.",
      imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=500&q=60",
      rating: "4.7",
      reviewCount: 1890,
      priceEstimate: "From $850"
    }
  ];

  // Display destinations from API or fallback
  const displayDestinations = destinations && destinations.length > 0 
    ? destinations.slice(0, 3) 
    : fallbackDestinations;

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Popular Destinations</h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Discover trending locations loved by travelers worldwide
          </p>
        </div>

        <div className="mt-12 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            // Loading state
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="h-60 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-8 w-20 rounded" />
                  </div>
                </div>
              </div>
            ))
          ) : error ? (
            // Error state
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-500">Error loading destinations. Please try again later.</p>
            </div>
          ) : (
            // Destinations
            displayDestinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))
          )}
        </div>

        <div className="mt-10 text-center">
          <Link href="/explore">
            <Button variant="link" className="text-primary-600 font-medium hover:text-primary-700">
              View all destinations
              <ChevronRight className="ml-1 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
