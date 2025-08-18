import { motion } from "framer-motion";
import { useState } from "react";

interface ProfilePhotoProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-32 h-32",
  md: "w-48 h-48",
  lg: "w-64 h-64",
  xl: "w-72 h-72 md:w-80 md:h-80"
};

export default function ProfilePhoto({ 
  src, 
  alt = "Anand Pinisetty", 
  size = "xl",
  className = ""
}: ProfilePhotoProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`profile-photo-container ${className}`}>
      <motion.div
        className="profile-photo"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`${sizeClasses[size]} rounded-full border-4 border-gold shadow-2xl overflow-hidden relative`}>
          {src && !imageError ? (
            <>
              {/* Loading placeholder */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-luxury-light via-luxury-darker to-luxury-dark flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full"
                  />
                </div>
              )}
              
              <motion.img 
                src={src} 
                alt={alt}
                loading="eager"
                decoding="async"
                className={`w-full h-full object-cover object-center scale-150 transition-opacity duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  objectPosition: 'center 25%',
                  transformOrigin: 'center center'
                }}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: imageLoaded ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              />
            </>
          ) : (
            // Placeholder with sophisticated gradient and initials
            <div className="w-full h-full bg-gradient-to-br from-luxury-light via-luxury-darker to-luxury-dark flex items-center justify-center relative">
              {/* Background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-royal/10"></div>
              
              {/* Geometric patterns */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-8 h-8 border border-gold/30 rotate-45"></div>
                <div className="absolute bottom-1/4 right-1/4 w-6 h-6 border border-gold-light/30 rotate-12"></div>
                <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-gold/20 rounded-full"></div>
              </div>
              
              {/* Initials */}
              <div className="relative z-10">
                <span className="text-4xl md:text-6xl font-bold gradient-text font-playfair">
                  AP
                </span>
              </div>
              
              {/* Subtle inner glow */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-gold/5 to-transparent"></div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
