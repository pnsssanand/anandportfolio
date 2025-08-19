import { AlertTriangle, RefreshCw, MessageCircle } from "lucide-react";

interface ProjectsErrorStateProps {
  error: any;
  onRetry?: () => void;
}

export default function ProjectsErrorState({ error, onRetry }: ProjectsErrorStateProps) {
  const isQuotaExceeded = error?.code === 'resource-exhausted' || 
                          error?.message?.includes('quota') ||
                          error?.message?.includes('exceeded');

  const handleWhatsAppContact = () => {
    const whatsappUrl = "https://api.whatsapp.com/send/?phone=918985816481&text=Hi%20Anand,%20I%20had%20trouble%20viewing%20your%20projects%20page.&type=phone_number&app_absent=0";
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  if (isQuotaExceeded) {
    // Show friendly quota exceeded message
    return (
      <div className="projects-error-state quota-exceeded">
        <div className="error-state-card">
          <div className="error-state-icon">
            <AlertTriangle className="icon" />
          </div>
          
          <div className="error-state-content">
            <h3 className="error-state-title">
              Projects Temporarily Unavailable
            </h3>
            <p className="error-state-description">
              My projects are taking a quick break! Please try again in a few moments, 
              or reach out to me directly to discuss my work.
            </p>
            
            <div className="error-state-actions">
              <button
                onClick={handleWhatsAppContact}
                className="cta-button primary"
                aria-label="Contact via WhatsApp"
                type="button"
              >
                <MessageCircle className="button-icon" />
                Let's Chat Instead
              </button>
              
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="cta-button secondary"
                  aria-label="Try loading projects again"
                  type="button"
                >
                  <RefreshCw className="button-icon" />
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show generic error message
  return (
    <div className="projects-error-state generic-error">
      <div className="error-state-card">
        <div className="error-state-icon">
          <AlertTriangle className="icon" />
        </div>
        
        <div className="error-state-content">
          <h3 className="error-state-title">
            Oops! Something went wrong
          </h3>
          <p className="error-state-description">
            We're having trouble loading the projects right now. 
            Let's connect directly so I can tell you about my work!
          </p>
          
          <div className="error-state-actions">
            <button
              onClick={handleWhatsAppContact}
              className="cta-button primary"
              aria-label="Contact via WhatsApp"
              type="button"
            >
              <MessageCircle className="button-icon" />
              Contact Me Directly
            </button>
            
            {onRetry && (
              <button
                onClick={onRetry}
                className="cta-button secondary"
                aria-label="Try loading projects again"
                type="button"
              >
                <RefreshCw className="button-icon" />
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
