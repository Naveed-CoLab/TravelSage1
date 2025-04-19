
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { BubbleRating } from "@/components/ui/bubble-rating";

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

  // Convert rating string to number for BubbleRating component
  const getRatingNumber = (rating: string): number => {
    return parseFloat(rating);
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
        <div className="flex items-center mt-1">
          <BubbleRating 
            rating={getRatingNumber(destination.rating)} 
            reviewCount={destination.reviewCount}
            size="sm"
          />
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
