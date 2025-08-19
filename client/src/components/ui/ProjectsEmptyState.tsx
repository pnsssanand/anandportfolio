import { MessageCircle, Code, Briefcase } from "lucide-react";

interface ProjectsEmptyStateProps {
  onContactClick?: () => void;
}

export default function ProjectsEmptyState({ onContactClick }: ProjectsEmptyStateProps) {
  const handleWhatsAppContact = () => {
    const whatsappUrl = "https://api.whatsapp.com/send/?phone=918985816481&text=Hi%20Anand,%20I'd%20like%20to%20discuss%20a%20project%20with%20you.&type=phone_number&app_absent=0";
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleContactClick = () => {
    if (onContactClick) {
      onContactClick();
    } else {
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="projects-empty-state">
      <div className="empty-state-card">
        <div className="empty-state-icon">
          <div className="icon-stack">
            <Code className="icon icon-1" />
            <Briefcase className="icon icon-2" />
          </div>
        </div>
        
        <div className="empty-state-content">
          <h3 className="empty-state-title">
            Building Amazing Projects
          </h3>
          <p className="empty-state-description">
            I'm currently working on some exciting projects that will be showcased here soon. 
            In the meantime, let's discuss how I can help bring your ideas to life.
          </p>
          
          <div className="empty-state-actions">
            <button
              onClick={handleWhatsAppContact}
              className="cta-button primary"
              aria-label="Contact via WhatsApp"
              type="button"
            >
              <MessageCircle className="button-icon" />
              Let's Chat on WhatsApp
            </button>
            
            <button
              onClick={handleContactClick}
              className="cta-button secondary"
              aria-label="Go to contact section"
              type="button"
            >
              View Contact Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
