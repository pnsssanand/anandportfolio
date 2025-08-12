import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, TrendingUp, Code, GraduationCap, Calendar, MapPin } from "lucide-react";

const educationData = [
  {
    id: "1",
    degree: "Bachelor of Technology (B.Tech)",
    institution: "KIET, Kakinada",
    specialization: "Computer Science — AI & Data Science",
    duration: "2022 – 2026",
    current: true,
  },
  {
    id: "2",
    degree: "Intermediate (MPC)",
    institution: "Pragati Junior College, Kakinada",
    specialization: "Mathematics, Physics, Chemistry",
    duration: "2020 – 2022",
    current: false,
  },
  {
    id: "3",
    degree: "Secondary Education",
    institution: "St. Anthony's EM High School, Kakinada",
    specialization: "High School Diploma",
    duration: "2019 – 2020",
    current: false,
  },
];

export default function About() {
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

  return (
    <section id="about" className="py-20 bg-luxury-darker">
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
            About Me
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Based in Kakinada, Andhra Pradesh, India. Currently pursuing B.Tech in Computer Science 
            with specialization in Artificial Intelligence & Data Science at KIET.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <Card className="glass-effect border-gold/20 bg-transparent">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold mb-4 text-gold">Current Roles</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Crown className="text-gold mr-3 w-5 h-5" />
                      <span>Founder & CEO, Anand Travel Agency</span>
                    </li>
                    <li className="flex items-center">
                      <TrendingUp className="text-gold mr-3 w-5 h-5" />
                      <span>Chief Marketing Officer & Board Member, Dream Team Services</span>
                    </li>
                    <li className="flex items-center">
                      <Code className="text-gold mr-3 w-5 h-5" />
                      <span>Full-Stack Developer</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="glass-effect border-gold/20 bg-transparent">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold mb-4 text-gold">Expertise</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Specializing in business leadership, digital marketing strategy, and cutting-edge 
                    web development. Passionate about AI integration, user experience design, and 
                    creating innovative solutions that drive business growth.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="glass-effect border-gold/20 bg-transparent">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <MapPin className="text-gold mr-3 w-5 h-5" />
                    <h3 className="text-2xl font-semibold text-gold">Location</h3>
                  </div>
                  <p className="text-gray-300">Kakinada, Andhra Pradesh, India</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Education Timeline */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="flex items-center mb-6">
              <GraduationCap className="text-gold mr-3 w-6 h-6" />
              <h3 className="text-2xl font-semibold text-gold">Education Timeline</h3>
            </div>
            
            <div className="space-y-6">
              {educationData.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  variants={itemVariants}
                  className={`relative pl-8 ${index < educationData.length - 1 ? 'border-l-2' : ''} ${
                    edu.current ? 'border-gold' : 'border-gray-600'
                  }`}
                >
                  <div className={`absolute w-4 h-4 rounded-full -left-2 top-0 ${
                    edu.current ? 'bg-gold' : 'bg-gray-600'
                  }`} />
                  <Card className="glass-effect border-gold/20 bg-transparent">
                    <CardContent className="p-4">
                      <h4 className={`text-lg font-semibold ${
                        edu.current ? 'text-gold-light' : 'text-white'
                      }`}>
                        {edu.degree}
                      </h4>
                      <p className="text-gray-300">{edu.specialization}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{edu.institution} | {edu.duration}</span>
                      </div>
                      {edu.current && (
                        <span className="inline-block mt-2 px-2 py-1 bg-gold text-black text-xs rounded-full font-medium">
                          Current
                        </span>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
