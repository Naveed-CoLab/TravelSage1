import { Globe, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-4 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center">
              <Globe className="text-primary-400 h-6 w-6 mr-2" />
              <span className="font-bold text-xl text-white">TripSage</span>
            </div>
            <p className="text-gray-300 text-base">
              Making travel planning smarter, easier, and more personalized with AI technology.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">YouTube</span>
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-8 xl:mt-0 xl:col-span-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                Company
              </h3>
              <ul role="list" className="mt-4 space-y-4">
                <li>
                  <Link href="/about" className="text-base text-gray-300 hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-base text-gray-300 hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-base text-gray-300 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="text-base text-gray-300 hover:text-white">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                Resources
              </h3>
              <ul role="list" className="mt-4 space-y-4">
                <li>
                  <Link href="/travel-guides" className="text-base text-gray-300 hover:text-white">
                    Travel Guides
                  </Link>
                </li>
                <li>
                  <Link href="/explore" className="text-base text-gray-300 hover:text-white">
                    Destinations
                  </Link>
                </li>
                <li>
                  <Link href="/trip-ideas" className="text-base text-gray-300 hover:text-white">
                    Trip Ideas
                  </Link>
                </li>
                <li>
                  <Link href="/travel-tips" className="text-base text-gray-300 hover:text-white">
                    Travel Tips
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                Support
              </h3>
              <ul role="list" className="mt-4 space-y-4">
                <li>
                  <Link href="/help" className="text-base text-gray-300 hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-base text-gray-300 hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-base text-gray-300 hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-base text-gray-300 hover:text-white">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} TripSage, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
