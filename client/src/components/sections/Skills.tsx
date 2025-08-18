import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Lightbulb, 
  TrendingUp, 
  Handshake,
  Code,
  Palette,
  Database,
  Cloud,
  Bot,
  Github as GithubIcon
} from "lucide-react";

const coreSkills = [
  { name: "HTML, CSS, JavaScript", proficiency: 95, icon: <Code className="w-5 h-5" /> },
  { name: "UI & UX Design", proficiency: 90, icon: <Palette className="w-5 h-5" /> },
  { name: "React.js", proficiency: 85, icon: <Code className="w-5 h-5" /> },
  { name: "Firebase", proficiency: 85, icon: <Database className="w-5 h-5" /> },
  { name: "Cloudinary", proficiency: 80, icon: <Cloud className="w-5 h-5" /> },
  { name: "AI APIs", proficiency: 80, icon: <Bot className="w-5 h-5" /> },
  { name: "GitHub", proficiency: 80, icon: <GithubIcon className="w-5 h-5" /> },
];

const softSkills = [
  "Leadership & Team Management",
  "Creative Problem Solving", 
  "Strategic Planning",
  "Client Relationship Management",
];

export default function Skills() {
  const [skillsInView, setSkillsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setSkillsInView(true);
        }
      },
      { threshold: 0.3 }
    );

    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      observer.observe(skillsSection);
    }

    return () => observer.disconnect();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const skillCardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="skills" className="py-20 bg-luxury-dark">
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
            Skills & Expertise
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-muted-foreground"
          >
            Technical proficiencies and professional capabilities
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-12"
        >
          {/* Core Skills */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6 text-gold">Core Skills</h3>
            
            {coreSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                variants={skillCardVariants}
                whileHover={{ scale: 1.02, x: 10 }}
                className="skill-item p-4 rounded-lg glass-effect transition-all duration-300 hover:shadow-xl hover:shadow-gold/20"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <motion.span 
                      className="text-gold"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {skill.icon}
                    </motion.span>
                    <span className="text-foreground font-medium">{skill.name}</span>
                  </div>
                  <motion.span 
                    className="text-gold font-bold text-lg"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.2 + 0.8 }}
                  >
                    {skill.proficiency}%
                  </motion.span>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="relative"
                >
                  <Progress 
                    value={skillsInView ? skill.proficiency : 0}
                    className="h-3 bg-gray-700/50"
                    style={{
                      transition: `all 2s ease-in-out ${index * 200}ms`,
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-gold/20 to-transparent rounded-full"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.2 + 1 }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Soft Skills */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6 text-gold">Soft Skills</h3>
            
            <div className="space-y-4">
              {softSkills.map((skill, index) => (
                <motion.div
                  key={skill}
                  variants={skillCardVariants}
                  whileHover={{ scale: 1.02, x: 5 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="glass-effect p-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-gold/10 hover:border-gold/30"
                >
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="w-2 h-2 bg-gradient-to-r from-gold to-gold-light rounded-full"
                      whileHover={{ scale: 1.5 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="text-foreground font-medium">{skill}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Professional Highlights */}
            <motion.div 
              variants={itemVariants} 
              className="mt-10 p-6 glass-effect rounded-xl border-gold/20"
            >
              <motion.h4 
                className="text-xl font-semibold mb-4 text-gold flex items-center gap-2"
                whileInView={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.6 }}
              >
                <Users className="w-5 h-5" />
                Professional Highlights
              </motion.h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <motion.div 
                    className="text-2xl font-bold text-gold mb-1"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                  >
                    100%
                  </motion.div>
                  <p className="text-muted-foreground text-sm">Client Satisfaction</p>
                </div>
                <div>
                  <motion.div 
                    className="text-2xl font-bold text-gold mb-1"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
                  >
                    2+
                  </motion.div>
                  <p className="text-muted-foreground text-sm">Years Excellence</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
