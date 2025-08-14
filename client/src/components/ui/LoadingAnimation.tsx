import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingAnimationProps {
  onComplete: () => void;
}

export default function LoadingAnimation({ onComplete }: LoadingAnimationProps) {
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000); // 2 seconds total

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, hsl(0, 0%, 4%) 0%, hsl(0, 0%, 10%) 50%, hsl(0, 0%, 16%) 100%)`
        }}
      >
        <div className="text-center">
          {/* Animated Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold font-playfair gradient-text"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              Anand Pinisetty
            </motion.h1>
          </motion.div>

          {/* Loading Spinner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="relative"
          >
            {/* Outer Ring */}
            <motion.div
              className="w-16 h-16 rounded-full border-4 border-transparent border-t-gold border-r-gold mx-auto"
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Inner Ring */}
            <motion.div
              className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full border-4 border-transparent border-b-gold-light border-l-gold-light"
              animate={{ rotate: -360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* Center Dot */}
            <motion.div
              className="absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gold"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Loading Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-gray-300 mt-6 text-lg"
          >
            Crafting premium experiences...
          </motion.p>
        </div>

        {/* Background Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gold rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
