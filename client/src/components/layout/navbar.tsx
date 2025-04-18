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
import { Menu, X, Globe, Bell, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Globe className="text-primary h-6 w-6 mr-2" />
              <span className="font-bold text-xl text-primary-700">TripSage</span>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className={`${isActive('/') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                Home
              </Link>
              <Link href="/explore" className={`${isActive('/explore') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                Explore
              </Link>
              {user && (
                <Link href="/trips" className={`${isActive('/trips') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  My Trips
                </Link>
              )}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <>
                <Button variant="ghost" size="icon" className="mr-1">
                  <Bell className="h-5 w-5 text-gray-500" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center cursor-pointer ml-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary-100 text-primary-700">
                          {user.firstName ? user.firstName.charAt(0) : user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-4 py-2">
                      <p className="text-sm font-medium">{user.firstName || user.username}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/trips" className="cursor-pointer">My Trips</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => logoutMutation.mutate()}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/auth">
                <Button>Login</Button>
              </Link>
            )}
          </div>
          
          <div className="flex items-center sm:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <Link 
                      href="/" 
                      className="flex items-center" 
                      onClick={() => setIsOpen(false)}
                    >
                      <Globe className="text-primary h-6 w-6 mr-2" />
                      <span className="font-bold text-lg text-primary-700">TripSage</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="space-y-1 py-2">
                    <Link 
                      href="/" 
                      className={`${isActive('/') ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                      onClick={() => setIsOpen(false)}
                    >
                      Home
                    </Link>
                    <Link 
                      href="/explore" 
                      className={`${isActive('/explore') ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                      onClick={() => setIsOpen(false)}
                    >
                      Explore
                    </Link>
                    {user && (
                      <Link 
                        href="/trips" 
                        className={`${isActive('/trips') ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                        onClick={() => setIsOpen(false)}
                      >
                        My Trips
                      </Link>
                    )}
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-gray-200">
                    {user ? (
                      <>
                        <div className="flex items-center px-3 mb-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary-100 text-primary-700">
                              {user.firstName ? user.firstName.charAt(0) : user.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-3">
                            <div className="text-base font-medium text-gray-800">
                              {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.username}
                            </div>
                            <div className="text-sm font-medium text-gray-500">{user.email}</div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Link 
                            href="/profile" 
                            className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                            onClick={() => setIsOpen(false)}
                          >
                            Your Profile
                          </Link>
                          <Link 
                            href="/settings" 
                            className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                            onClick={() => setIsOpen(false)}
                          >
                            Settings
                          </Link>
                          <button 
                            onClick={() => {
                              logoutMutation.mutate();
                              setIsOpen(false);
                            }}
                            className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-50"
                          >
                            Sign out
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="px-3">
                        <Link 
                          href="/auth" 
                          onClick={() => setIsOpen(false)}
                        >
                          <Button className="w-full">Login</Button>
                        </Link>
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
