
import React from "react";
import { motion } from "framer-motion";
import { Upload, SearchCheck, Users, ArrowRight } from "lucide-react";

const WorkflowSection = () => {
  const steps = [
    {
      id: 1,
      title: "Submit a Lost/Found Post",
      description: "Easily report a lost item or something you've found on campus with our simple form.",
      icon: <Upload className="w-8 h-8 text-mustard" />,
      color: "bg-maroon/10",
    },
    {
      id: 2,
      title: "System Matches or Notifies",
      description: "Our smart system will match similar items or notify when someone reports a match to your item.",
      icon: <SearchCheck className="w-8 h-8 text-maroon" />,
      color: "bg-mustard/20",
    },
    {
      id: 3,
      title: "Connect and Reclaim",
      description: "Get in touch with the finder/owner through our secure platform and arrange to reclaim your item.",
      icon: <Users className="w-8 h-8 text-mustard" />,
      color: "bg-maroon/10",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    },
  };

  return (
    <section className="py-16 bg-gradient-to-br from-white to-grey/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-maroon mb-3">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our streamlined process makes reuniting with your lost items simple and efficient.
          </p>
        </div>

        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <motion.div 
                variants={itemVariants} 
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center w-full md:w-[30%] mb-10 md:mb-0"
              >
                <div className={`${step.color} p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-maroon mb-2">
                  Step {step.id}
                </h3>
                <h4 className="text-lg font-medium text-gray-800 mb-3">{step.title}</h4>
                <p className="text-gray-600 text-sm">
                  {step.description}
                </p>
              </motion.div>

              {/* Connection line between steps */}
              {index < steps.length - 1 && (
                <div className="hidden md:block w-[10%] relative">
                  <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-maroon/30 to-mustard/30"></div>
                  <ArrowRight className="w-6 h-6 text-mustard absolute top-1/2 right-0 -translate-y-1/2" />
                </div>
              )}
              
              {/* Mobile arrow indicator */}
              {index < steps.length - 1 && (
                <div className="block md:hidden mb-4">
                  <ArrowRight className="w-6 h-6 text-mustard transform rotate-90" />
                </div>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WorkflowSection;
