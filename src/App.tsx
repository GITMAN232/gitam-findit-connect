
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";

import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ReportLost from "./pages/ReportLost";
import ReportFound from "./pages/ReportFound";
import Listings from "./pages/Listings";
import MyReportings from "./pages/MyReportings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="findit-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Public listings page - no authentication required for browsing */}
            <Route path="/listings" element={<Listings />} />
            
            {/* Protected routes for reporting */}
            <Route path="/report-lost" element={
              <ProtectedRoute>
                <ReportLost />
              </ProtectedRoute>
            } />
            <Route path="/report-found" element={
              <ProtectedRoute>
                <ReportFound />
              </ProtectedRoute>
            } />
            <Route path="/my-reportings" element={
              <ProtectedRoute>
                <MyReportings />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
