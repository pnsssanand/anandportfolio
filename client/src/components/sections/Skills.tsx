import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Lightbulb, 
  TrendingUp, 
  Handshake,
  Code,
  Palette,
  BarChart3,
  Video
} from "lucide-react";

const technicalSkills = [
  { name: "AI Web Development", proficiency: 90, icon: <Code className="w-4 h-4" /> },
  { name: "HTML, CSS, JavaScript", proficiency: 85, icon: <Code className="w-4 h-4" /> },
  { name: "UI & UX Design", proficiency: 80, icon: <Palette className="w-4 h-4" /> },
  { name: "Digital Marketing", proficiency: 88, icon: <BarChart3 className="w-4 h-4" /> },
  { name: "AI Video Development", proficiency: 75, icon: <Video className="w-4 h-4" /> },
];

const professionalSkills = [
  { name: "Leadership", description: "Team Management", icon: <Users className="w-8 h-8" /> },
  { name: "Innovation", description: "Creative Problem Solving", icon: <Lightbulb className="w-8 h-8" /> },
  { name: "Strategy", description: "Strategic Planning", icon: <TrendingUp className="w-8 h-8" /> },
  { name: "Relations", description: "Client Management", icon: <Handshake className="w-8 h-8" /> },
];

const technologies = [
  "React", "Firebase", "Cloudinary", "AI APIs", "Node.js", "MongoDB", 
  "Python", "TensorFlow", "Next.js", "TypeScript", "Tailwind CSS", "Express.js"
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
        staggerChildren: 0.1,
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
            className="text-xl text-gray-300"
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
          {/* Technical Skills */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6 text-gold">Technical Skills</h3>
            
            {technicalSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                variants={itemVariants}
                className="skill-item"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gold">{skill.icon}</span>
                    <span className="text-white">{skill.name}</span>
                  </div>
                  <span className="text-gold font-semibold">{skill.proficiency}%</span>
                </div>
                <Progress 
                  value={skillsInView ? skill.proficiency : 0}
                  className="h-3 bg-gray-700"
                  style={{
                    transition: `all 2s ease-in-out ${index * 200}ms`,
                  }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Professional Skills */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6 text-gold">Professional Skills</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {professionalSkills.map((skill) => (
                <motion.div
                  key={skill.name}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="glass-effect p-4 rounded-lg text-center transition-all duration-300 hover:border-gold/40"
                >
                  <div className="text-gold mb-3 flex justify-center">{skill.icon}</div>
                  <h4 className="font-semibold text-white">{skill.name}</h4>
                  <p className="text-sm text-gray-400">{skill.description}</p>
                </motion.div>
              ))}
            </div>
            
            {/* Technologies */}
            <motion.div variants={itemVariants} className="mt-8">
              <h4 className="text-xl font-semibold mb-4 text-gold">Technologies & Tools</h4>
              <div className="flex flex-wrap gap-3">
                {technologies.map((tech, index) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Badge 
                      variant="secondary" 
                      className={`${
                        index % 2 === 0 
                          ? 'bg-gold text-black hover:bg-gold-light' 
                          : 'bg-royal text-white hover:bg-royal-light'
                      } transition-colors duration-300`}
                    >
                      {tech}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
