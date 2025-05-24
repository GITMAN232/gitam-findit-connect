
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchLostItems, fetchFoundItems } from "@/services/api";
import { format } from "date-fns";

const RecentItemsSection = () => {
  // Fetch real data from the API
  const { data: lostItems = [] } = useQuery({
    queryKey: ["lostItems"],
    queryFn: fetchLostItems,
  });

  const { data: foundItems = [] } = useQuery({
    queryKey: ["foundItems"],
    queryFn: fetchFoundItems,
  });

  // Combine and sort by creation date to get the most recent items
  const allItems = [...lostItems, ...foundItems]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4); // Take only the 4 most recent items

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
            <h2 className="text-3xl md:text-4xl font-bold text-maroon mb-2">Recently Reported Items</h2>
            <p className="text-lg text-gray-600">
              Check out the latest lost and found items on campus
            </p>
          </div>
          <Link to="/listings">
            <button className="mt-4 md:mt-0 px-5 py-2 border-2 border-mustard text-mustard rounded-md hover:bg-mustard/10 font-medium transition-colors">
              View All Items
            </button>
          </Link>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {allItems.map((item) => (
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
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.item_name}
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
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{item.item_name}</h3>
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
        </motion.div>

        {allItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No recent items to display</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentItemsSection;
