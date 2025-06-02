
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AuthTabs from "./AuthTabs";

interface AuthCardProps {
  onLoginSubmit: (values: { email: string; password: string }) => Promise<void>;
  onSignupSubmit: (values: { email: string; password: string; confirmPassword: string }) => Promise<void>;
  isLoading: boolean;
}

const AuthCard = ({ onLoginSubmit, onSignupSubmit, isLoading }: AuthCardProps) => {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Sign in to your account</CardTitle>
        <CardDescription className="text-center">
          Access your lost and found reports
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AuthTabs 
          onLoginSubmit={onLoginSubmit} 
          onSignupSubmit={onSignupSubmit} 
          isLoading={isLoading} 
        />
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
        <div>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </div>
      </CardFooter>
    </Card>
  );
};

export default AuthCard;
