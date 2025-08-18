import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import ProfilePhoto from "@/components/ui/ProfilePhoto";
import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { useAnalytics } from "@/hooks/useAnalytics";
import anandProfileImg from "@/assets/images/anand-profile.jpg";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { profile } = useProfile();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    // Track page view when Hero component mounts
    trackPageView('/');
  }, [trackPageView]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const x = (clientX / innerWidth) * 100;
      const y = (clientY / innerHeight) * 100;
      
      heroRef.current.style.setProperty('--mouse-x', `${x}%`);
      heroRef.current.style.setProperty('--mouse-y', `${y}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // WhatsApp redirect handler for "Get In Touch" button
  const handleWhatsAppRedirect = () => {
    const whatsappUrl = "https://api.whatsapp.com/send/?phone=918985816481&text&type=phone_number&app_absent=0";
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section 
      id="home" 
      ref={heroRef}
      className="hero-3d min-h-screen flex items-center justify-center relative"
      style={{
        background: `
          radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 175, 55, 0.1) 0%, transparent 50%),
          radial-gradient(circle at calc(100% - var(--mouse-x, 50%)) calc(100% - var(--mouse-y, 50%)), rgba(30, 58, 138, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, hsl(0, 0%, 4%) 0%, hsl(0, 0%, 10%) 50%, hsl(0, 0%, 16%) 100%)
        `
      }}
    >
      <div className="container mx-auto px-6 z-10">
        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          
          {/* Left Column - Profile Photo */}
          <motion.div 
            className="flex items-center justify-center order-1 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <ProfilePhoto 
                size="xl"
                alt="Anand Pinisetty - Full-Stack Developer, Ai Architect"
                src={profile.profileImageUrl || anandProfileImg}
              />
            </motion.div>
          </motion.div>

          {/* Right Column - Text Content */}
          <motion.div 
            className="flex flex-col justify-center order-2 lg:order-2 text-center lg:text-left"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-playfair"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <span className="gradient-text">Anand Pinisetty</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl lg:text-3xl mb-6 text-gray-300 font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
            >
              Full-Stack Developer | UI/UX Designer | Tech Innovator
            </motion.p>
            
            <motion.p 
              className="text-lg mb-8 text-gray-400 max-w-2xl lg:max-w-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              A dynamic and results-driven professional with proven expertise in business leadership, 
              marketing strategy, and modern web development. Passionate about leveraging technology, 
              AI, and creative innovation to deliver premium digital solutions.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 12px 30px rgba(255, 215, 0, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  onClick={() => scrollToSection('projects')}
                  className="bg-gradient-to-r from-gold to-gold-light text-black px-8 py-6 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 border border-gold/20"
                >
                  View My Work
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 12px 30px rgba(255, 255, 255, 0.15)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  variant="outline"
                  onClick={handleWhatsAppRedirect}
                  className="border-2 border-gold text-gold px-8 py-6 text-lg font-semibold hover:bg-gold hover:text-black transition-all duration-300 rounded-full shadow-lg bg-transparent"
                >
                  Get In Touch
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <motion.div 
        className="absolute top-20 left-10 w-20 h-20 bg-gold opacity-10 rounded-full hidden lg:block"
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-20 right-10 w-16 h-16 bg-royal opacity-10 rounded-full hidden lg:block"
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div 
        className="absolute top-1/2 left-20 w-12 h-12 bg-gold-light opacity-10 rounded-full hidden lg:block"
        animate={{ y: [-15, 15, -15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
    </section>
  );
}
