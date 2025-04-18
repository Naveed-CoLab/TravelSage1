import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { Activity, Calendar, Clock, Coffee, MapPin, Plane, Hotel, Utensils, Camera, Landmark } from "lucide-react";

type ItineraryDayProps = {
  day: {
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
  };
};

export default function ItineraryDay({ day }: ItineraryDayProps) {
  // Function to get the appropriate icon based on activity type
  const getActivityIcon = (type: string | null) => {
    switch (type?.toLowerCase()) {
      case "transportation":
      case "flight":
      case "transit":
        return <Plane className="h-4 w-4 text-blue-600" />;
      case "accommodation":
      case "hotel":
      case "lodging":
        return <Hotel className="h-4 w-4 text-green-600" />;
      case "meal":
      case "food":
      case "restaurant":
        return <Utensils className="h-4 w-4 text-yellow-600" />;
      case "sightseeing":
      case "tour":
        return <Camera className="h-4 w-4 text-purple-600" />;
      case "coffee":
      case "breakfast":
        return <Coffee className="h-4 w-4 text-red-600" />;
      case "attraction":
      case "monument":
        return <Landmark className="h-4 w-4 text-purple-600" />;
      default:
        return <Activity className="h-4 w-4 text-primary-600" />;
    }
  };

  // Function to get the background color based on activity type
  const getActivityBgColor = (type: string | null) => {
    switch (type?.toLowerCase()) {
      case "transportation":
      case "flight":
      case "transit":
        return "bg-blue-100";
      case "accommodation":
      case "hotel":
      case "lodging":
        return "bg-green-100";
      case "meal":
      case "food":
      case "restaurant":
        return "bg-yellow-100";
      case "sightseeing":
      case "tour":
        return "bg-purple-100";
      case "coffee":
      case "breakfast":
        return "bg-red-100";
      case "attraction":
      case "monument":
        return "bg-purple-100";
      default:
        return "bg-primary-100";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-800 font-medium">{day.dayNumber}</span>
            </div>
            <CardTitle className="text-lg">{day.title}</CardTitle>
          </div>
          
          {day.date && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {format(parseISO(day.date), "EEE, MMM d, yyyy")}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="ml-11 mt-3 space-y-4">
          {day.activities && day.activities.length > 0 ? (
            day.activities.map((activity) => (
              <div key={activity.id} className={`${getActivityBgColor(activity.type)} p-3 rounded-md`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="ml-3">
                    <h5 className="text-sm font-medium">{activity.title}</h5>
                    {activity.time && (
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.time}
                      </div>
                    )}
                    {activity.location && (
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {activity.location}
                      </div>
                    )}
                    {activity.description && (
                      <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              No activities scheduled for this day yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
