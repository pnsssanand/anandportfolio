import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="icon"
      className="fixed top-6 right-6 z-[100] bg-background/80 backdrop-blur-md border-border hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-lg hover:shadow-xl"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        initial={false}
        animate={{ 
          scale: theme === 'dark' ? 1 : 0,
          rotate: theme === 'dark' ? 0 : 180,
          opacity: theme === 'dark' ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon className="h-5 w-5 text-gold" />
      </motion.div>
      
      <motion.div
        initial={false}
        animate={{ 
          scale: theme === 'light' ? 1 : 0,
          rotate: theme === 'light' ? 0 : -180,
          opacity: theme === 'light' ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sun className="h-5 w-5 text-gold" />
      </motion.div>
    </Button>
  );
};

export default ThemeToggle;
