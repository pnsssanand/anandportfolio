import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useProjects } from "@/hooks/useProjects";
import { cloudinaryConfig } from "@/lib/firebase";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  ExternalLink, 
  Loader2,
  X,
  FolderOpen
} from "lucide-react";
import { InsertProject, Project } from "@shared/schema";

export default function ProjectManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<InsertProject>({
    title: "",
    description: "",
    techStack: [],
    media: "",
    link: "",
    featured: false,
  });
  const [techInput, setTechInput] = useState("");

  const { projects, loading, addProject, updateProject, deleteProject } = useProjects();
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      techStack: [],
      media: "",
      link: "",
      featured: false,
    });
    setTechInput("");
    setEditingProject(null);
  };

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        techStack: project.techStack,
        media: project.media || "",
        link: project.link || "",
        featured: project.featured,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", cloudinaryConfig.uploadPreset);
    formData.append("folder", "anand-portfolio/projects");

    const response = await fetch(cloudinaryConfig.apiUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, media: imageUrl }));
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const addTech = () => {
    if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, techInput.trim()]
      }));
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter(t => t !== tech)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      if (editingProject) {
        await updateProject(editingProject.id, formData);
      } else {
        await addProject(formData);
      }
      closeModal();
    } catch (error) {
      // Error handling is done in the useProjects hook
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteProject(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Manage Projects</h2>
        <Button 
          onClick={() => openModal()}
          className="bg-gradient-to-r from-gold to-gold-light text-black font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="glass-effect border-gold/20 bg-transparent">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="glass-effect border-gold/20 bg-transparent">
            <CardContent className="p-12 text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <FolderOpen className="w-24 h-24 text-gold mx-auto mb-6" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gold mb-4">No Projects Yet</h3>
              <p className="text-gray-300 mb-8 max-w-md mx-auto">
                Start building your portfolio by adding your first project. Showcase your work and let your creativity shine!
              </p>
              <Button 
                onClick={() => openModal()}
                className="bg-gradient-to-r from-gold to-gold-light text-black px-8 py-3 text-lg font-semibold hover:scale-105 transition-transform"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Project
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid gap-8">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group"
            >
              <Card className="glass-effect border-gold/20 bg-transparent hover:border-gold/40 transition-all duration-300 shadow-lg hover:shadow-2xl">
                <CardContent className="p-0">
                  {/* Two-column layout */}
                  <div className="grid md:grid-cols-5 gap-0">
                    {/* Left side - Project Image */}
                    <div className="md:col-span-2">
                      {project.media ? (
                        <div className="relative h-48 md:h-full min-h-[200px] overflow-hidden rounded-l-lg">
                          <img 
                            src={project.media} 
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {project.featured && (
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-gold text-black font-semibold shadow-lg">
                                Featured
                              </Badge>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-48 md:h-full min-h-[200px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-l-lg flex items-center justify-center">
                          <div className="text-center">
                            <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">No Image</p>
                          </div>
                          {project.featured && (
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-gold text-black font-semibold shadow-lg">
                                Featured
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right side - Project Details */}
                    <div className="md:col-span-3 p-6 flex flex-col justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gold mb-2 group-hover:text-gold-light transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-gray-300 text-base leading-relaxed mb-4">
                              {project.description}
                            </p>
                          </div>
                        </div>

                        {/* Tech Stack */}
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                            Technologies
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech) => (
                              <Badge 
                                key={tech} 
                                variant="secondary" 
                                className="bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors px-3 py-1"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Project Link */}
                        {project.link && (
                          <div className="mb-6">
                            <a 
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-gold hover:text-gold-light transition-colors font-medium"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Live Project
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-700">
                        <Button
                          onClick={() => project.link && window.open(project.link, '_blank')}
                          disabled={!project.link}
                          className="bg-gradient-to-r from-gold to-gold-light text-black font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                          title="View Project"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Project
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="default"
                          onClick={() => openModal(project)}
                          className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-all group/edit"
                          title="Edit Project"
                        >
                          <Edit className="w-4 h-4 mr-2 group-hover/edit:rotate-12 transition-transform" />
                          Edit
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="default"
                          onClick={() => handleDelete(project.id)}
                          className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition-all group/delete"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4 mr-2 group-hover/delete:scale-110 transition-transform" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <Card className="glass-effect border-gold/20 bg-luxury-darker">
              <CardHeader className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeModal}
                  className="absolute right-0 top-0 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
                <CardTitle className="text-2xl font-bold text-gold">
                  {editingProject ? "Edit Project" : "Add New Project"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="title" className="text-gray-300">Project Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter project title"
                      className="bg-luxury-light border-gray-600 text-white focus:border-gold mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-gray-300">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your project"
                      rows={4}
                      className="bg-luxury-light border-gray-600 text-white focus:border-gold mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">Tech Stack</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        placeholder="Add technology"
                        className="bg-luxury-light border-gray-600 text-white focus:border-gold"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                      />
                      <Button type="button" onClick={addTech} variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.techStack.map((tech) => (
                        <Badge 
                          key={tech} 
                          variant="secondary" 
                          className="bg-royal text-white cursor-pointer"
                          onClick={() => removeTech(tech)}
                        >
                          {tech} <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="link" className="text-gray-300">Project Link</Label>
                    <Input
                      id="link"
                      type="url"
                      value={formData.link}
                      onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                      placeholder="https://project-url.com"
                      className="bg-luxury-light border-gray-600 text-white focus:border-gold mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">Project Image</Label>
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("image-upload")?.click()}
                        disabled={uploading}
                        className="w-full border-gray-600 text-white hover:bg-gray-700"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Image
                          </>
                        )}
                      </Button>
                      {formData.media && (
                        <img 
                          src={formData.media} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-lg mt-4"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                    />
                    <Label htmlFor="featured" className="text-gray-300">Featured Project</Label>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <Button 
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-gold to-gold-light text-black font-semibold"
                    >
                      {editingProject ? "Update Project" : "Add Project"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={closeModal}
                      className="flex-1 border-gray-600 text-white hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
