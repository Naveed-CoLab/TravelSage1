import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { User, Pencil, Calendar, DollarSign, Share2, Loader2, PlusCircle, Map } from "lucide-react";

import ItineraryDay from "@/components/trips/itinerary-day";
import BookingCard from "@/components/trips/booking-card";

type TripWithDetails = {
  id: number;
  userId: number;
  title: string;
  destination: string;
  startDate: string | null;
  endDate: string | null;
  budget: string | null;
  preferences: string[] | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  days: {
    id: number;
    tripId: number;
    dayNumber: number;
    date: string | null;
    title: string;
    activities: {
      id: number;
      tripDayId: number;
      title: string;
      description: string | null;
      time: string | null;
      location: string | null;
      type: string | null;
    }[];
  }[];
  bookings: {
    id: number;
    tripId: number;
    type: string;
    title: string;
    provider: string | null;
    price: string | null;
    details: any;
    confirmed: boolean;
  }[];
};

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const tripId = parseInt(id);
  
  const { data: trip, isLoading, error } = useQuery<TripWithDetails>({
    queryKey: [`/api/trips/${tripId}`],
    enabled: !isNaN(tripId),
  });

  const generateItineraryMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/ai/generate-itinerary", { tripId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/trips/${tripId}`] });
      toast({
        title: "Itinerary generated",
        description: "Your AI-powered itinerary has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to generate itinerary: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleGenerateItinerary = () => {
    generateItineraryMutation.mutate();
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-12 w-2/3 mb-4" />
            <Skeleton className="h-6 w-1/3 mb-8" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Skeleton className="h-96" />
              <Skeleton className="h-96" />
              <Skeleton className="h-96" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !trip) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Error Loading Trip</h1>
            <p className="text-red-500 mb-6">{error?.message || "Trip not found"}</p>
            <Button onClick={() => navigate("/trips")}>Back to Trips</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const hasItinerary = trip.days && trip.days.length > 0;
  const hasBookings = trip.bookings && trip.bookings.length > 0;
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">{trip.title}</h1>
              <p className="text-gray-600 flex items-center mt-1">
                <Map className="w-4 h-4 mr-1" /> {trip.destination}
              </p>
            </div>
            
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button variant="outline" size="sm" onClick={() => navigate(`/trips/${trip.id}/edit`)}>
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-8">
            {trip.startDate && trip.endDate && (
              <Badge variant="outline" className="flex items-center gap-1 text-sm py-1.5">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                {format(new Date(trip.startDate), "MMM d, yyyy")} - {format(new Date(trip.endDate), "MMM d, yyyy")}
              </Badge>
            )}
            
            {trip.budget && (
              <Badge variant="outline" className="flex items-center gap-1 text-sm py-1.5">
                <DollarSign className="h-3.5 w-3.5 mr-1" />
                {trip.budget}
              </Badge>
            )}
            
            <Badge variant="secondary" className="text-sm py-1.5">
              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
            </Badge>
          </div>
          
          {trip.preferences && trip.preferences.length > 0 && (
            <div className="mb-8">
              <p className="text-sm text-gray-500 mb-2">Travel Preferences:</p>
              <div className="flex flex-wrap gap-2">
                {trip.preferences.map((preference, index) => (
                  <Badge key={index} variant="secondary">{preference}</Badge>
                ))}
              </div>
            </div>
          )}
          
          <Tabs defaultValue="itinerary">
            <TabsList className="mb-6">
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="itinerary">
              {hasItinerary ? (
                <div className="space-y-8">
                  {trip.days.map((day) => (
                    <ItineraryDay 
                      key={day.id} 
                      day={day} 
                      destination={trip.destination}
                      onAddActivity={(dayId, activity) => {
                        // Would implement activity addition functionality here
                        console.log("Adding activity to day", dayId, activity);
                      }}
                      onDeleteActivity={(activityId) => {
                        // Would implement activity deletion functionality here
                        console.log("Deleting activity", activityId);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 pb-8 text-center">
                    <div className="mb-4">
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-primary-600" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">No Itinerary Yet</h3>
                      <p className="text-gray-500 max-w-md mx-auto mb-6">
                        Let our AI create a personalized day-by-day itinerary for your trip to {trip.destination}.
                      </p>
                    </div>
                    
                    <Button 
                      className="mx-auto" 
                      onClick={handleGenerateItinerary}
                      disabled={generateItineraryMutation.isPending}
                    >
                      {generateItineraryMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating Itinerary...
                        </>
                      ) : (
                        <>
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Generate AI Itinerary
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="bookings">
              {hasBookings ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trip.bookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 pb-8 text-center">
                    <div className="mb-4">
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <DollarSign className="w-8 h-8 text-primary-600" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">No Bookings Yet</h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        When you're ready to book your trip, you'll see your reservations here.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
