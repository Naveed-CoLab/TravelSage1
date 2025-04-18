import { Link } from "wouter";
import { Button } from "@/components/ui/button";

type CallToActionProps = {
  isLoggedIn: boolean;
};

export default function CallToAction({ isLoggedIn }: CallToActionProps) {
  return (
    <section className="bg-primary-700 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Plan Your Dream Trip?
          </h2>
          <p className="mt-4 text-xl text-primary-100 max-w-2xl mx-auto">
            Join thousands of happy travelers who have discovered their perfect itineraries with TripSage.
          </p>
          <div className="mt-8 flex justify-center flex-wrap gap-3">
            <div className="inline-flex rounded-md shadow">
              <Link href={isLoggedIn ? "/trips/create" : "/auth"}>
                <Button
                  variant="secondary"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50"
                >
                  {isLoggedIn ? "Create New Trip" : "Get Started For Free"}
                </Button>
              </Link>
            </div>
            <div className="inline-flex">
              <Link href="/explore">
                <Button
                  variant="outline"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500 border-white"
                >
                  Explore Destinations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
