
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-maroon rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="font-bold text-xl">
            <span className="text-maroon">FindIt</span>
            <span className="text-mustard">@</span>
            <span className="text-maroon">GITAM</span>
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
          <Button className="bg-maroon hover:bg-maroon/90 text-white ml-4">
            Login
          </Button>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden text-maroon focus:outline-none"
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
          <Button className="bg-maroon hover:bg-maroon/90 text-white w-full" onClick={() => setMobileMenuOpen(false)}>
            Login
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
