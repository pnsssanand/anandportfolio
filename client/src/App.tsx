import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";

function App() {
  const [currentView, setCurrentView] = useState<"portfolio" | "admin">("portfolio");

  useEffect(() => {
    // Set smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Set page title and meta description
    document.title = "Anand Pinisetty - Entrepreneur | Developer | Innovator";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Portfolio of Anand Pinisetty - Entrepreneur, Founder & CEO, and Full-Stack Developer. Specialized in AI web development, digital marketing, and innovative business solutions.'
      );
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Portfolio of Anand Pinisetty - Entrepreneur, Founder & CEO, and Full-Stack Developer. Specialized in AI web development, digital marketing, and innovative business solutions.';
      document.head.appendChild(meta);
    }

    // Add Open Graph meta tags
    const ogTags = [
      { property: 'og:title', content: 'Anand Pinisetty - Portfolio' },
      { property: 'og:description', content: 'Entrepreneur, Developer & Innovator - Building the future through technology' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Anand Pinisetty Portfolio' },
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

    // Add structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Anand Pinisetty",
      "jobTitle": "Entrepreneur, Founder & CEO, Developer",
      "description": "Dynamic and results-driven professional with expertise in business leadership, marketing strategy, and modern web development",
      "url": window.location.origin,
      "email": "anandpinisetty@gmail.com",
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
        "AI Web Development",
        "Digital Marketing",
        "Business Leadership",
        "UI/UX Design",
        "Full-Stack Development"
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
      <TooltipProvider>
        <div className="font-poppins">
          {currentView === "portfolio" ? (
            <Home onAdminAccess={handleAdminAccess} />
          ) : (
            <Admin onBackToPortfolio={handleBackToPortfolio} />
          )}
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
