import React from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-white border-t border-grey/20 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-bold text-xl">
                <span className="text-maroon">G-Lost</span>
                <span className="text-mustard">&</span>
                <span className="text-maroon">Found</span>
              </span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              The official lost and found platform for GITAM University. Helping students
              and staff reconnect with their belongings since 2024.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-maroon hover:text-mustard transition-colors" aria-label="Twitter">
                
              </a>
              <a href="#" className="text-maroon hover:text-mustard transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-maroon hover:text-mustard transition-colors" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg text-maroon mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-maroon transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/report-lost" className="text-gray-600 hover:text-maroon transition-colors">Report Lost</Link>
              </li>
              <li>
                <Link to="/report-found" className="text-gray-600 hover:text-maroon transition-colors">Report Found</Link>
              </li>
              <li>
                <Link to="/listings" className="text-gray-600 hover:text-maroon transition-colors">View Listings</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-maroon transition-colors">FAQ</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg text-maroon mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-maroon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>glostandfound2@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-maroon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91 8555912792</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 text-maroon" />
                <span>Gitam University,Nagendanahalli,
Bengaluru - 562110</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-grey/20 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            &copy; {currentYear} G-Lost&Found. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-gray-600 hover:text-maroon">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-gray-600 hover:text-maroon">
              Terms of Service
            </Link>
          </div>
        </div>
        
        {/* Credit Line */}
        <div className="border-t border-grey/20 mt-4 pt-4 text-center">
          <p className="text-gray-500 text-xs">
            This website is designed and developed by <span className="font-bold">Santhosh</span>
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;