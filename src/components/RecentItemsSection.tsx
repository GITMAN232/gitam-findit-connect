
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchLostObjects, fetchFoundObjects } from "@/services/supabaseApi";
import { campuses } from "@/types/ListingTypes";
import { Badge } from "@/components/ui/badge";

const RecentItemsSection = () => {
  // Fetch real data from the API
  const { data: lostObjects = [] } = useQuery({
    queryKey: ["lostObjects"],
    queryFn: fetchLostObjects,
  });

  const { data: foundObjects = [] } = useQuery({
    queryKey: ["foundObjects"],
    queryFn: fetchFoundObjects,
  });

  // Group objects by campus and get recent items from each
  const groupByCampus = () => {
    const campusGroups: Record<string, any[]> = {};
    
    // Initialize each campus with empty array
    campuses.forEach(campus => {
      campusGroups[campus] = [];
    });
    
    // Group all objects by campus
    [...lostObjects, ...foundObjects].forEach(item => {
      if (campusGroups[item.campus]) {
        campusGroups[item.campus].push(item);
      }
    });
    
    // Sort each campus group by creation date and take top 2
    Object.keys(campusGroups).forEach(campus => {
      campusGroups[campus] = campusGroups[campus]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 2);
    });
    
    return campusGroups;
  };

  const campusGroups = groupByCampus();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 }
    },
  };

  // Helper function to get time ago
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const itemDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Less than an hour ago";
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-maroon mb-2">Recently Reported Objects</h2>
            <p className="text-lg text-gray-600">
              Latest lost and found objects from all GITAM campuses
            </p>
          </div>
          <Link to="/listings">
            <button className="mt-4 md:mt-0 px-5 py-2 border-2 border-mustard text-mustard rounded-md hover:bg-mustard/10 font-medium transition-colors">
              View All Objects
            </button>
          </Link>
        </div>

        {/* Display items organized by campus */}
        <div className="space-y-12">
          {campuses.map((campus) => {
            const campusItems = campusGroups[campus];
            if (campusItems.length === 0) return null;

            return (
              <motion.div 
                key={campus}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Recently in {campus}
                  </h3>
                  <Badge className="bg-blue-500 hover:bg-blue-600">
                    {campus}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {campusItems.map((item) => (
                    <motion.div key={`${item.type}-${item.id}`} variants={itemVariants}>
                      <Link to="/listings" className="block">
                        <Card className="overflow-hidden hover-card h-full cursor-pointer hover:shadow-lg transition-shadow">
                          <div className="h-48 bg-grey/20 relative">
                            <div className={`absolute top-3 left-3 ${
                              item.type === "lost" 
                                ? "bg-maroon/10 text-maroon" 
                                : "bg-mustard/20 text-mustard"
                            } text-sm font-bold py-1 px-3 rounded-full`}>
                              {item.type === "lost" ? "Lost" : "Found"}
                            </div>
                            <Badge className="absolute top-3 right-3 bg-blue-500 hover:bg-blue-600 text-white text-xs">
                              {item.campus}
                            </Badge>
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.object_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-24 h-24 rounded-full bg-grey/30 flex items-center justify-center">
                                  <span className="text-4xl text-grey">📦</span>
                                </div>
                              </div>
                            )}
                          </div>
                          <CardContent className="p-5">
                            <h3 className="text-lg font-bold text-gray-800 mb-1">{item.object_name}</h3>
                            <div className="flex flex-col gap-2 text-sm text-gray-600">
                              <p className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {item.location}
                              </p>
                              <p className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {getTimeAgo(item.created_at)}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {Object.values(campusGroups).every(items => items.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500">No recent objects to display</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentItemsSection;
