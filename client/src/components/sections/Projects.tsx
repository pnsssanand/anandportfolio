import { useEffect, useRef, useState } from "react";
import { ExternalLink, Github, Eye } from "lucide-react";
import { useProjectsOptimized } from "@/hooks/useProjectsOptimized";
import ProjectSkeleton from "@/components/ui/ProjectSkeleton";
import ProjectsEmptyState from "@/components/ui/ProjectsEmptyState";
import ProjectsErrorState from "@/components/ui/ProjectsErrorState";

export default function Projects() {
  const { projects, loading, error, retry } = useProjectsOptimized({
    enableLiveUpdates: false, // Use one-time fetch to reduce quota usage
    useCache: true, // Enable caching for mobile
  });

  const [visibleProjects, setVisibleProjects] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll to contact section
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Intersection Observer for reveal animations (mobile-safe)
  useEffect(() => {
    if (!projects.length || typeof window === 'undefined') return;

    // Fallback: if IntersectionObserver is not supported, reveal all immediately
    if (!('IntersectionObserver' in window)) {
      setVisibleProjects(new Set(projects.map(p => p.id)));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const projectId = entry.target.getAttribute('data-project-id');
            if (projectId) {
              setVisibleProjects(prev => new Set([...Array.from(prev), projectId]));
            }
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px' // Mobile-safe margin
      }
    );

    observerRef.current = observer;

    // Observe all project cards
    const projectCards = document.querySelectorAll('[data-project-id]');
    projectCards.forEach(card => observer.observe(card));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [projects]);

  // Render project card
  const renderProjectCard = (project: any, index: number) => {
    const isVisible = visibleProjects.has(project.id);
    const staggerDelay = Math.min(index * 100, 500); // Max 500ms stagger

    return (
      <div
        key={project.id}
        data-project-id={project.id}
        className={`project-card ${isVisible ? 'visible' : ''}`}
        style={{
          animationDelay: `${staggerDelay}ms`,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease'
        }}
        role="article"
        aria-label={`Project: ${project.title}`}
      >
        {/* Project Thumbnail */}
        {project.media && (
          <div className="thumbnail">
            <img
              src={project.media}
              alt={`${project.title} project thumbnail`}
              loading="lazy"
              decoding="async"
              width="400"
              height="225"
              onError={(e) => {
                // Fallback for broken images
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            {project.featured && (
              <div 
                className="featured-badge"
                style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  background: '#E8C05A',
                  color: '#121418',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                Featured
              </div>
            )}
          </div>
        )}

        {/* Project Content */}
        <div className="project-content" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
          <h3 className="title">{project.title}</h3>
          
          <p className="meta">{project.description}</p>

          {/* Tech Stack */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="tech-stack">
              {project.techStack.slice(0, 4).map((tech: string, techIndex: number) => (
                <span key={techIndex} className="tech-item">
                  {tech}
                </span>
              ))}
              {project.techStack.length > 4 && (
                <span className="tech-item" style={{ opacity: 0.7 }}>
                  +{project.techStack.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="actions">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="action-button"
                aria-label={`Visit ${project.title} project`}
              >
                <ExternalLink className="button-icon" style={{ width: '16px', height: '16px' }} />
                View Project
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="action-button"
                aria-label={`View ${project.title} source code on GitHub`}
              >
                <Github className="button-icon" style={{ width: '16px', height: '16px' }} />
                Source
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section 
      ref={sectionRef}
      id="projects" 
      className="projects-section"
      style={{
        padding: '80px 0',
        background: 'var(--luxury-darker)',
        position: 'relative',
        zIndex: 1
      }}
    >
      <div className="projects">
        {/* Section Header */}
        <div 
          className="section-header"
          style={{
            textAlign: 'center',
            marginBottom: '48px'
          }}
        >
          <h2 
            className="section-title"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: '700',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #E8C05A, #f4d03f)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: 'var(--font-serif)'
            }}
          >
            Featured Projects
          </h2>
          <p 
            className="section-subtitle"
            style={{
              fontSize: 'clamp(1rem, 3vw, 1.25rem)',
              color: '#c7c9d1',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.5'
            }}
          >
            Innovative solutions and cutting-edge developments that showcase my expertise
          </p>
        </div>

        {/* Content Area */}
        {loading ? (
          <ProjectSkeleton count={12} />
        ) : error ? (
          <ProjectsErrorState error={error} onRetry={retry} />
        ) : projects.length === 0 ? (
          <ProjectsEmptyState onContactClick={scrollToContact} />
        ) : (
          <>
            <div className="projects-grid">
              {projects.map((project, index) => renderProjectCard(project, index))}
            </div>

            {/* CTA Section */}
            <div 
              className="projects-cta"
              style={{
                textAlign: 'center',
                marginTop: '48px',
                padding: '32px 16px'
              }}
            >
              <h3 
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#ffffff',
                  marginBottom: '16px'
                }}
              >
                Like what you see?
              </h3>
              <p 
                style={{
                  fontSize: '1rem',
                  color: '#c7c9d1',
                  marginBottom: '24px',
                  maxWidth: '400px',
                  margin: '0 auto 24px'
                }}
              >
                Let's collaborate and bring your ideas to life with innovative solutions.
              </p>
              <button
                onClick={scrollToContact}
                className="cta-button primary"
                style={{
                  fontSize: '16px',
                  padding: '16px 32px'
                }}
                aria-label="Contact me to discuss a project"
              >
                Let's Work Together
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
