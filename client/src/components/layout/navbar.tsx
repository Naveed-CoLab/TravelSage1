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
              <div className="h-10 w-10 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
                </svg>
              </div>
              <span className="font-bold text-xl ml-2 text-gray-900">
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
                        <Link href="/profile" className="cursor-pointer flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
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
