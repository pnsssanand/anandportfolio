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
                    <span className="text-white font-medium">{skill.name}</span>
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

          {/* Professional Skills */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6 text-gold">Professional Skills</h3>
            
            <div className="grid grid-cols-2 gap-6">
              {professionalSkills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  variants={skillCardVariants}
                  whileHover={{ scale: 1.08, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-effect p-6 rounded-xl text-center transition-all duration-300 hover:border-gold/60 hover:shadow-2xl hover:shadow-gold/25 cursor-pointer"
                >
                  <motion.div 
                    className="text-gold mb-4 flex justify-center"
                    whileHover={{ scale: 1.3, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {skill.icon}
                  </motion.div>
                  <motion.h4 
                    className="font-bold text-white text-lg mb-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    {skill.name}
                  </motion.h4>
                  <motion.p 
                    className="text-sm text-gray-300 font-medium"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.7 }}
                  >
                    {skill.description}
                  </motion.p>
                </motion.div>
              ))}
            </div>
            
            {/* Technologies */}
            <motion.div variants={itemVariants} className="mt-10">
              <motion.h4 
                className="text-xl font-semibold mb-6 text-gold"
                whileInView={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.6 }}
              >
                Technologies & Tools
              </motion.h4>
              <motion.div 
                className="flex flex-wrap gap-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.08,
                    },
                  },
                }}
              >
                {technologies.map((tech, index) => (
                  <motion.div
                    key={tech}
                    variants={{
                      hidden: { opacity: 0, scale: 0.6, y: 20 },
                      visible: { 
                        opacity: 1, 
                        scale: 1, 
                        y: 0,
                        transition: {
                          duration: 0.5,
                          ease: "easeOut",
                        },
                      },
                    }}
                    whileHover={{ 
                      scale: 1.1, 
                      y: -3,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge 
                      variant="secondary" 
                      className={`${
                        index % 3 === 0 
                          ? 'bg-gradient-to-r from-gold to-gold-light text-black hover:shadow-lg hover:shadow-gold/50' 
                          : index % 3 === 1
                          ? 'bg-gradient-to-r from-royal to-royal-light text-white hover:shadow-lg hover:shadow-royal/50'
                          : 'bg-gradient-to-r from-gray-600 to-gray-500 text-white hover:shadow-lg hover:shadow-gray/50'
                      } transition-all duration-300 cursor-pointer font-medium px-4 py-2 text-sm`}
                    >
                      {tech}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
