import { format, parseISO } from "date-fns";
import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock } from "lucide-react";

type TripCardProps = {
  trip: {
    id: number;
    title: string;
    destination: string;
    startDate: string | null;
    endDate: string | null;
    status: string;
    createdAt: string;
  };
};

export default function TripCard({ trip }: TripCardProps) {
  const getRandomBgImage = () => {
    const images = [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=600&q=80"
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link href={`/trips/${trip.id}`}>
      <Card className="overflow-hidden transition-shadow hover:shadow-lg cursor-pointer h-full flex flex-col">
        <div className="h-48 w-full relative overflow-hidden">
          <img 
            src={getRandomBgImage()} 
            alt={trip.destination} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black opacity-60"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <Badge className={`${getStatusColor(trip.status)}`}>
              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
            </Badge>
            <h3 className="text-xl font-bold mt-2">{trip.title}</h3>
            <div className="flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{trip.destination}</span>
            </div>
          </div>
        </div>
        
        <CardContent className="pt-4 pb-2 flex-grow">
          {trip.startDate && trip.endDate ? (
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                {format(parseISO(trip.startDate), "MMM d, yyyy")} - {format(parseISO(trip.endDate), "MMM d, yyyy")}
              </span>
            </div>
          ) : (
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Dates not set</span>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-0 pb-4">
          <div className="flex items-center text-xs text-gray-400">
            <Clock className="h-3 w-3 mr-1" />
            <span>Created {format(parseISO(trip.createdAt), "MMM d, yyyy")}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
