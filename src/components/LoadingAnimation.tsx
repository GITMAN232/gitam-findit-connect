
import React, { useState, useEffect } from "react";
import { MapPin, Compass } from "lucide-react";

interface LoadingAnimationProps {
  onComplete: () => void;
}

const LoadingAnimation = ({ onComplete }: LoadingAnimationProps) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showCompassGlow, setShowCompassGlow] = useState(false);
  const [showPingEffect, setShowPingEffect] = useState(false);
  const [showZoomTransition, setShowZoomTransition] = useState(false);
  const [showMergeAnimation, setShowMergeAnimation] = useState(false);
  const [showBullseyeBurst, setShowBullseyeBurst] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  const phases = [
    "Looking around campus...",
    "Checking student lounges...",
    "Scanning library areas...",
    "Exploring cafeteria zones...",
    "Found a clue!",
    "Connecting the dots...",
    "Redirecting you to the scene..."
  ];

  useEffect(() => {
    const duration = 4500; // 4.5 seconds total animation
    const interval = 50; // Smoother 50ms updates
    const steps = duration / interval;
    const progressStep = 100 / steps;

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + progressStep;
        
        // Update phase based on progress
        const phaseIndex = Math.floor((newProgress / 100) * (phases.length - 1));
        setCurrentPhase(Math.min(phaseIndex, phases.length - 1));
        
        // Trigger compass glow effect at 80%
        if (newProgress >= 80 && !showCompassGlow) {
          setShowCompassGlow(true);
        }
        
        // Trigger merge animation when compass reaches the pin (90%)
        if (newProgress >= 90 && !showMergeAnimation) {
          setShowMergeAnimation(true);
          
          // Sequence the merge effects
          setTimeout(() => {
            setShowBullseyeBurst(true);
            setShowSparkles(true);
          }, 200);
        }
        
        // Trigger ping effect when near completion
        if (newProgress >= 95 && !showPingEffect) {
          setShowPingEffect(true);
        }
        
        if (newProgress >= 100) {
          clearInterval(timer);
          setIsComplete(true);
          
          // Start zoom transition
          setTimeout(() => {
            setShowZoomTransition(true);
          }, 300);
          
          // Complete transition to homepage
          setTimeout(() => {
            onComplete();
          }, 1200);
        }
        
        return Math.min(newProgress, 100);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete, phases.length, showCompassGlow, showPingEffect, showMergeAnimation]);

  return (
    <div 
      className={`fixed inset-0 bg-gradient-to-br from-white via-[#fdfdfd] to-gray-50 z-50 flex flex-col items-center justify-center transition-all duration-1000 px-4 overflow-hidden ${
        showZoomTransition ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
      }`}
    >
      
      {/* Floating Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Maroon gradient blob */}
        <div 
          className="absolute rounded-full opacity-20 animate-pulse"
          style={{
            top: '20%',
            left: '15%',
            width: `${100 + progress * 0.8}px`,
            height: `${100 + progress * 0.8}px`,
            background: 'radial-gradient(circle, #7A121C 0%, transparent 70%)',
            animationDuration: '4s'
          }}
        ></div>
        
        {/* Mustard gradient blob */}
        <div 
          className="absolute rounded-full opacity-15 animate-pulse"
          style={{
            bottom: '25%',
            right: '20%',
            width: `${80 + progress * 0.6}px`,
            height: `${80 + progress * 0.6}px`,
            background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)',
            animationDuration: '3.5s',
            animationDelay: '1s'
          }}
        ></div>
        
        {/* Additional floating gradient */}
        <div 
          className="absolute rounded-full opacity-10 animate-pulse"
          style={{
            top: '60%',
            left: '70%',
            width: `${60 + progress * 0.4}px`,
            height: `${60 + progress * 0.4}px`,
            background: 'radial-gradient(circle, #7A121C 0%, transparent 80%)',
            animationDuration: '5s',
            animationDelay: '0.5s'
          }}
        ></div>
      </div>

      {/* Animated Logo */}
      <div className="mb-16 z-10">
        <div className="flex items-center gap-6 mb-4">
          {/* Bouncy G Circle */}
          <div 
            className="relative w-20 h-20 bg-gradient-to-br from-maroon to-maroon/90 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-500"
            style={{
              animation: 'bounceFloat 3s ease-in-out infinite',
              boxShadow: `0 10px 30px rgba(122, 18, 28, 0.3), 0 0 ${15 + progress/8}px rgba(122, 18, 28, 0.4)`
            }}
          >
            <span className="text-white font-bold text-3xl tracking-tight">G</span>
            <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse"></div>
            
            {/* Orbital ring */}
            <div 
              className="absolute inset-0 rounded-full border-2 border-mustard/30 animate-spin"
              style={{ animationDuration: '8s' }}
            ></div>
          </div>
          
          {/* Futuristic Text Logo */}
          <div className="relative">
            <h1 
              className="font-bold text-4xl lg:text-5xl text-maroon tracking-wide"
              style={{
                fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
                textShadow: '0 0 20px rgba(122, 18, 28, 0.2)',
                animation: 'textSlideIn 1.2s ease-out 0.3s both'
              }}
            >
              <span className="text-maroon">G-Lost</span>
              <span className="text-mustard mx-2">&</span>
              <span className="text-maroon">Found</span>
            </h1>
            
            {/* Underline accent */}
            <div 
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-maroon via-mustard to-maroon rounded-full"
              style={{
                width: `${progress}%`,
                transition: 'width 0.1s ease-out'
              }}
            ></div>
          </div>
        </div>
        
        <p 
          className="text-gray-500 text-center text-lg tracking-wide font-medium"
          style={{
            animation: 'fadeInUp 1s ease-out 0.8s both'
          }}
        >
          Campus Item Recovery System
        </p>
      </div>

      {/* Main Animation Container */}
      <div className="relative w-96 md:w-[450px] mb-12 z-10">
        {/* Modern Progress Bar Container */}
        <div className="relative w-full h-4 bg-gray-100 rounded-full mb-16 overflow-hidden shadow-inner border border-gray-200/50">
          {/* Glowing Progress Bar */}
          <div 
            className="h-full bg-gradient-to-r from-maroon via-mustard to-maroon rounded-full transition-all duration-75 ease-out relative overflow-hidden"
            style={{ 
              width: `${progress}%`,
              boxShadow: `0 0 ${8 + progress/12}px rgba(212, 175, 55, 0.6), inset 0 1px 0 rgba(255,255,255,0.3)`
            }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            
            {/* Flowing light effect */}
            <div 
              className="absolute top-0 h-full w-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 transition-all duration-75"
              style={{ 
                left: `${Math.max(0, progress - 12)}%`,
                opacity: progress > 8 ? 0.8 : 0,
                animation: progress > 50 ? 'flowingLight 2s ease-in-out infinite' : 'none'
              }}
            ></div>
          </div>
        </div>

        {/* Animation Icons Container */}
        <div className="relative w-full h-20 flex items-center">
          {/* Sparkle Effects */}
          {showSparkles && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-mustard rounded-full animate-ping"
                  style={{
                    left: `${45 + Math.sin(i * 45 * Math.PI / 180) * 30}%`,
                    top: `${50 + Math.cos(i * 45 * Math.PI / 180) * 30}%`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '1.5s'
                  }}
                />
              ))}
            </div>
          )}

          {/* Animated Compass */}
          <div 
            className={`absolute transition-all duration-75 ease-out z-20 ${
              showMergeAnimation ? 'animate-bounce' : ''
            }`}
            style={{ 
              left: `${Math.min(progress, 90)}%`, 
              transform: `translateX(-50%) ${showMergeAnimation ? 'scale(1.2)' : 'scale(1)'}`,
              transition: showMergeAnimation ? 'all 0.3s ease-out' : 'all 75ms ease-out'
            }}
          >
            <div className="relative">
              <Compass 
                className={`w-12 h-12 text-maroon transition-all duration-300 ${
                  showCompassGlow ? 'scale-125 animate-pulse' : 'scale-100'
                }`}
                style={{
                  filter: showCompassGlow 
                    ? 'drop-shadow(0 0 15px rgba(122, 18, 28, 0.8)) drop-shadow(0 0 25px rgba(212, 175, 55, 0.6))'
                    : 'drop-shadow(0 0 8px rgba(122, 18, 28, 0.4))',
                  transform: `translateX(-50%) rotate(${progress * 3.6}deg) ${showCompassGlow ? 'scale(1.25)' : 'scale(1)'}`
                }}
              />
              
              {/* Compass glow rings */}
              {showCompassGlow && (
                <>
                  <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-maroon/30 animate-ping"></div>
                  <div className="absolute inset-0 w-12 h-12 rounded-full border border-mustard/40 animate-ping" style={{ animationDelay: '0.2s' }}></div>
                </>
              )}
            </div>
          </div>

          {/* Bullseye Burst Animation */}
          {showBullseyeBurst && (
            <div 
              className="absolute z-30 flex items-center justify-center"
              style={{ 
                left: '50%', 
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="relative">
                {/* Main bullseye emoji */}
                <div 
                  className="text-6xl animate-bounce"
                  style={{
                    animation: 'bullseyeBurst 1s ease-out',
                    filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))'
                  }}
                >
                  🎯
                </div>
                
                {/* Glowing pulse rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-4 border-mustard/50 animate-ping"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="w-24 h-24 rounded-full border-2 border-maroon/40 animate-ping"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="w-28 h-28 rounded-full bg-gradient-to-r from-maroon/20 to-mustard/20 animate-ping"
                    style={{ animationDelay: '0.4s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* MapPin with Enhanced Ping Effect */}
          <div 
            className={`absolute right-0 flex items-center justify-center ${
              showMergeAnimation ? 'animate-bounce' : ''
            }`}
            style={{ 
              transform: `translateX(50%) ${showMergeAnimation ? 'scale(1.2)' : 'scale(1)'}`,
              transition: showMergeAnimation ? 'all 0.3s ease-out' : 'none'
            }}
          >
            <div className="relative">
              <MapPin 
                className={`w-14 h-14 text-mustard transition-all duration-500 z-10 relative ${
                  showPingEffect ? 'scale-150' : 'scale-100'
                }`}
                style={{
                  filter: showPingEffect 
                    ? 'drop-shadow(0 0 20px rgba(212, 175, 55, 1)) drop-shadow(0 0 30px rgba(122, 18, 28, 0.6))'
                    : 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.5))',
                  animation: showPingEffect ? 'mapPinPulse 1s ease-in-out infinite' : 'none'
                }}
              />
              
              {/* Enhanced ping effects */}
              {showPingEffect && (
                <>
                  <div className="absolute inset-0 w-14 h-14 rounded-full border-4 border-mustard/50 animate-ping"></div>
                  <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-maroon/40 animate-ping" style={{ animationDelay: '0.3s' }}></div>
                  <div className="absolute inset-0 w-14 h-14 rounded-full bg-mustard/20 animate-ping" style={{ animationDelay: '0.1s' }}></div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Status Text */}
      <div className="text-center z-10 min-h-[120px] flex flex-col justify-center">
        <div 
          className="text-xl md:text-2xl font-semibold text-maroon mb-4 transition-all duration-500"
          style={{
            fontFamily: '"SF Pro Display", "Helvetica Neue", Arial, sans-serif',
            textShadow: '0 0 15px rgba(122, 18, 28, 0.2)',
            animation: 'textGlow 2.5s ease-in-out infinite alternate'
          }}
        >
          {phases[currentPhase]}
        </div>
        
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="text-base text-gray-500 font-medium">
            {Math.round(progress)}% complete
          </div>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-mustard rounded-full animate-pulse"
                style={{ 
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '1.5s'
                }}
              ></div>
            ))}
          </div>
        </div>
        
        {isComplete && (
          <div 
            className="text-green-600 font-bold text-lg flex items-center justify-center gap-2"
            style={{
              animation: 'celebrationPop 0.6s ease-out',
              textShadow: '0 0 15px rgba(34, 197, 94, 0.4)'
            }}
          >
            <span className="animate-spin">🎯</span>
            <span>Found your destination!</span>
            <span className="animate-bounce">✨</span>
          </div>
        )}
      </div>

      {/* Enhanced Custom Keyframes */}
      <style>
        {`
        @keyframes bounceFloat {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          25% {
            transform: translateY(-8px) scale(1.05);
          }
          50% {
            transform: translateY(0px) scale(1);
          }
          75% {
            transform: translateY(-4px) scale(1.02);
          }
        }
        
        @keyframes textSlideIn {
          from {
            opacity: 0;
            transform: translateX(-30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes textGlow {
          from {
            text-shadow: 0 0 15px rgba(122, 18, 28, 0.2);
          }
          to {
            text-shadow: 0 0 25px rgba(122, 18, 28, 0.4), 0 0 35px rgba(212, 175, 55, 0.3);
          }
        }
        
        @keyframes flowingLight {
          0% {
            transform: translateX(-100%) skewX(-12deg);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(300%) skewX(-12deg);
            opacity: 0;
          }
        }
        
        @keyframes mapPinPulse {
          0%, 100% {
            transform: scale(1.5);
          }
          50% {
            transform: scale(1.7);
          }
        }
        
        @keyframes celebrationPop {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(10px);
          }
          50% {
            transform: scale(1.1) translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes bullseyeBurst {
          0% {
            opacity: 0;
            transform: scale(0.3) rotate(-180deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.3) rotate(0deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
        `}
      </style>
    </div>
  );
};

export default LoadingAnimation;
