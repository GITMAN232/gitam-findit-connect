
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getUserInitials = () => {
    if (!user || !user.email) return "U";
    const email = user.email;
    return email.charAt(0).toUpperCase();
  };

  const getUserDisplayName = () => {
    if (!user) return "";
    return user.user_metadata?.full_name || user.email || "";
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-maroon rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">G</span>
          </div>
          <span className="font-bold text-xl">
            <span className="text-maroon">G-Lost</span>
            <span className="text-mustard">&</span>
            <span className="text-maroon">Found</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="font-medium hover:text-maroon transition-colors">
            Home
          </Link>
          <Link to="/report-lost" className="font-medium hover:text-maroon transition-colors">
            Report Lost
          </Link>
          <Link to="/report-found" className="font-medium hover:text-maroon transition-colors">
            Report Found
          </Link>
          <Link to="/listings" className="font-medium hover:text-maroon transition-colors">
            View Listings
          </Link>
          {user && (
            <Link to="/my-reportings" className="font-medium hover:text-maroon transition-colors">
              My Reports
            </Link>
          )}
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-maroon text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{getUserDisplayName()}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/my-reportings" className="cursor-pointer">
                    My Reports
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleSignOut}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              className="bg-maroon hover:bg-maroon/90 text-white ml-4"
              onClick={() => navigate('/auth')}
            >
              Login
            </Button>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            className="text-maroon focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md py-4 px-6 flex flex-col gap-4">
          <Link to="/" className="font-medium hover:text-maroon transition-colors" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/report-lost" className="font-medium hover:text-maroon transition-colors" onClick={() => setMobileMenuOpen(false)}>
            Report Lost
          </Link>
          <Link to="/report-found" className="font-medium hover:text-maroon transition-colors" onClick={() => setMobileMenuOpen(false)}>
            Report Found
          </Link>
          <Link to="/listings" className="font-medium hover:text-maroon transition-colors" onClick={() => setMobileMenuOpen(false)}>
            View Listings
          </Link>
          {user && (
            <Link to="/my-reportings" className="font-medium hover:text-maroon transition-colors" onClick={() => setMobileMenuOpen(false)}>
              My Reports
            </Link>
          )}
          
          {user ? (
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-2">{getUserDisplayName()}</p>
              <Button 
                variant="ghost" 
                className="justify-start px-0 font-medium text-destructive" 
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
              >
                Sign out
              </Button>
            </div>
          ) : (
            <Button 
              className="bg-maroon hover:bg-maroon/90 text-white w-full" 
              onClick={() => {
                navigate('/auth');
                setMobileMenuOpen(false);
              }}
            >
              Login
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
