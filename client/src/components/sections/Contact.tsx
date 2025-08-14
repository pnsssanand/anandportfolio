import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import ResumeDownload from "@/components/ui/ResumeDownload";
import { 
  Mail, 
  MapPin, 
  Linkedin, 
  Github, 
  Eye, 
  MessageSquare, 
  FolderOpen, 
  Download,
  Loader2
} from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { InsertContactMessage } from "@shared/schema";

const contactInfo = [
  {
    icon: <Mail className="w-6 h-6" />,
    label: "Email",
    value: "anandpinisetty@gmail.com",
    href: "mailto:anandpinisetty@gmail.com",
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    label: "Location",
    value: "Kakinada, Andhra Pradesh, India",
  },
  {
    icon: <Linkedin className="w-6 h-6" />,
    label: "LinkedIn",
    value: "Connect with me",
    href: "#",
  },
  {
    icon: <Github className="w-6 h-6" />,
    label: "GitHub",
    value: "View my repositories",
    href: "#",
  },
];

const quickStats = [
  { icon: <Eye className="w-8 h-8" />, value: "15+", label: "Projects Completed" },
  { icon: <MessageSquare className="w-8 h-8" />, value: "2+", label: "Years Experience" },
  { icon: <FolderOpen className="w-8 h-8" />, value: "10+", label: "Happy Clients" },
  { icon: <Download className="w-8 h-8" />, value: "24/7", label: "Support" },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const messageData: InsertContactMessage = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      };

      await addDoc(collection(db, "messages"), {
        ...messageData,
        status: "new",
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Message Sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });

      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="contact" className="py-20 bg-luxury-dark">
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6 font-playfair gradient-text"
          >
            Let's Connect
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-300"
          >
            Ready to discuss your next project or opportunity
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto"
        >
          {/* Contact Information */}
          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <Card className="glass-effect border-gold/20 bg-transparent">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gold">Get In Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="text-gold mr-4">{item.icon}</div>
                      <div>
                        <p className="text-gray-300">{item.label}</p>
                        {item.href ? (
                          <a 
                            href={item.href}
                            className="text-white hover:text-gold transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-white">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Quick Stats */}
            <motion.div variants={itemVariants}>
              <Card className="glass-effect border-gold/20 bg-transparent">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gold">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {quickStats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-gold mb-2 flex justify-center">{stat.icon}</div>
                        <p className="text-3xl font-bold text-gold">{stat.value}</p>
                        <p className="text-gray-300 text-sm">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div variants={itemVariants}>
            <Card className="glass-effect border-gold/20 bg-transparent">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gold">Send Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-300">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Your full name"
                      className="bg-luxury-light border-gray-600 text-white focus:border-gold mt-2"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-gray-300">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your.email@example.com"
                      className="bg-luxury-light border-gray-600 text-white focus:border-gold mt-2"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject" className="text-gray-300">Subject *</Label>
                    <Select 
                      value={formData.subject} 
                      onValueChange={(value) => handleInputChange("subject", value)}
                    >
                      <SelectTrigger className="bg-luxury-light border-gray-600 text-white focus:border-gold mt-2">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent className="bg-luxury-light border-gray-600">
                        <SelectItem value="project">Project Inquiry</SelectItem>
                        <SelectItem value="collaboration">Collaboration</SelectItem>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="text-gray-300">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Tell me about your project or inquiry..."
                      rows={5}
                      className="bg-luxury-light border-gray-600 text-white focus:border-gold mt-2"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-gold to-gold-light text-black py-3 font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
                
                {/* Resume Download Section */}
                <ResumeDownload />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
