import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import TripsPage from "@/pages/trips-page";
import TripCreatePage from "@/pages/trip-create-page";
import TripDetailPage from "@/pages/trip-detail-page";
import DestinationDetailPage from "@/pages/destination-detail-page";
import ExplorePage from "@/pages/explore-page";
import ProfilePage from "@/pages/profile-page";
import FlightsPage from "@/pages/flights-page";
import FlightSearchPage from "@/pages/flight-search-page";
import ProfileFlightsPage from "@/pages/profile-flights-page";
import WishlistPage from "@/pages/wishlist-page";
import AdminLoginPage from "@/pages/admin/login-page";
import DashboardPage from "@/pages/admin/dashboard-page";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { AdminRoute } from "@/lib/admin-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/trips" component={TripsPage} />
      <ProtectedRoute path="/trips/create" component={TripCreatePage} />
      <ProtectedRoute path="/trips/:id" component={TripDetailPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/profile/flights" component={ProfileFlightsPage} />
      <ProtectedRoute path="/wishlist" component={WishlistPage} />
      <Route path="/explore" component={ExplorePage} />
      <Route path="/destinations/:id" component={DestinationDetailPage} />
      <ProtectedRoute path="/flights" component={FlightsPage} />
      <ProtectedRoute path="/flights/search" component={FlightSearchPage} />
      
      {/* Admin routes */}
      <Route path="/admin/login" component={AdminLoginPage} />
      <AdminRoute path="/admin/dashboard" component={DashboardPage} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
