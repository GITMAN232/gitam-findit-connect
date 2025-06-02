
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthCard from "@/components/auth/AuthCard";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get redirect path from location state or use home as default
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";
  
  // Store the redirect destination in sessionStorage for OAuth flows
  if (from !== "/") {
    sessionStorage.setItem('authRedirect', from);
  }
  
  const onLoginSubmit = async (values: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      await signIn(values.email, values.password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const onSignupSubmit = async (values: { email: string; password: string; confirmPassword: string }) => {
    try {
      setIsLoading(true);
      await signUp(values.email, values.password);
      // Leave on the same page after signup as they need to verify email
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="pt-28 pb-20 bg-gradient-to-br from-white to-grey/30">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-maroon mb-8 text-center">
              Account Access
            </h1>
            
            <AuthCard 
              onLoginSubmit={onLoginSubmit}
              onSignupSubmit={onSignupSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
