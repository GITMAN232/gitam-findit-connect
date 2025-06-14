
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, User, LogOut, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-maroon rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="font-bold text-xl text-maroon">G-Lost&Found</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-maroon transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              to="/report-lost" 
              className="text-gray-700 hover:text-maroon transition-colors font-medium"
            >
              Report Lost
            </Link>
            <Link 
              to="/report-found" 
              className="text-gray-700 hover:text-maroon transition-colors font-medium"
            >
              Report Found
            </Link>
            <Link 
              to="/listings" 
              className="text-gray-700 hover:text-maroon transition-colors font-medium"
            >
              View Listings
            </Link>
            
            {user && (
              <Link 
                to="/my-reportings" 
                className="text-gray-700 hover:text-maroon transition-colors font-medium"
              >
                My Reports
              </Link>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 p-2">
                    <div className="w-8 h-8 bg-maroon rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/my-reportings" className="w-full">
                      <User className="mr-2 h-4 w-4" />
                      My Reports
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="bg-maroon hover:bg-maroon/90">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}

            {/* Mobile menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white">
                  <DropdownMenuItem asChild>
                    <Link to="/" className="w-full">Home</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/report-lost" className="w-full">Report Lost</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/report-found" className="w-full">Report Found</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/listings" className="w-full">View Listings</Link>
                  </DropdownMenuItem>
                  {user && (
                    <DropdownMenuItem asChild>
                      <Link to="/my-reportings" className="w-full">My Reports</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {user ? (
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link to="/auth" className="w-full">Sign In</Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
