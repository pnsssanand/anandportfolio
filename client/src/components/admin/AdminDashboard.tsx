import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useMessages } from "@/hooks/useMessages";
import ProjectManager from "./ProjectManager";
import ResumeManager from "./ResumeManager";
import AnalyticsDashboard from "./AnalyticsDashboard";
import MessagesDashboard from "./MessagesDashboard";
import ProfileImageManager from "./ProfileImageManager";
import { 
  Eye, 
  MessageSquare, 
  FolderOpen, 
  Download, 
  LogOut,
  ArrowLeft,
  TrendingUp,
  Users,
  Calendar,
  FileText,
  Camera,
  ExternalLink
} from "lucide-react";

interface AdminDashboardProps {
  onBackToPortfolio: () => void;
}

export default function AdminDashboard({ onBackToPortfolio }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { logout } = useAuth();
  const { projects } = useProjects();
  const { analytics } = useAnalytics();
  const { messages, unreadCount, getRecentMessages } = useMessages();

  // Update project count in analytics when projects change
  useEffect(() => {
    if (projects.length > 0) {
      // This will be handled by the analytics hook
    }
  }, [projects.length]);

  const recentMessages = getRecentMessages(3);

  const handleMessageClick = () => {
    setActiveTab("messages");
  };

  const handleProjectClick = (projectUrl: string) => {
    if (projectUrl) {
      window.open(projectUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-luxury-dark">
      {/* Admin Navigation */}
      <nav className="bg-luxury-darker border-b border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBackToPortfolio}
                className="text-white hover:text-gold transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portfolio
              </Button>
              <h1 className="text-2xl font-bold gradient-text">Admin Dashboard</h1>
            </div>
            <Button
              variant="ghost"
              onClick={logout}
              className="text-white hover:text-gold transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-luxury-darker border border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Projects
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-gold data-[state=active]:text-black relative">
              Messages
              {unreadCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 py-0 min-w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Profile
            </TabsTrigger>
            <TabsTrigger value="resume" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Resume
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="glass-effect border-gold/20 bg-transparent">
                <CardHeader>
                  <CardTitle className="text-gold flex items-center justify-between">
                    <div className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Recent Messages
                    </div>
                    {unreadCount > 0 && (
                      <Badge className="bg-red-500 text-white">
                        {unreadCount} new
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentMessages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No messages yet</p>
                    </div>
                  ) : (
                    <>
                      {recentMessages.map((message) => (
                        <div 
                          key={message.id} 
                          className="border-b border-gray-700 pb-4 last:border-b-0 cursor-pointer hover:bg-gray-800/30 p-2 rounded transition-colors"
                          onClick={handleMessageClick}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-white">{message.name}</h4>
                              <p className="text-sm text-gray-400">{message.email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={message.status === "new" ? "default" : "secondary"}
                                className={message.status === "new" ? "bg-gold text-black" : ""}
                              >
                                {message.status}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(message.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300 mb-2">{message.subject}</p>
                          <p className="text-sm text-gray-400 truncate">{message.message}</p>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={handleMessageClick}
                        className="w-full border-gold text-gold hover:bg-gold hover:text-black"
                      >
                        View All Messages
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-effect border-gold/20 bg-transparent">
                <CardHeader>
                  <CardTitle className="text-gold flex items-center">
                    <FolderOpen className="w-5 h-5 mr-2" />
                    Recent Projects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="border-b border-gray-700 pb-4 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <Button
                            variant="ghost"
                            className="h-auto p-0 text-left justify-start"
                            onClick={() => handleProjectClick(project.link || '')}
                          >
                            <h4 className="font-semibold text-white hover:text-gold transition-colors">
                              {project.title}
                              <ExternalLink className="w-3 h-3 ml-1 inline" />
                            </h4>
                          </Button>
                          <p className="text-sm text-gray-400 truncate max-w-xs mt-1">
                            {project.description}
                          </p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {project.createdAt.toLocaleDateString()}
                          </div>
                        </div>
                        {project.featured && (
                          <Badge className="bg-gold text-black">Featured</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <div className="text-center py-8">
                      <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No projects yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectManager />
          </TabsContent>

          <TabsContent value="messages">
            <MessagesDashboard />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileImageManager />
          </TabsContent>

          <TabsContent value="resume">
            <ResumeManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
