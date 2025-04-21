
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Key, Plane, History, ChevronRight, Save, X, AlertCircle, Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define our profile update schema
const profileUpdateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
});

type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>;

// Define our password update schema
const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordUpdateFormValues = z.infer<typeof passwordUpdateSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  if (!user) return null;
  
  // Initialize our form with the current user data
  const profileForm = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email,
    },
  });
  
  // Initialize password form
  const passwordForm = useForm<PasswordUpdateFormValues>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Define our profile update mutation
  const profileUpdateMutation = useMutation({
    mutationFn: async (data: ProfileUpdateFormValues) => {
      const res = await apiRequest("PUT", "/api/user/profile", data);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/user"], data);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Define our password update mutation
  const passwordUpdateMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const res = await apiRequest("PUT", "/api/user/password", data);
      return await res.json();
    },
    onSuccess: () => {
      setIsChangingPassword(false);
      passwordForm.reset();
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Password update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle profile form submission
  const onProfileSubmit = (values: ProfileUpdateFormValues) => {
    profileUpdateMutation.mutate(values);
  };
  
  // Handle password form submission
  const onPasswordSubmit = (values: PasswordUpdateFormValues) => {
    passwordUpdateMutation.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  };

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">My Profile</h1>
        
        <Tabs defaultValue="profile" className="mt-6">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white">
                      {user.firstName ? user.firstName.charAt(0) : user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{user.firstName || user.username}</CardTitle>
                    <p className="text-gray-500">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Username</p>
                      <p className="font-medium">{user.username}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Password</p>
                      <p className="font-medium">••••••••</p>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity">
            <div className="grid gap-6">
              {/* Flight Search History Card */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Plane className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">Flight Search History</CardTitle>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-600 hover:bg-blue-50"
                      onClick={() => navigate('/profile/flights')}
                    >
                      View All
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>
                    Your recent flight searches and saved travel preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div 
                    className="flex flex-col gap-4 rounded-lg border border-blue-100 bg-blue-50 p-4 cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => navigate('/profile/flights')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-blue-100 p-2.5">
                        <History className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">View Your Flight History</h3>
                        <p className="text-sm text-gray-500">See all your past flight searches in one place</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="mt-2 border-blue-200 text-blue-600 hover:bg-blue-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/profile/flights');
                      }}
                    >
                      View Flight History
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Other activity cards can go here */}
            </div>
          </TabsContent>
          
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Manage your account settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Preference settings will be available soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
