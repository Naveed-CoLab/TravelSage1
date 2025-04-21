import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Search } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { EmptyState } from "@/components/empty-state";

type WishlistItem = {
  id: number;
  userId: number;
  itemType: string;
  itemId: string;
  itemName: string;
  itemImage?: string;
  additionalData?: any;
  createdAt: string;
};

export default function WishlistPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch wishlist items
  const { data: wishlistItems, isLoading } = useQuery({
    queryKey: ["/api/wishlist"],
    enabled: !!user,
  });

  // Delete wishlist item mutation
  const deleteWishlistItem = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/wishlist/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({
        title: "Item removed",
        description: "The item has been removed from your wishlist.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Filter wishlist items based on search query and active tab
  const filteredItems = wishlistItems?.filter((item: WishlistItem) => {
    const matchesSearch = !searchQuery || 
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === "all" || 
      (activeTab === "destinations" && item.itemType === "destination") ||
      (activeTab === "hotels" && item.itemType === "hotel") ||
      (activeTab === "experiences" && item.itemType === "experience") ||
      (activeTab === "trips" && item.itemType === "trip");
    
    return matchesSearch && matchesTab;
  });

  // If user is not authenticated, redirect to login
  if (!isAuthLoading && !user) {
    return <Redirect to="/login" />;
  }

  // Handle removing an item from wishlist
  const handleRemoveItem = (id: number) => {
    deleteWishlistItem.mutate(id);
  };

  return (
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search wishlist..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="mb-8" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full md:w-auto mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="destinations">Destinations</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="experiences">Experiences</TabsTrigger>
          <TabsTrigger value="trips">Trips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          {renderWishlistItems(filteredItems, isLoading, handleRemoveItem)}
        </TabsContent>
        
        <TabsContent value="destinations" className="mt-0">
          {renderWishlistItems(filteredItems, isLoading, handleRemoveItem)}
        </TabsContent>
        
        <TabsContent value="hotels" className="mt-0">
          {renderWishlistItems(filteredItems, isLoading, handleRemoveItem)}
        </TabsContent>
        
        <TabsContent value="experiences" className="mt-0">
          {renderWishlistItems(filteredItems, isLoading, handleRemoveItem)}
        </TabsContent>
        
        <TabsContent value="trips" className="mt-0">
          {renderWishlistItems(filteredItems, isLoading, handleRemoveItem)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function renderWishlistItems(
  items: WishlistItem[] | undefined, 
  isLoading: boolean, 
  onRemove: (id: number) => void
) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        description="You haven't added any items to your wishlist yet. Browse destinations, hotels, and experiences to add them."
        icon="heart"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <div className="relative h-48 bg-gray-100">
            {item.itemImage ? (
              <img
                src={item.itemImage}
                alt={item.itemName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://source.unsplash.com/featured/?${encodeURIComponent(item.itemName)}`;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
            <div className="absolute top-2 right-2">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onRemove(item.id)}
                className="h-8 w-8 rounded-full"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            {item.itemType && (
              <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs py-1 px-2 rounded capitalize">
                {item.itemType}
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg line-clamp-2">{item.itemName}</h3>
            {item.additionalData?.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {item.additionalData.description}
              </p>
            )}
          </CardContent>
          <CardFooter className="px-4 pb-4 pt-0 flex justify-between">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}