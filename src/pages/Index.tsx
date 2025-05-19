
import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WorkflowSection from "@/components/WorkflowSection";
import RecentItemsSection from "@/components/RecentItemsSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <HeroSection />
      <WorkflowSection />
      <RecentItemsSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
