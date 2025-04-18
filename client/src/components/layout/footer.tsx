import { Globe, Facebook, Twitter, Instagram, Youtube, MapPin, Mail, Phone, ChevronDown, CreditCard, Lock, Shield } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  
  return (
    <footer className="bg-white text-slate-700 border-t border-gray-200">
      {/* Newsletter section */}
      <div className="bg-emerald-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="max-w-xl">
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Subscribe to our newsletter</h3>
              <p className="text-slate-600 mb-6">
                Get travel inspiration, tips, and exclusive offers sent straight to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
              <Input
                type="email"
                placeholder="Enter your email"
                className="py-6 rounded-full bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button className="rounded-full py-6 px-8 bg-emerald-500 hover:bg-emerald-600">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-gradient-to-r from-primary-600 to-primary-400">
                <Globe className="text-white h-6 w-6" />
              </div>
              <span className="font-bold text-xl ml-2 text-slate-900">TripSage</span>
            </div>
            <p className="text-slate-600 mt-4 text-sm max-w-md">
              Making travel planning smarter, easier, and more personalized with AI technology. Find experiences, get personalized recommendations, and plan your perfect trip.
            </p>
            
            <div className="mt-6 flex items-center gap-4">
              <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors duration-200">
                <Facebook className="h-5 w-5 text-slate-600" />
              </button>
              <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors duration-200">
                <Instagram className="h-5 w-5 text-slate-600" />
              </button>
              <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors duration-200">
                <Twitter className="h-5 w-5 text-slate-600" />
              </button>
              <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors duration-200">
                <Youtube className="h-5 w-5 text-slate-600" />
              </button>
            </div>
            
            <div className="mt-8">
              <div className="flex items-center mb-3 gap-2">
                <div className="p-1 rounded-full bg-slate-100">
                  <MapPin className="h-4 w-4 text-slate-600" />
                </div>
                <span className="text-sm text-slate-600">123 Travel Way, Suite 100, SF, CA 94123</span>
              </div>
              <div className="flex items-center mb-3 gap-2">
                <div className="p-1 rounded-full bg-slate-100">
                  <Mail className="h-4 w-4 text-slate-600" />
                </div>
                <span className="text-sm text-slate-600">support@tripsage.travel</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-full bg-slate-100">
                  <Phone className="h-4 w-4 text-slate-600" />
                </div>
                <span className="text-sm text-slate-600">+1 (800) 123-4567</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-slate-600 hover:text-primary-600 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-slate-600 hover:text-primary-600 transition-colors duration-200">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-slate-600 hover:text-primary-600 transition-colors duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-sm text-slate-600 hover:text-primary-600 transition-colors duration-200">
                  Press
                </Link>
              </li>
              <li>
                <Link href="/gift-cards" className="text-sm text-slate-600 hover:text-primary-600 transition-colors duration-200">
                  Gift Cards
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Discover</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/travel-guides" className="text-sm text-slate-600 hover:text-primary-600 transition-colors duration-200">
                  Travel Guides
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-sm text-slate-600 hover:text-primary-600 transition-colors duration-200">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/trips" className="text-sm text-slate-600 hover:text-primary-600 transition-colors duration-200">
                  Trip Ideas
                </Link>
              </li>
              <li>
                <Link href="/travel-tips" className="text-sm text-slate-600 hover:text-primary-600 transition-colors duration-200">
                  Travel Tips
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-sm text-slate-600 hover:text-primary-600 transition-colors duration-200">
                  Reviews
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-sm text-slate-600 hover:text-primary-600 transition-colors duration-200">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-600 hover:text-primary-600 transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-slate-600 hover:text-primary-600 transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-slate-600 hover:text-primary-600 transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-sm text-slate-600 hover:text-primary-600 transition-colors duration-200">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Payment methods and app section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-6 md:mb-0">
              <h4 className="text-sm font-semibold text-slate-800 mb-3">Secure payments with</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2">
                  <CreditCard className="h-4 w-4 text-slate-600" />
                  <span className="text-xs font-medium text-slate-700">Credit Card</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2">
                  <span className="text-xs font-bold text-blue-600">Pay</span>
                  <span className="text-xs font-medium text-slate-700">Pal</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2">
                  <Shield className="h-4 w-4 text-slate-600" />
                  <span className="text-xs font-medium text-slate-700">Secure Checkout</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-3">Get the app</h4>
              <div className="flex gap-3">
                <button className="bg-black text-white rounded-lg px-3 py-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.6 6.4C16.8 5.5 15.6 5 14.5 5c-1.1 0-2 .2-2.8.8l.3.3 2.5 2.2c.4.4.4 1 0 1.4s-1 .4-1.4 0l-2.5-2.2-.3-.3C9 8 8.5 9 8.5 10.2c0 1.1.5 2.2 1.4 3.1l5.2 5.2c2.1-2 3.4-4.9 3.4-8.1 0-1.5-.3-2.9-.9-4z"></path>
                    <path d="M5.5 5.5C3.7 7.3 2.5 9.9 2.5 12.8c0 2.8 1.1 5.5 3 7.4l5.2-5.2c-.9-.9-1.4-2-1.4-3.1 0-1.2.5-2.2 1.4-3L5.5 5.5z"></path>
                  </svg>
                  <div className="flex flex-col items-start">
                    <span className="text-[8px] leading-tight">GET IT ON</span>
                    <span className="text-xs font-medium">Google Play</span>
                  </div>
                </button>
                <button className="bg-black text-white rounded-lg px-3 py-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.74 15.94h-9.46a.88.88 0 0 1-.88-.88v-5.66c0-.49.4-.88.88-.88h9.46c.49 0 .88.39.88.88v5.66c0 .49-.39.88-.88.88z"></path>
                    <path d="M5.89 7.49C4.32 9.06 2 12.09 2 15.63c0 1.54.4 2.94 1.12 4.07.73 1.15 1.72 1.82 2.83 1.82h12.1c1.11 0 2.11-.67 2.83-1.82.72-1.13 1.12-2.53 1.12-4.07 0-3.54-2.32-6.57-3.89-8.14-1.09-1.1-1.8-1.82-3.23-1.82H9.12c-1.43 0-2.14.72-3.23 1.82zm14.86 3.51c1.51 1.51 3.75 4.42 3.75 7.51 0 1.24-.3 2.33-.82 3.13-.52.81-1.16 1.28-1.82 1.28H6.14c-.67 0-1.3-.47-1.83-1.28-.52-.8-.81-1.89-.81-3.13 0-3.09 2.24-6 3.75-7.51.9-.9 1.23-1.34 1.87-1.34h8.81c.64 0 .97.44 1.87 1.34z"></path>
                  </svg>
                  <div className="flex flex-col items-start">
                    <span className="text-[8px] leading-tight">Download on the</span>
                    <span className="text-xs font-medium">App Store</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} TripSage, Inc. All rights reserved.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
            <button className="flex items-center gap-1 text-xs text-slate-600">
              <span>English (US)</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <button className="flex items-center gap-1 text-xs text-slate-600">
              <span>USD ($)</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
