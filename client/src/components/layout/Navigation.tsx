import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import MobileMenu from "./MobileMenu";

interface NavigationProps {
  onAdminClick: () => void;
}

export default function Navigation({ onAdminClick }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAdmin } = useAuth();
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleSectionChange = () => {
      const sections = ["home", "about", "skills", "projects", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", handleSectionChange);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleSectionChange);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    // Return focus to hamburger button for accessibility
    setTimeout(() => {
      hamburgerRef.current?.focus();
    }, 300);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-effect shadow-lg" : "bg-transparent"
      }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold gradient-text font-playfair">
              Anand Pinisetty
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`nav-link text-foreground hover:text-gold transition-colors ${
                    activeSection === item.id ? "text-gold" : ""
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={onAdminClick}
                className="text-foreground hover:text-gold transition-colors"
              >
                <Shield className="w-4 h-4" />
                {isAdmin && <span className="ml-2">Admin</span>}
              </Button>
            </div>
            
            {/* Mobile Hamburger Button */}
            <button
              ref={hamburgerRef}
              onClick={openMobileMenu}
              className="mobile-menu-hamburger lg:hidden"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              aria-label="Open mobile menu"
              type="button"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Premium Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        activeSection={activeSection}
        onAdminClick={onAdminClick}
      />
    </>
  );
}
