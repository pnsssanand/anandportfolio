import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import AdminLogin from "@/components/admin/AdminLogin";
import LoadingAnimation from "@/components/ui/LoadingAnimation";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

interface HomeProps {
  onAdminAccess: () => void;
}

export default function Home({ onAdminAccess }: HomeProps) {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const { isAdmin } = useAuth();

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

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
    <>
      {showLoading && <LoadingAnimation onComplete={handleLoadingComplete} />}
      
      <div className={`min-h-screen bg-luxury-dark text-white overflow-x-hidden flex flex-col ${showLoading ? 'hidden' : ''}`}>
        <Navigation onAdminClick={handleAdminClick} />
        
        <main className="flex-1">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>

        <Footer />

        <AdminLogin 
          isOpen={showAdminLogin}
          onClose={() => setShowAdminLogin(false)}
          onSuccess={handleLoginSuccess}
        />
      </div>
    </>
  );
}
