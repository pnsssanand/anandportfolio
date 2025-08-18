import { motion } from "framer-motion";
import { 
  Download, 
  ExternalLink, 
  MessageCircle, 
  Instagram, 
  Twitter, 
  Linkedin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useResume } from "@/hooks/useResume";

export default function Footer() {
  const { toast } = useToast();
  const { resumeData, downloadResume, viewResume } = useResume();

  // Resume download function - Downloads the PDF file from Firebase/Cloudinary
  const handleResumeDownload = () => {
    if (!resumeData) {
      toast({
        title: "Resume Not Available",
        description: "No resume has been uploaded yet.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    downloadResume();
  };

  // Resume view function - Opens the PDF in a new browser tab from Firebase/Cloudinary
  const handleResumeView = () => {
    if (!resumeData) {
      toast({
        title: "Resume Not Available", 
        description: "No resume has been uploaded yet.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    viewResume();
  };

  // WhatsApp contact function
  const handleWhatsAppContact = () => {
    window.open(
      'https://api.whatsapp.com/send/?phone=918985816481&text&type=phone_number&app_absent=0',
      '_blank',
      'noopener,noreferrer'
    );
  };

  // Social media link handlers (placeholders for now)
  const handleInstagramClick = () => {
    // Placeholder - replace with actual Instagram profile URL
    window.open('https://instagram.com/anandpinisetty', '_blank', 'noopener,noreferrer');
  };

  const handleTwitterClick = () => {
    // Placeholder - replace with actual Twitter profile URL
    window.open('https://twitter.com/anandpinisetty', '_blank', 'noopener,noreferrer');
  };

  const handleLinkedInClick = () => {
    // Placeholder - replace with actual LinkedIn profile URL
    window.open('https://linkedin.com/in/anandpinisetty', '_blank', 'noopener,noreferrer');
  };

  const socialButtons = [
    {
      icon: <MessageCircle className="w-5 h-5" />,
      label: "WhatsApp",
      onClick: handleWhatsAppContact,
      hoverColor: "hover:text-green-400 hover:shadow-green-400/20",
      ariaLabel: "Contact via WhatsApp"
    },
    {
      icon: <Instagram className="w-5 h-5" />,
      label: "Instagram", 
      onClick: handleInstagramClick,
      hoverColor: "hover:text-pink-400 hover:shadow-pink-400/20",
      ariaLabel: "Follow on Instagram"
    },
    {
      icon: <Twitter className="w-5 h-5" />,
      label: "Twitter",
      onClick: handleTwitterClick,
      hoverColor: "hover:text-blue-400 hover:shadow-blue-400/20",
      ariaLabel: "Follow on Twitter"
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      label: "LinkedIn",
      onClick: handleLinkedInClick,
      hoverColor: "hover:text-blue-500 hover:shadow-blue-500/20",
      ariaLabel: "Connect on LinkedIn"
    }
  ];

  const resumeButtons = [
    {
      icon: <Download className="w-4 h-4" />,
      label: "Download Resume",
      onClick: handleResumeDownload,
      ariaLabel: resumeData ? "Download resume PDF file" : "Resume not available - upload needed",
      disabled: !resumeData
    },
    {
      icon: <ExternalLink className="w-4 h-4" />,
      label: "View Resume",
      onClick: handleResumeView,
      ariaLabel: resumeData ? "View resume in new tab" : "Resume not available - upload needed",
      disabled: !resumeData
    }
  ];

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-luxury-darker border-t-2 border-gold/20 py-8 mt-auto" // Added thin gold border-top and maintained slim height
    >
      <div className="container mx-auto px-6">
        <div className="space-y-6"> {/* Vertical spacing for main sections */}
          
          {/* Main Layout: Left-Right Split (Desktop) / Stacked (Mobile) */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12"> {/* Responsive flexbox: vertical on mobile, horizontal on desktop */}
            
            {/* LEFT SECTION - Social Media */}
            <motion.div 
              className="flex flex-col items-center lg:items-start lg:flex-1" // Center on mobile, left-align on desktop
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Connect With Me Title */}
              <h3 className="text-xs font-semibold text-gold uppercase tracking-wider mb-4">Connect With Me</h3>
              
              {/* Social Icons - Centered within left section */}
              <div className="flex justify-center lg:justify-start items-center gap-4"> {/* Center on mobile, left-align on desktop */}
                {socialButtons.map((button, index) => (
                  <motion.button
                    key={button.label}
                    onClick={button.onClick}
                    aria-label={button.ariaLabel}
                    className="group relative p-3 rounded-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 text-white/80 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-gold/40" // Enhanced gold glow on hover
                    whileHover={{ 
                      scale: 1.1,
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    {/* Background gold glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/10 to-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.1 }}
                    />
                    <div className="w-5 h-5 flex items-center justify-center relative z-10"> {/* Consistent circular icon size */}
                      {button.icon}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* RIGHT SECTION - Resume Buttons */}
            <motion.div 
              className="flex flex-col items-center lg:items-end lg:flex-1" // Center on mobile, right-align on desktop
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Resume Buttons - Vertically Stacked */}
              <div className="flex flex-col gap-3 w-full max-w-[200px]"> {/* Vertical stack with consistent spacing */}
                {resumeButtons.map((button, index) => (
                  <motion.button
                    key={button.label}
                    onClick={button.disabled ? undefined : button.onClick}
                    aria-label={button.ariaLabel}
                    disabled={button.disabled}
                    className={`flex items-center justify-center gap-2 px-5 py-2.5 border border-gold/30 rounded-full font-medium text-sm w-full transition-all duration-300 ${
                      button.disabled 
                        ? 'bg-gray-700/50 text-gray-500 border-gray-600/50 cursor-not-allowed opacity-60' 
                        : 'bg-gradient-to-r from-gold/10 to-gold-light/10 text-gold hover:bg-gold hover:text-black hover:scale-105 hover:shadow-xl hover:shadow-gold/50'
                    }`}
                    whileHover={button.disabled ? {} : { 
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(255, 215, 0, 0.5)" // Smooth gold glow on hover
                    }}
                    whileTap={button.disabled ? {} : { scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    title={button.disabled ? "Resume not uploaded yet" : undefined}
                  >
                    {button.icon}
                    <span className="font-medium">{button.disabled ? "Resume Not Available" : button.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* BOTTOM SECTION - Copyright (Full Width, Centered) */}
          <motion.div 
            className="pt-4 border-t border-gray-700/30 text-center" // Separator line and center alignment
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.p 
              className="text-xs text-gray-400 opacity-80 hover:text-gold hover:opacity-100 transition-all duration-300 cursor-default" // Smaller font, light gray color
              whileHover={{ scale: 1.02 }}
            >
              Website designed and developed by{" "}
              <span className="font-bold text-gold">Mr. Anand Pinisetty</span> {/* Developer name in bold gold */}
              {" "}© 2025 All rights reserved
            </motion.p>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
}
