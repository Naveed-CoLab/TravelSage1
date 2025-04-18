
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Key } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  if (!user) return null;

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
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
      </div>
    </MainLayout>
  );
}
