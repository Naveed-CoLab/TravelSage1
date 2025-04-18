import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin, Star, StarHalf } from "lucide-react";

type DestinationCardProps = {
  destination: {
    id: number;
    name: string;
    country: string;
    description: string;
    imageUrl: string;
    rating: string;
    reviewCount?: number;
    priceEstimate?: string;
  };
};

export default function DestinationCard({ destination }: DestinationCardProps) {
  const [, navigate] = useLocation();

  // Create star rating display
  const renderStars = (rating: string) => {
    const ratingNum = parseFloat(rating);
    const fullStars = Math.floor(ratingNum);
    const hasHalfStar = ratingNum % 1 >= 0.5;
    
    return (
      <div className="flex text-yellow-400">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`star-${i}`} className="h-3.5 w-3.5 fill-current" />
        ))}
        {hasHalfStar && <StarHalf className="h-3.5 w-3.5 fill-current" />}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={`empty-star-${i}`} className="h-3.5 w-3.5 text-yellow-400" />
        ))}
      </div>
    );
  };

  const handleExplore = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/trips/create?destination=${encodeURIComponent(destination.name)}`);
  };

  return (
    <Card className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-60 w-full overflow-hidden">
        <img
          className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          src={destination.imageUrl}
          alt={`${destination.name}, ${destination.country}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black opacity-60"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-bold">{destination.name}, {destination.country}</h3>
          <div className="flex items-center mt-1">
            {renderStars(destination.rating)}
            <span className="ml-1 text-sm">
              {destination.rating} {destination.reviewCount && `(${destination.reviewCount.toLocaleString()} reviews)`}
            </span>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{destination.description}</p>
        <div className="flex items-center justify-between">
          {destination.priceEstimate && (
            <span className="text-primary-600 font-semibold">{destination.priceEstimate}</span>
          )}
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleExplore}
            className="bg-primary-100 text-primary-800 hover:bg-primary-200 transition-colors border-none"
          >
            Explore
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
