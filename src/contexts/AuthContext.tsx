
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Define types for our auth context
type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props type for the AuthProvider component
type AuthProviderProps = {
  children: ReactNode;
};

// Mock user for development
const mockUser = {
  id: 'mock-user-id',
  email: 'user@example.com',
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(mockUser); // Default to logged in with mock user
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Mock authentication functions
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    setUser(mockUser);
    setIsLoading(false);
  };
  
  const signInWithGoogle = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    setUser(mockUser);
    setIsLoading(false);
  };
  
  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    setUser(mockUser);
    setIsLoading(false);
  };
  
  const signOut = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    setUser(null);
    setIsLoading(false);
  };
  
  // Create context value
  const value = {
    user,
    isLoading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Protected Route component - now allows access even without authentication
export function RequireAuth({ children }: { children: React.ReactNode }) {
  // Always allow access for now, no redirects to login
  return <>{children}</>;
}
