
import { useLocation } from "wouter";
import { Star, StarHalf } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-60">
        <img
          src={destination.imageUrl}
          alt={`${destination.name}, ${destination.country}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {destination.name}, {destination.country}
        </h3>
        <div className="flex items-center mt-1 space-x-1">
          {renderStars(destination.rating)}
          {destination.reviewCount && (
            <span className="text-sm text-gray-500">
              ({destination.reviewCount.toLocaleString()} reviews)
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {destination.description}
        </p>
        {destination.priceEstimate && (
          <p className="mt-2 text-sm font-medium text-gray-900">
            {destination.priceEstimate}
          </p>
        )}
        <Button
          onClick={handleExplore}
          className="mt-4 w-full"
          variant="default"
        >
          Plan Trip
        </Button>
      </div>
    </div>
  );
}
