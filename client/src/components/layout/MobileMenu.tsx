import { useEffect, useCallback, useRef } from "react";
import { X, Home, User, Code, Briefcase, Mail, Shield, MessageCircle, Instagram, Twitter, Linkedin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onAdminClick: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SocialLink {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "skills", label: "Skills", icon: Code },
  { id: "projects", label: "Projects", icon: Briefcase },
  { id: "contact", label: "Contact", icon: Mail },
];

const socialLinks: SocialLink[] = [
  {
    icon: MessageCircle,
    href: "https://api.whatsapp.com/send/?phone=918985816481&text&type=phone_number&app_absent=0",
    label: "WhatsApp"
  },
  {
    icon: Instagram,
    href: "https://instagram.com/anandpinisetty",
    label: "Instagram"
  },
  {
    icon: Twitter,
    href: "https://twitter.com/anandpinisetty",
    label: "Twitter"
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com/in/anandpinisetty",
    label: "LinkedIn"
  },
];

export default function MobileMenu({ isOpen, onClose, activeSection, onAdminClick }: MobileMenuProps) {
  const { isAdmin } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLAnchorElement>(null);

  // Scroll to section and close menu
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    onClose();
  }, [onClose]);

  // Handle WhatsApp contact
  const handleWhatsAppContact = useCallback(() => {
    window.open(
      'https://api.whatsapp.com/send/?phone=918985816481&text&type=phone_number&app_absent=0',
      '_blank',
      'noopener,noreferrer'
    );
    onClose();
  }, [onClose]);

  // Handle admin click
  const handleAdminClick = useCallback(() => {
    onAdminClick();
    onClose();
  }, [onAdminClick, onClose]);

  // Handle social link click
  const handleSocialClick = useCallback((href: string) => {
    window.open(href, '_blank', 'noopener,noreferrer');
  }, []);

  // Keyboard navigation and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on Escape
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Focus trap
      if (e.key === 'Tab') {
        const focusableElements = menuRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;
        
        if (!focusableElements?.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Focus first element when menu opens
    if (firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.classList.add('mobile-menu-open');
      
      return () => {
        // Restore scroll position
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.classList.remove('mobile-menu-open');
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      };
    }
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className={`mobile-menu-overlay ${isOpen ? 'open' : ''}`}
        onClick={handleOverlayClick}
        aria-hidden={!isOpen}
      >
        {/* Menu Panel */}
        <div
          ref={menuRef}
          className={`mobile-menu-panel ${isOpen ? 'open' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          {/* Header */}
          <div className="mobile-menu-header">
            <div className="text-xl font-bold gradient-text font-playfair">
              Anand Pinisetty
            </div>
            <button
              ref={firstFocusableRef}
              onClick={onClose}
              className="mobile-menu-close"
              aria-label="Close menu"
              type="button"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="mobile-menu-content">
            {/* Navigation */}
            <nav className="mobile-menu-nav" role="navigation" aria-label="Main navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`mobile-menu-item ${
                      activeSection === item.id ? 'active' : ''
                    }`}
                    aria-label={`Navigate to ${item.label} section`}
                    type="button"
                  >
                    <Icon className="mobile-menu-item-icon" />
                    {item.label}
                  </button>
                );
              })}

              {/* Admin Link */}
              <button
                onClick={handleAdminClick}
                className="mobile-menu-item"
                aria-label="Admin dashboard"
                type="button"
              >
                <Shield className="mobile-menu-item-icon" />
                Admin
                {isAdmin && <span className="ml-2 text-sm opacity-75">(Logged in)</span>}
              </button>
            </nav>

            {/* Divider */}
            <div className="mobile-menu-divider" />

            {/* Get in Touch CTA */}
            <button
              onClick={handleWhatsAppContact}
              className="mobile-menu-item mobile-menu-cta"
              aria-label="Get in touch via WhatsApp"
              type="button"
            >
              <MessageCircle className="mobile-menu-item-icon" />
              Get in Touch
            </button>

            {/* Social Links */}
            <div className="mobile-menu-social">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                const isLastElement = social === socialLinks[socialLinks.length - 1];
                return (
                  <a
                    key={social.label}
                    ref={isLastElement ? lastFocusableRef : undefined}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mobile-menu-social-link"
                    aria-label={social.label}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSocialClick(social.href);
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Background content overlay when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          style={{ pointerEvents: 'none' }}
          aria-hidden="true"
        />
      )}
    </>
  );
}
