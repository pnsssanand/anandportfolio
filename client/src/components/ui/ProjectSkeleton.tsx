interface ProjectSkeletonProps {
  count?: number;
}

export default function ProjectSkeleton({ count = 12 }: ProjectSkeletonProps) {
  return (
    <div className="projects-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="project-card-skeleton">
          <div className="project-card">
            {/* Image skeleton */}
            <div className="thumbnail-skeleton"></div>
            
            {/* Content skeleton */}
            <div className="content-skeleton">
              {/* Title skeleton */}
              <div className="title-skeleton"></div>
              
              {/* Description skeleton */}
              <div className="description-skeleton">
                <div className="line"></div>
                <div className="line"></div>
                <div className="line short"></div>
              </div>
              
              {/* Tech stack skeleton */}
              <div className="tech-stack-skeleton">
                <div className="tech-item"></div>
                <div className="tech-item"></div>
                <div className="tech-item"></div>
              </div>
              
              {/* Button skeleton */}
              <div className="button-skeleton"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
