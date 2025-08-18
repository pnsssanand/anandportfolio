import { useState, useEffect, lazy, Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Home from "@/pages/Home";

// Lazy load Admin component for better performance
const Admin = lazy(() => import("@/pages/Admin"));

function App() {
  const [currentView, setCurrentView] = useState<"portfolio" | "admin">("portfolio");

  useEffect(() => {
    // Set smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Preload critical resources
    const preloadLinks = [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    ];

    preloadLinks.forEach(link => {
      const existingLink = document.head.querySelector(`link[href="${link.href}"]`);
      if (!existingLink) {
        const linkElement = document.createElement('link');
        Object.assign(linkElement, link);
        document.head.appendChild(linkElement);
      }
    });
    
    // Set page title and meta description
    document.title = "Anand Pinisetty - Full-Stack Developer AI Arichtect";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Portfolio of Anand Pinisetty - Full-Stack Developer, UI/UX Designer, and Tech Innovator. Specialized in AI web development, digital marketing, and innovative business solutions.'
      );
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Portfolio of Anand Pinisetty - Full-Stack Developer, UI/UX Designer, and Tech Innovator. Specialized in AI web development, digital marketing, and innovative business solutions.';
      document.head.appendChild(meta);
    }

    // Add viewport meta for responsive design
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
      document.head.appendChild(meta);
    }

    // Add Open Graph meta tags
    const ogTags = [
      { property: 'og:title', content: 'Anand Pinisetty - Full-Stack Developer Portfolio' },
      { property: 'og:description', content: 'Full-Stack Developer, UI/UX Designer & Tech Innovator - Building the future through technology' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Anand Pinisetty Portfolio' },
      { property: 'og:image', content: `${window.location.origin}/anand-profile.jpg` },
      { property: 'og:url', content: window.location.origin },
    ];

    ogTags.forEach(tag => {
      const existingTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (existingTag) {
        existingTag.setAttribute('content', tag.content);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', tag.property);
        meta.content = tag.content;
        document.head.appendChild(meta);
      }
    });

    // Add Twitter Card meta tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Anand Pinisetty - Full-Stack Developer' },
      { name: 'twitter:description', content: 'Full-Stack Developer, UI/UX Designer & Tech Innovator' },
      { name: 'twitter:image', content: `${window.location.origin}/anand-profile.jpg` },
    ];

    twitterTags.forEach(tag => {
      const existingTag = document.querySelector(`meta[name="${tag.name}"]`);
      if (existingTag) {
        existingTag.setAttribute('content', tag.content);
      } else {
        const meta = document.createElement('meta');
        meta.name = tag.name;
        meta.content = tag.content;
        document.head.appendChild(meta);
      }
    });

    // Add structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Anand Pinisetty",
      "jobTitle": "Full-Stack Developer, UI/UX Designer, Tech Innovator",
      "description": "Dynamic and results-driven professional with expertise in full-stack development, UI/UX design, and innovative technology solutions",
      "url": window.location.origin,
      "email": "pnsssanand@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Kakinada",
        "addressRegion": "Andhra Pradesh",
        "addressCountry": "India"
      },
      "alumniOf": {
        "@type": "EducationalOrganization",
        "name": "KIET, Kakinada"
      },
      "knowsAbout": [
        "Full-Stack Development",
        "AI Web Development",
        "UI/UX Design",
        "Digital Marketing",
        "Tech Innovation",
        "Business Strategy"
      ],
      "sameAs": [
        "https://linkedin.com/in/anandpinisetty",
        "https://github.com/anandpinisetty"
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      // Cleanup function to remove added elements
      document.head.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
        if (script.textContent?.includes('Anand Pinisetty')) {
          script.remove();
        }
      });
    };
  }, []);

  const handleAdminAccess = () => {
    setCurrentView("admin");
  };

  const handleBackToPortfolio = () => {
    setCurrentView("portfolio");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="font-poppins">
            {/* Theme toggle removed from main portfolio - only available in admin dashboard */}
            {currentView === "portfolio" ? (
              <Home onAdminAccess={handleAdminAccess} />
            ) : (
              <Suspense fallback={
                <div className="fixed inset-0 bg-luxury-dark flex items-center justify-center z-50">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gold"></div>
                </div>
              }>
                <Admin onBackToPortfolio={handleBackToPortfolio} />
              </Suspense>
            )}
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
