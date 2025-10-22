import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingAnimation from "./components/LoadingAnimation";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ReportLost from "./pages/ReportLost";
import ReportFound from "./pages/ReportFound";
import Listings from "./pages/Listings";
import MyReportings from "./pages/MyReportings";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";
import AdminRoute from "./components/admin/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PendingSubmissions from "./pages/admin/PendingSubmissions";
import LiveItems from "./pages/admin/LiveItems";
import ClaimsManagement from "./pages/admin/ClaimsManagement";
import ActivityLogs from "./pages/admin/ActivityLogs";
import UsersManagement from "./pages/admin/UsersManagement";
import AdminSetup from "./pages/AdminSetup";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingAnimation onComplete={handleLoadingComplete} />;
  }

  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
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
              
              {/* Admin routes */}
              <Route path="/admin-setup" element={<AdminSetup />} />
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin/pending" element={
                <AdminRoute>
                  <PendingSubmissions />
                </AdminRoute>
              } />
              <Route path="/admin/live" element={
                <AdminRoute>
                  <LiveItems />
                </AdminRoute>
              } />
              <Route path="/admin/claims" element={
                <AdminRoute>
                  <ClaimsManagement />
                </AdminRoute>
              } />
              <Route path="/admin/activity" element={
                <AdminRoute>
                  <ActivityLogs />
                </AdminRoute>
              } />
              <Route path="/admin/users" element={
                <AdminRoute>
                  <UsersManagement />
                </AdminRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
};

export default App;
