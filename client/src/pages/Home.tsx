import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import AdminLogin from "@/components/admin/AdminLogin";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

interface HomeProps {
  onAdminAccess: () => void;
}

export default function Home({ onAdminAccess }: HomeProps) {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { isAdmin } = useAuth();

  const handleAdminClick = () => {
    if (isAdmin) {
      onAdminAccess();
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleLoginSuccess = () => {
    onAdminAccess();
  };

  return (
    <div className="min-h-screen bg-luxury-dark text-white overflow-x-hidden">
      <Navigation onAdminClick={handleAdminClick} />
      
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>

      {/* Footer */}
      <footer className="bg-luxury-darker border-t border-gray-700 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="text-2xl font-bold gradient-text font-playfair mb-4">
              Anand Pinisetty
            </div>
            <p className="text-gray-400 mb-6">
              Building the future through innovation and technology
            </p>
            <div className="flex justify-center space-x-6 mb-6">
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                <i className="fab fa-github text-xl"></i>
              </a>
              <a href="mailto:anandpinisetty@gmail.com" className="text-gray-400 hover:text-gold transition-colors">
                <i className="fas fa-envelope text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 Anand Pinisetty. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <AdminLogin 
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
