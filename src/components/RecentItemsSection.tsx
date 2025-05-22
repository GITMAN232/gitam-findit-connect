
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const RecentItemsSection = () => {
  const recentItems = [
    {
      id: 1,
      title: "Blue Backpack",
      type: "Lost",
      location: "Main Library",
      time: "2 hours ago",
      thumbnail: "backpack.jpg",
      color: "bg-maroon/10",
      textColor: "text-maroon",
    },
    {
      id: 2,
      title: "iPhone 14 Pro",
      type: "Found",
      location: "Engineering Block",
      time: "3 hours ago",
      thumbnail: "phone.jpg",
      color: "bg-mustard/20",
      textColor: "text-mustard",
    },
    {
      id: 3,
      title: "Student ID Card",
      type: "Found",
      location: "Cafeteria",
      time: "5 hours ago",
      thumbnail: "id-card.jpg",
      color: "bg-mustard/20",
      textColor: "text-mustard",
    },
    {
      id: 4,
      title: "Water Bottle",
      type: "Lost",
      location: "Sports Complex",
      time: "1 day ago",
      thumbnail: "bottle.jpg",
      color: "bg-maroon/10",
      textColor: "text-maroon",
    },
  ];

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
          {recentItems.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <Card className="overflow-hidden hover-card h-full">
                <div className="h-48 bg-grey/20 relative">
                  <div className={`absolute top-3 left-3 ${item.color} ${item.textColor} text-sm font-bold py-1 px-3 rounded-full`}>
                    {item.type}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-grey/30 flex items-center justify-center">
                      <span className="text-4xl text-grey">📦</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{item.title}</h3>
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
                      {item.time}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default RecentItemsSection;
