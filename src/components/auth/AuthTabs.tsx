
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface AuthTabsProps {
  onLoginSubmit: (values: { email: string; password: string }) => Promise<void>;
  onSignupSubmit: (values: { email: string; password: string; confirmPassword: string }) => Promise<void>;
  isLoading: boolean;
}

const AuthTabs = ({ onLoginSubmit, onSignupSubmit, isLoading }: AuthTabsProps) => {
  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      
      <TabsContent value="login">
        <LoginForm onSubmit={onLoginSubmit} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="signup">
        <SignupForm onSubmit={onSignupSubmit} isLoading={isLoading} />
      </TabsContent>
    </Tabs>
  );
};

export default AuthTabs;
