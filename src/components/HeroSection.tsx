import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
const HeroSection = () => {
  return <section className="pt-28 pb-20 bg-gradient-to-br from-white to-grey/30 min-h-[90vh] flex items-center relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-mustard/20 blur-3xl"></div>
      <div className="absolute -left-20 top-40 w-72 h-72 rounded-full bg-maroon/10 blur-3xl"></div>
      <div className="absolute right-40 bottom-20 w-64 h-64 rounded-full bg-grey/40 blur-3xl"></div>
      
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.7
      }} className="flex flex-col gap-6 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-maroon leading-tight">
            Lost Something at GITAM? <br />
            <span className="text-mustard">Let's Help You Find It!</span>
          </h1>
          <p className="text-lg text-gray-700 md:pr-10">
            A smart way to reunite lost items with their owners on campus. Report, match, and reclaim with ease.
          </p>
          <div className="flex flex-wrap gap-4 mt-4 bg-zinc-50">
            <Button className="btn-primary text-lg" asChild>
              <Link to="/report-lost">I Lost Something</Link>
            </Button>
            <Button variant="outline" className="btn-outline text-lg" asChild>
              <Link to="/report-found">I Found Something</Link>
            </Button>
          </div>
        </motion.div>
        
        <motion.div initial={{
        opacity: 0,
        x: 20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        duration: 0.7,
        delay: 0.3
      }} className="relative z-10">
          <div className="bg-white p-6 rounded-2xl shadow-xl rotate-3 animate-float">
            <div className="bg-maroon/5 rounded-xl p-8">
              <div className="w-16 h-16 rounded-full bg-maroon flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <div className="h-2.5 bg-grey/60 rounded-full w-3/4 mb-2.5"></div>
                <div className="h-2.5 bg-grey/40 rounded-full w-1/2"></div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="h-2.5 bg-grey/60 rounded-full w-3/4 mb-2.5"></div>
                <div className="h-2.5 bg-grey/40 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-10 -right-5 bg-white p-4 rounded-2xl shadow-lg -rotate-3 animate-float" style={{
          animationDelay: "0.5s"
        }}>
            <div className="bg-mustard/20 rounded-xl p-4">
              <div className="h-2.5 bg-grey/60 rounded-full w-20 mb-2.5"></div>
              <div className="h-2 bg-grey/40 rounded-full w-12"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>;
};
export default HeroSection;