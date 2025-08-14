import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Edit, Trash2 } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";

interface AdminProjectsProps {
  onEditProject: (project: any) => void;
  onDeleteProject: (id: string) => void;
}

export default function AdminProjects({ onEditProject, onDeleteProject }: AdminProjectsProps) {
  const { projects, loading } = useProjects();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="glass-effect border-gold/20 bg-transparent">
            <CardHeader>
              <Skeleton className="h-48 w-full rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-14" />
              </div>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {projects.map((project) => (
        <motion.div
          key={project.id}
          variants={itemVariants}
          whileHover={{ y: -10, scale: 1.02 }}
          className="project-card"
        >
          <Card className="glass-effect border-gold/20 bg-transparent overflow-hidden h-full">
            {project.media && (
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={project.media} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                {project.featured && (
                  <Badge className="absolute top-2 left-2 bg-gold text-black">
                    Featured
                  </Badge>
                )}
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gold">
                {project.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <p className="text-gray-300 mb-4 flex-1">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.map((tech, index) => (
                  <Badge 
                    key={tech}
                    variant="secondary"
                    className={`${
                      index % 2 === 0 
                        ? 'bg-royal text-white' 
                        : 'bg-gold text-black'
                    }`}
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.link && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="text-gold border-gold hover:bg-gold hover:text-black"
                  >
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditProject(project)}
                  className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteProject(project.id)}
                  className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
