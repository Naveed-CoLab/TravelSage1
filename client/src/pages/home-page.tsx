import MainLayout from "@/components/layout/main-layout";
import HeroSection from "@/components/home/hero-section";
import FeatureSection from "@/components/home/feature-section";
import PopularDestinations from "@/components/home/popular-destinations";
import AiTripSection from "@/components/home/ai-trip-section";
import Testimonials from "@/components/home/testimonials";
import CallToAction from "@/components/home/call-to-action";
import TripCard from "@/components/trips/trip-card";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const { data: trips } = useQuery({
    queryKey: ["/api/trips"],
  });

  return (
    <MainLayout>
      <HeroSection />
      <FeatureSection />
      <PopularDestinations />
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Recent Trips</h2>
              <p className="mt-2 text-gray-600">Discover travel experiences from our community</p>
            </div>
            <Link href="/trips">
              <Button variant="link" className="text-primary-600 font-medium hover:text-primary-700">
                View all trips
                <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips?.slice(0, 3).map((trip: any) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
            {!trips?.length && (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">No trips found</p>
              </div>
            )}
          </div>
        </div>
      </section>
      <AiTripSection />
      <Testimonials />
      <CallToAction isLoggedIn={!!user} />
    </MainLayout>
  );
}
