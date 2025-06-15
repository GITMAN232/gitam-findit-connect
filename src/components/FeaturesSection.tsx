import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Clock, BadgeCheck } from "lucide-react";
const FeaturesSection = () => {
  const features = [{
    id: 1,
    title: "Safe",
    description: "Secure platform with verified university users only",
    icon: <ShieldCheck className="w-10 h-10 text-maroon" />
  }, {
    id: 2,
    title: "Quick",
    description: "Fast matching system to reunite items with owners",
    icon: <Clock className="w-10 h-10 text-maroon" />
  }, {
    id: 3,
    title: "Verified",
    description: "All claims are verified through our secure process",
    icon: <BadgeCheck className="w-10 h-10 text-maroon" />
  }];
  return <section className="py-20 bg-gradient-to-br from-maroon to-maroon/90 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Use G-LOST&amp;FOUND</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Our platform offers the best experience for the GITAM community 
            to handle lost and found items efficiently.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map(feature => <motion.div key={feature.id} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} viewport={{
          once: true
        }} className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/20 transition-colors flex flex-col items-center text-center">
              <div className="bg-white/10 p-4 rounded-full mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/80">{feature.description}</p>
            </motion.div>)}
        </div>
      </div>
    </section>;
};
export default FeaturesSection;