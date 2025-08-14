import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";
import ProjectManager from "./ProjectManager";
import ResumeManager from "./ResumeManager";
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
  FileText
} from "lucide-react";

interface AdminDashboardProps {
  onBackToPortfolio: () => void;
}

export default function AdminDashboard({ onBackToPortfolio }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("projects");
  const { logout } = useAuth();
  const { projects } = useProjects();

  const stats = [
    { 
      icon: <Eye className="w-8 h-8" />, 
      value: "1,234", 
      label: "Page Views",
      trend: "+12%",
      color: "text-blue-400"
    },
    { 
      icon: <MessageSquare className="w-8 h-8" />, 
      value: "56", 
      label: "Messages",
      trend: "+8%",
      color: "text-green-400"
    },
    { 
      icon: <FolderOpen className="w-8 h-8" />, 
      value: projects.length.toString(), 
      label: "Projects",
      trend: "+2",
      color: "text-gold"
    },
    { 
      icon: <Download className="w-8 h-8" />, 
      value: "89", 
      label: "Downloads",
      trend: "+15%",
      color: "text-purple-400"
    },
  ];

  const recentMessages = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      subject: "Project Inquiry",
      message: "Hi Anand, I'm interested in discussing a potential project...",
      time: "2 hours ago",
      status: "new"
    },
    {
      id: "2",
      name: "Sarah Wilson",
      email: "sarah@company.com",
      subject: "Collaboration",
      message: "Would love to collaborate on a web development project...",
      time: "1 day ago",
      status: "read"
    },
  ];

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
            <TabsTrigger value="projects" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Projects
            </TabsTrigger>
            <TabsTrigger value="resume" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Resume
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Messages
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-effect border-gold/20 bg-transparent">
                    <CardContent className="p-6 text-center">
                      <div className={`${stat.color} mb-3 flex justify-center`}>
                        {stat.icon}
                      </div>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <span className="text-sm text-green-400 flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {stat.trend}
                        </span>
                      </div>
                      <p className="text-gray-400">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="glass-effect border-gold/20 bg-transparent">
                <CardHeader>
                  <CardTitle className="text-gold flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Recent Messages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentMessages.map((message) => (
                    <div key={message.id} className="border-b border-gray-700 pb-4 last:border-b-0">
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
                          <span className="text-xs text-gray-500">{message.time}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{message.subject}</p>
                      <p className="text-sm text-gray-400 truncate">{message.message}</p>
                    </div>
                  ))}
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
                        <div>
                          <h4 className="font-semibold text-white">{project.title}</h4>
                          <p className="text-sm text-gray-400 truncate max-w-xs">
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
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <ProjectManager />
          </TabsContent>

          <TabsContent value="resume">
            <ResumeManager />
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card className="glass-effect border-gold/20 bg-transparent">
              <CardHeader>
                <CardTitle className="text-gold">Contact Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    Message Management Coming Soon
                  </h3>
                  <p className="text-gray-400">
                    This feature will allow you to manage and respond to contact form submissions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="glass-effect border-gold/20 bg-transparent">
              <CardHeader>
                <CardTitle className="text-gold">Analytics Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    Advanced Analytics Coming Soon
                  </h3>
                  <p className="text-gray-400">
                    Detailed analytics and reporting features will be available here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
