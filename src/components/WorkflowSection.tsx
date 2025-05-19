
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
    <section className="py-20 bg-gradient-to-br from-white to-grey/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-maroon mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our streamlined process makes reuniting with your lost items simple and efficient.
          </p>
        </div>

        <motion.div 
          className="grid md:grid-cols-3 gap-6 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <motion.div 
                variants={itemVariants} 
                className="bg-white rounded-xl p-8 shadow-lg hover-card flex flex-col gap-4"
              >
                <div className={`${step.color} p-4 rounded-full w-16 h-16 flex items-center justify-center mb-2`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-maroon">
                  Step {step.id}: {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>

              {/* Arrows between steps */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-mustard" />
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
