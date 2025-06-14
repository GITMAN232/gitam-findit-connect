
import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

interface LoadingAnimationProps {
  onComplete: () => void;
}

const LoadingAnimation = ({ onComplete }: LoadingAnimationProps) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showFinalPulse, setShowFinalPulse] = useState(false);

  const phases = [
    "Initializing search protocol...",
    "Scanning campus networks...",
    "Analyzing lost item patterns...",
    "Cross-referencing databases...",
    "Detecting possible matches...",
    "Almost there...",
    "Found something!"
  ];

  useEffect(() => {
    const duration = 4000; // 4 seconds total animation
    const interval = 60; // Update every 60ms for smoother animation
    const steps = duration / interval;
    const progressStep = 100 / steps;

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + progressStep;
        
        // Update phase based on progress
        const phaseIndex = Math.floor((newProgress / 100) * (phases.length - 1));
        setCurrentPhase(Math.min(phaseIndex, phases.length - 1));
        
        if (newProgress >= 100) {
          clearInterval(timer);
          setIsComplete(true);
          setShowFinalPulse(true);
          
          // Final magic fade transition
          setTimeout(() => {
            onComplete();
          }, 1000);
        }
        
        return Math.min(newProgress, 100);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete, phases.length]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-maroon/20 z-50 flex flex-col items-center justify-center transition-all duration-1000 px-4 overflow-hidden">
      
      {/* Animated Background Waves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/3 left-1/4 rounded-full bg-maroon/10 animate-pulse"
          style={{
            width: `${120 + progress * 2}px`,
            height: `${120 + progress * 2}px`,
            animationDuration: '3s'
          }}
        ></div>
        <div 
          className="absolute bottom-1/3 right-1/4 rounded-full bg-mustard/10 animate-pulse"
          style={{
            width: `${80 + progress * 1.5}px`,
            height: `${80 + progress * 1.5}px`,
            animationDuration: '2.5s',
            animationDelay: '0.5s'
          }}
        ></div>
        <div 
          className="absolute top-1/2 right-1/6 rounded-full bg-maroon/5 animate-pulse"
          style={{
            width: `${60 + progress}px`,
            height: `${60 + progress}px`,
            animationDuration: '4s',
            animationDelay: '1s'
          }}
        ></div>
        
        {/* Scanning Lines */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute h-px bg-gradient-to-r from-transparent via-mustard to-transparent animate-pulse"
            style={{
              top: '30%',
              width: '100%',
              animationDuration: '2s'
            }}
          ></div>
          <div 
            className="absolute h-px bg-gradient-to-r from-transparent via-maroon to-transparent animate-pulse"
            style={{
              top: '70%',
              width: '100%',
              animationDuration: '3s',
              animationDelay: '1s'
            }}
          ></div>
        </div>
      </div>

      {/* Animated Logo */}
      <div className="mb-12 md:mb-16 z-10">
        <div className="flex items-center gap-4 mb-3">
          {/* Bouncing G Circle */}
          <div 
            className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-maroon to-maroon/80 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-500"
            style={{
              animation: 'bounce 2s infinite',
              boxShadow: `0 0 ${20 + progress/5}px rgba(122, 18, 28, 0.5)`
            }}
          >
            <span className="text-white font-bold text-2xl md:text-3xl">G</span>
            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
          </div>
          
          {/* Animated Text Logo */}
          <div className="relative">
            <h1 
              className="font-bold text-2xl md:text-3xl lg:text-4xl text-white tracking-wide"
              style={{
                textShadow: '0 0 20px rgba(255,255,255,0.3)',
                animation: 'fadeInScale 1s ease-out 0.5s both'
              }}
            >
              <span className="text-white">G-Lost</span>
              <span className="text-mustard mx-1">&</span>
              <span className="text-white">Found</span>
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-maroon/20 to-mustard/20 rounded blur opacity-30"></div>
          </div>
        </div>
        
        <p 
          className="text-gray-300 text-center text-sm md:text-base tracking-wide"
          style={{
            animation: 'fadeInUp 1s ease-out 1s both'
          }}
        >
          Advanced Item Recovery System
        </p>
      </div>

      {/* Main Animation Container */}
      <div className="relative w-80 md:w-96 mb-8 md:mb-12 z-10">
        {/* Glowing Progress Bar Container */}
        <div className="relative w-full h-3 md:h-4 bg-slate-700/50 rounded-full mb-8 md:mb-12 overflow-hidden backdrop-blur-sm border border-slate-600/30">
          {/* Progress Bar with Glow */}
          <div 
            className="h-full bg-gradient-to-r from-maroon via-mustard to-maroon rounded-full transition-all duration-100 ease-out relative"
            style={{ 
              width: `${progress}%`,
              boxShadow: `0 0 ${10 + progress/10}px rgba(212, 175, 55, 0.6), inset 0 1px 0 rgba(255,255,255,0.2)`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
            <div className="absolute inset-0 bg-white/10 animate-pulse rounded-full"></div>
          </div>
          
          {/* Scanning Light Effect */}
          <div 
            className="absolute top-0 h-full w-8 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full transform -skew-x-12 transition-all duration-100"
            style={{ 
              left: `${Math.max(0, progress - 8)}%`,
              opacity: progress > 5 ? 1 : 0
            }}
          ></div>
        </div>

        {/* Animation Icons Container */}
        <div className="relative w-full h-12 md:h-16 flex items-center">
          {/* Magnifying Glass Animation */}
          <div 
            className="absolute transition-all duration-100 ease-out z-20"
            style={{ 
              left: `${Math.min(progress, 92)}%`, 
              transform: 'translateX(-50%)',
              filter: `drop-shadow(0 0 ${8 + progress/12}px rgba(212, 175, 55, 0.8))`
            }}
          >
            <div 
              className="text-3xl md:text-4xl transform transition-all duration-300 relative"
              style={{ 
                transform: `translateX(-50%) scale(${1 + (progress/200)}) ${progress >= 95 ? 'rotate(360deg)' : ''}`,
                animation: progress >= 95 ? 'spin 0.5s ease-out' : 'none'
              }}
            >
              🔍
              {progress > 50 && (
                <div className="absolute inset-0 animate-ping text-3xl md:text-4xl opacity-30">🔍</div>
              )}
            </div>
          </div>

          {/* Location Pin with Ripple Effect */}
          <div 
            className="absolute right-0 flex items-center justify-center"
            style={{ transform: 'translateX(50%)' }}
          >
            <div className="relative">
              <MapPin 
                className={`w-8 h-8 md:w-10 md:h-10 text-mustard transition-all duration-500 z-10 relative ${
                  showFinalPulse ? 'scale-150 animate-bounce' : 'scale-100'
                }`}
                style={{
                  filter: `drop-shadow(0 0 ${showFinalPulse ? '20' : '8'}px rgba(212, 175, 55, 0.8))`,
                  animation: showFinalPulse ? 'glow 1s ease-in-out infinite alternate' : 'none'
                }}
              />
              
              {/* Ripple Effects */}
              {showFinalPulse && (
                <>
                  <div className="absolute inset-0 w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-mustard/50 animate-ping"></div>
                  <div className="absolute inset-0 w-8 h-8 md:w-10 md:h-10 rounded-full border border-mustard/30 animate-ping animation-delay-300"></div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Status Text */}
      <div className="text-center z-10 min-h-[80px] flex flex-col justify-center">
        <div 
          className="text-lg md:text-xl font-semibold text-white mb-3 transition-all duration-500"
          style={{
            textShadow: '0 0 10px rgba(255,255,255,0.3)',
            animation: 'textGlow 2s ease-in-out infinite alternate'
          }}
        >
          {phases[currentPhase]}
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="text-sm md:text-base text-gray-300 font-mono">
            {Math.round(progress)}% complete
          </div>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 h-1 bg-mustard rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
        
        {isComplete && (
          <div 
            className="text-green-400 font-semibold text-base md:text-lg"
            style={{
              animation: 'fadeInScale 0.5s ease-out',
              textShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
            }}
          >
            ✨ Connection Established ✨
          </div>
        )}
      </div>

      {/* Custom Keyframes via Style Tag */}
      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes textGlow {
          from {
            text-shadow: 0 0 10px rgba(255,255,255,0.3);
          }
          to {
            text-shadow: 0 0 20px rgba(255,255,255,0.6), 0 0 30px rgba(212, 175, 55, 0.3);
          }
        }
        
        @keyframes glow {
          from {
            filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.8));
          }
          to {
            filter: drop-shadow(0 0 25px rgba(212, 175, 55, 1)) drop-shadow(0 0 35px rgba(122, 18, 28, 0.6));
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingAnimation;
