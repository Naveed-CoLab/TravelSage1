
import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { createApi } from "unsplash-js";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, ChevronLeft, Heart } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { BubbleRating } from "@/components/ui/bubble-rating";
import romeImg from "@assets/image_1745004323842.png";

// Import destination images from assets if available
import parisImg from "@assets/paris.jpg";
import lasVegasImg from "@assets/lasvegas.jpg";
import reykjavikImg from "@assets/reykjavik.jpg";

const unsplash = createApi({
  accessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY || 'public-access-key'
});

async function getDestinationImage(destination: string, country: string, type?: string) {
  try {
    let query = `${destination} ${country}`;
    if (type) {
      switch(type.toLowerCase()) {
        case 'hotel':
        case 'accommodation':
          query += ' hotel architecture';
          break;
        case 'restaurant':
        case 'food':
          query += ' restaurant food';
          break;
        case 'attraction':
        case 'landmark':
          query += ' landmark tourist attraction';
          break;
        default:
          query += ' landmark';
      }
    }
    
    const result = await unsplash.search.getPhotos({
      query,
      orientation: 'landscape',
      perPage: 5,
      orderBy: 'relevant'
    });
    
    // Randomly select one of the top 5 images
    const photos = result.response?.results || [];
    if (photos.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(5, photos.length));
      return photos[randomIndex]?.urls?.regular;
    }
    return null;
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
}

export default function PopularDestinations() {
  const [, navigate] = useLocation();
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  
  // Refs for scrollable containers
  const destinationsRef = useRef<HTMLDivElement>(null);
  const hotelsRef = useRef<HTMLDivElement>(null);
  const experiencesRef = useRef<HTMLDivElement>(null);
  
  // Function to toggle wishlist status
  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const newWishlist = { ...prev };
      newWishlist[id] = !prev[id];
      
      if (newWishlist[id]) {
        toast({
          title: "Added to Wishlist",
          description: "The item has been added to your wishlist.",
        });
      } else {
        toast({
          title: "Removed from Wishlist",
          description: "The item has been removed from your wishlist.",
        });
      }
      
      return newWishlist;
    });
  };
  
  // Function to handle scroll with buttons
  const handleScroll = (direction: 'left' | 'right', ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
  // Function to handle item click
  const handleItemClick = (type: string, item: any) => {
    switch (type) {
      case 'destination':
        navigate(`/trips/create?destination=${encodeURIComponent(item.name)}`);
        break;
      case 'hotel':
        toast({
          title: `Selected ${item.name}`,
          description: `Viewing details for ${item.name} in ${item.location}`,
        });
        break;
      case 'experience':
        toast({
          title: `Selected ${item.name}`,
          description: `Booking information for this experience will open shortly.`,
        });
        break;
      default:
        break;
    }
  };

  // Use these predefined destinations to match the design
  const topDestinations = [
    {
      id: "dest-1",
      name: "Rome",
      country: "Italy",
      imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: "dest-2",
      name: "Paris",
      country: "France",
      imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: "dest-3",
      name: "Las Vegas",
      country: "NV",
      imageUrl: "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      id: "dest-4",
      name: "Reykjavik",
      country: "Iceland",
      imageUrl: "https://images.unsplash.com/photo-1504233529578-6d46baba6d34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
  ];

  // Hotel experience cards based on design
  const hotelExperiences = [
    {
      id: "hotel-1",
      name: "Havana Vieja",
      location: "Miami Beach",
      rating: 4.5,
      reviewCount: 1365,
      priceLevel: "$$-$$$",
      categories: "Caribbean, Latin, Bar",
      imageUrl: "https://images.unsplash.com/photo-1590073242678-70ee3fc28f8a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80"
    },
    {
      id: "hotel-2",
      name: "Esquina Cubana",
      location: "Miami Beach",
      rating: 4.5,
      reviewCount: 567,
      priceLevel: "$$-$$$",
      categories: "Bar, Seafood, Contemporary",
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80"
    },
    {
      id: "hotel-3",
      name: "On Ocean 7 Cafe",
      location: "Miami Beach",
      rating: 4.5,
      reviewCount: 2413,
      priceLevel: "$$-$$$",
      categories: "American, Bar, Seafood",
      imageUrl: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80"
    },
    {
      id: "hotel-4",
      name: "Mama's Tacos • Latin Restaurant",
      location: "Miami Beach",
      rating: 4.5,
      reviewCount: 1076,
      priceLevel: "$$-$$$",
      categories: "Latin, Seafood, Vegetarian friendly",
      imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80"
    },
  ];

  // Travel experiences based on design
  const travelExperiences = [
    {
      id: "exp-1",
      name: "The Unvanquished Tour in Porto City Center",
      rating: 5.0,
      reviewCount: 18177,
      price: "from $3 per adult",
      year: "2024",
      imageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80"
    },
    {
      id: "exp-2",
      name: "All-inclusive Ubud Private Tour",
      rating: 5.0,
      reviewCount: 12146,
      price: "from $100 per adult",
      year: "2024",
      imageUrl: "https://images.unsplash.com/photo-1604999333679-b86d54738315?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80"
    },
    {
      id: "exp-3",
      name: "All Inclusive 90 minutes Canal Cruise by Captain Jack!",
      rating: 4.5,
      reviewCount: 12057,
      price: "from $26 per adult",
      year: "2024",
      badge: "BEST SELLER",
      imageUrl: "https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80"
    },
    {
      id: "exp-4",
      name: "Small-Group Explore Angkor Wat Sunrise Tour with Guide from Siem Reap",
      rating: 5.0,
      reviewCount: 9364,
      price: "from $19 per adult",
      year: "2024",
      imageUrl: "https://images.unsplash.com/photo-1564587432145-5d57a8aaef72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80"
    },
  ];

  return (
    <>
      {/* Top destinations section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top destinations for your next vacation</h2>
          
          <div className="relative">
            <div 
              ref={destinationsRef}
              className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 snap-x scrollbar-hide"
            >
              {topDestinations.map((destination) => (
                <div 
                  key={destination.id} 
                  className="relative min-w-[260px] rounded-xl overflow-hidden shadow-sm flex-shrink-0 snap-start group cursor-pointer"
                  onClick={() => handleItemClick('destination', destination)}
                >
                  <img 
                    src={destination.imageUrl}
                    alt={`${destination.name}, ${destination.country}`}
                    className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = `https://source.unsplash.com/featured/?${encodeURIComponent(destination.name + ' ' + destination.country)}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-xl font-bold">{destination.name}, {destination.country}</h3>
                  </div>
                  <button 
                    className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white shadow transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(destination.id);
                    }}
                  >
                    <Heart 
                      className={`h-4 w-4 ${wishlist[destination.id] ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                    />
                  </button>
                </div>
              ))}
            </div>
            
            <button 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10 hidden md:block"
              onClick={() => handleScroll('left', destinationsRef)}
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10 hidden md:block"
              onClick={() => handleScroll('right', destinationsRef)}
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </section>

      {/* Restaurant recommendations section */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">You might like these</h2>
              <p className="text-gray-600 text-sm">More restaurants in Miami Beach</p>
            </div>
          </div>
          
          <div className="relative">
            <div 
              ref={hotelsRef}
              className="flex gap-4 overflow-hidden pb-4 -mx-2 px-2 relative"
            >
              <div className="flex transition-transform duration-300 ease-in-out" style={{ width: `${hotelExperiences.length * 316}px` }}>
                {hotelExperiences.map((hotel) => (
                  <div 
                    key={hotel.id} 
                    className="relative w-[300px] h-[300px] mr-4 rounded-xl overflow-hidden bg-white shadow-sm cursor-pointer transition-transform duration-300 hover:translate-y-[-4px] hover:shadow-md"
                    onClick={() => handleItemClick('hotel', hotel)}
                  >
                    <div className="relative h-44">
                      <img 
                        src={hotel.imageUrl}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://source.unsplash.com/featured/?restaurant,food`;
                        }}
                      />
                      <button 
                        className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-sm transition-colors duration-200 hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(hotel.id);
                        }}
                      >
                        <Heart 
                          className={`h-5 w-5 ${wishlist[hotel.id] ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
                        />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs font-bold rounded px-1.5 py-1">
                        TripSage
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center">
                        <BubbleRating 
                          rating={hotel.rating} 
                          reviewCount={hotel.reviewCount}
                          size="md"
                        />
                      </div>
                      <h3 className="font-bold text-gray-900 mt-1">{hotel.name}</h3>
                      <div className="text-gray-500 text-sm">{hotel.priceLevel} • {hotel.categories}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10"
              onClick={() => handleScroll('left', hotelsRef)}
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10"
              onClick={() => handleScroll('right', hotelsRef)}
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </section>

      {/* Top experiences section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top experiences on TripSage</h2>
          
          <div className="relative">
            <div 
              ref={experiencesRef}
              className="flex gap-4 overflow-hidden pb-4 -mx-2 px-2 relative"
            >
              <div className="flex transition-transform duration-300 ease-in-out" style={{ width: `${travelExperiences.length * 316}px` }}>
                {travelExperiences.map((exp) => (
                  <div 
                    key={exp.id} 
                    className="relative w-[300px] h-[300px] mr-4 rounded-xl overflow-hidden bg-white shadow-sm cursor-pointer transition-transform duration-300 hover:translate-y-[-4px] hover:shadow-md"
                    onClick={() => handleItemClick('experience', exp)}
                  >
                    <div className="relative h-44">
                      <img 
                        src={exp.imageUrl}
                        alt={exp.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://source.unsplash.com/featured/?travel,tour`;
                        }}
                      />
                      <button 
                        className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-sm transition-colors duration-200 hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(exp.id);
                        }}
                      >
                        <Heart 
                          className={`h-5 w-5 ${wishlist[exp.id] ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
                        />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-amber-500 text-black text-xs font-bold rounded-sm px-2 py-1">
                        {exp.year}
                      </div>
                      {exp.badge && (
                        <div className="absolute top-2 left-2 bg-blue-900 text-white text-xs font-bold px-2 py-1 rounded-sm">
                          {exp.badge}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{exp.name}</h3>
                      <div className="flex items-center mb-1">
                        <BubbleRating 
                          rating={exp.rating} 
                          reviewCount={exp.reviewCount}
                          size="md"
                        />
                      </div>
                      <div className="text-gray-700 text-sm">{exp.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10"
              onClick={() => handleScroll('left', experiencesRef)}
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10"
              onClick={() => handleScroll('right', experiencesRef)}
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </section>

      {/* Traveler's Choice Awards Banner */}
      <section className="py-10 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-1/2 lg:w-2/5">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-amber-400 rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="font-bold text-black text-lg">Travelers' Choice</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">Awards Best of the Best</h2>
              <p className="text-gray-700 text-sm mb-4">
                Among our top 1% of places, stays, eats, and experiences—decided by you.
              </p>
              <Button 
                variant="outline" 
                className="rounded-full bg-black text-white border-black hover:bg-gray-800 px-4"
                onClick={() => {
                  toast({
                    title: "Travelers' Choice Awards",
                    description: "Viewing the best destinations and experiences of the year.",
                  });
                }}
              >
                See the winners
              </Button>
            </div>
            <div className="md:w-1/2 lg:w-3/5 relative">
              <div className="aspect-[16/9] rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  alt="Traveler with backpack"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-green-500"></div>
              <div className="absolute -bottom-4 left-10 w-16 h-16 rounded-full bg-amber-400"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
