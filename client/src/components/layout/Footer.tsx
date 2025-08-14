import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-luxury-darker border-t border-gray-700/30 py-6 mt-auto"
    >
      <div className="container mx-auto px-6">
        <div className="text-center">
          <motion.p 
            className="text-sm text-gray-400 opacity-80 hover:text-gold hover:opacity-100 transition-all duration-300 cursor-default"
            whileHover={{ scale: 1.02 }}
          >
            Website designed and developed by{" "}
            <span className="font-semibold text-white">Mr. Anand Pinisetty</span>
          </motion.p>
        </div>
      </div>
    </motion.footer>
  );
}
