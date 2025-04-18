import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, X, Bell, ChevronDown, Globe } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="h-10 w-10">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="40" height="40" rx="20" fill="url(#paint0_linear)" />
                  <path d="M20 8C13.373 8 8 13.373 8 20C8 26.627 13.373 32 20 32C26.627 32 32 26.627 32 20C32 13.373 26.627 8 20 8ZM28.291 15H24.96C24.642 13.361 24.139 11.771 23.463 10.291C25.656 11.141 27.441 12.861 28.291 15ZM20 10.036C20.948 11.637 21.678 13.444 22.135 15.355H17.865C18.322 13.444 19.052 11.637 20 10.036ZM10.218 22C10.074 21.35 10 20.681 10 20C10 19.318 10.074 18.65 10.218 18H13.956C13.882 18.665 13.836 19.332 13.836 20C13.836 20.668 13.882 21.335 13.956 22H10.218ZM11.709 25H15.04C15.358 26.638 15.861 28.229 16.537 29.709C14.344 28.859 12.559 27.139 11.709 25ZM15.04 15H11.709C12.559 12.861 14.344 11.141 16.537 10.291C15.861 11.771 15.358 13.361 15.04 15ZM20 29.964C19.052 28.363 18.322 26.556 17.865 24.645H22.135C21.678 26.556 20.948 28.363 20 29.964ZM22.67 22.645H17.33C17.24 22.002 17.181 21.342 17.181 20.677C17.181 20.013 17.24 19.335 17.33 18.677H22.67C22.76 19.335 22.819 20.013 22.819 20.677C22.819 21.342 22.76 22.002 22.67 22.645ZM23.463 29.709C24.139 28.229 24.642 26.638 24.96 25H28.291C27.441 27.139 25.656 28.859 23.463 29.709ZM26.044 22H29.782C29.926 21.35 30 20.681 30 20C30 19.318 29.926 18.65 29.782 18H26.044C26.118 18.665 26.164 19.332 26.164 20C26.164 20.668 26.118 21.335 26.044 22Z" fill="white" />
                  <defs>
                    <linearGradient id="paint0_linear" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#4F46E5" />
                      <stop offset="1" stop-color="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="font-bold text-xl ml-2 bg-gradient-to-r from-primary-600 to-primary-400 text-transparent bg-clip-text">
                TripSage
              </span>
            </Link>
            
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link href="/" className={`${isActive('/') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}>
                Home
              </Link>
              <Link href="/explore" className={`${isActive('/explore') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}>
                Explore
              </Link>
              {user && (
                <Link href="/trips" className={`${isActive('/trips') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}>
                  My Trips
                </Link>
              )}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <>
                <div className="mr-1">
                  <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 hover:bg-gray-100">
                    <Bell className="h-5 w-5 text-gray-500" />
                  </Button>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center cursor-pointer ml-3 rounded-full border border-gray-200 pl-1 pr-2 py-1 hover:bg-gray-50 transition-colors duration-200">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-700 text-white text-sm">
                          {user.firstName ? user.firstName.charAt(0) : user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="ml-2 text-sm font-medium text-gray-700 max-w-[80px] truncate hidden sm:block">
                        {user.firstName || user.username}
                      </span>
                      <ChevronDown className="h-4 w-4 ml-1 text-gray-400" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-1 mt-1 border border-gray-200 shadow-lg rounded-lg">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.firstName || user.username}</p>
                      <p className="text-xs text-gray-500 mt-1 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <DropdownMenuItem asChild>
                        <Link href="/trips" className="cursor-pointer flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          My Trips
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="cursor-pointer flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Settings
                        </Link>
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="py-1">
                      <DropdownMenuItem 
                        onClick={() => logoutMutation.mutate()}
                        className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign out
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth" className="text-gray-600 hover:text-gray-900 font-medium text-sm mr-2">
                  Sign In
                </Link>
                <Link href="/auth">
                  <Button className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center sm:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 hover:bg-gray-100">
                  <Menu className="h-5 w-5 text-gray-700" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="border-l border-gray-200 p-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <Link 
                      href="/" 
                      className="flex items-center" 
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="bg-gradient-to-r from-primary-600 to-primary-400 rounded-full p-1.5 shadow-sm">
                        <Globe className="text-white h-5 w-5" />
                      </div>
                      <span className="font-bold text-lg ml-2 bg-gradient-to-r from-primary-600 to-primary-400 text-transparent bg-clip-text">
                        TripSage
                      </span>
                    </Link>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => setIsOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="px-2 py-3">
                    <p className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Navigation
                    </p>
                    <div className="space-y-1">
                      <Link 
                        href="/" 
                        className={`${isActive('/') ? 'bg-primary-50 text-primary-700 border-primary-500' : 'border-transparent text-gray-700 hover:bg-gray-50'} flex items-center px-3 py-2 text-sm font-medium rounded-md border-l-[3px] transition-colors duration-200`}
                        onClick={() => setIsOpen(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Home
                      </Link>
                      <Link 
                        href="/explore" 
                        className={`${isActive('/explore') ? 'bg-primary-50 text-primary-700 border-primary-500' : 'border-transparent text-gray-700 hover:bg-gray-50'} flex items-center px-3 py-2 text-sm font-medium rounded-md border-l-[3px] transition-colors duration-200`}
                        onClick={() => setIsOpen(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        Explore
                      </Link>
                      {user && (
                        <Link 
                          href="/trips" 
                          className={`${isActive('/trips') ? 'bg-primary-50 text-primary-700 border-primary-500' : 'border-transparent text-gray-700 hover:bg-gray-50'} flex items-center px-3 py-2 text-sm font-medium rounded-md border-l-[3px] transition-colors duration-200`}
                          onClick={() => setIsOpen(false)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          My Trips
                        </Link>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-auto border-t border-gray-200">
                    {user ? (
                      <>
                        <div className="px-2 py-3">
                          <p className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            Account
                          </p>
                          <div className="flex items-center px-3 py-2 rounded-md bg-gray-50 mb-3">
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                              <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
                                {user.firstName ? user.firstName.charAt(0) : user.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.username}
                              </div>
                              <div className="text-xs text-gray-500 truncate max-w-[180px]">{user.email}</div>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <Link 
                              href="/profile" 
                              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                              onClick={() => setIsOpen(false)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Your Profile
                            </Link>
                            <Link 
                              href="/settings" 
                              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                              onClick={() => setIsOpen(false)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Settings
                            </Link>
                            <button 
                              onClick={() => {
                                logoutMutation.mutate();
                                setIsOpen(false);
                              }}
                              className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors duration-200"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              Sign out
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-3">
                          <Link 
                            href="/auth" 
                            onClick={() => setIsOpen(false)}
                          >
                            <Button variant="outline" className="w-full">Sign In</Button>
                          </Link>
                          <Link 
                            href="/auth" 
                            onClick={() => setIsOpen(false)}
                          >
                            <Button className="w-full bg-gradient-to-r from-primary-600 to-primary-500">Sign Up</Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
