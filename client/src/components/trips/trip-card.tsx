import { format, parseISO } from "date-fns";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock, Trash2, MoreVertical } from "lucide-react";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const deleteTripMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/trips/${trip.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trips"] });
      toast({
        title: "Trip deleted",
        description: "Your trip has been successfully deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete trip: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleDeleteTrip = () => {
    deleteTripMutation.mutate();
    setShowDeleteDialog(false);
  };

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

  // Stop event propagation to prevent navigation when clicking on dropdown or its items
  const handleActionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      <Card className="overflow-hidden transition-shadow hover:shadow-lg cursor-pointer h-full flex flex-col group relative">
        <Link href={`/trips/${trip.id}`}>
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
        </Link>
        
        {/* Menu button positioned absolutely in the top-right */}
        <div 
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleActionClick}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white rounded-full">
                <MoreVertical className="h-4 w-4 text-gray-700" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/trips/${trip.id}/edit`)}>
                Edit Trip
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600" 
                onClick={() => setShowDeleteDialog(true)}
              >
                Delete Trip
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this trip?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your "{trip.title}" trip to {trip.destination} and all associated itineraries and bookings. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTrip}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleteTripMutation.isPending ? "Deleting..." : "Delete Trip"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
