import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Loader2, FileText } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ResumeData {
  url: string;
  filename: string;
  uploadedAt: string;
}

export default function ResumeDownload() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResumeData();
  }, []);

  const loadResumeData = async () => {
    try {
      const docRef = doc(db, "settings", "resume");
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setResumeData(docSnap.data() as ResumeData);
      }
    } catch (error) {
      console.error("Error loading resume data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (resumeData) {
      const link = document.createElement('a');
      link.href = resumeData.url;
      link.download = resumeData.filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-8 pt-6 border-t border-gray-600"
      >
        <div className="flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin text-gold mr-2" />
          <span className="text-gray-300">Loading resume...</span>
        </div>
      </motion.div>
    );
  }

  if (!resumeData) {
    return null; // Don't show anything if no resume is available
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-8 pt-6 border-t border-gray-600"
    >
      <div className="text-center">
        <motion.div
          className="flex items-center justify-center mb-4"
          whileHover={{ scale: 1.05 }}
        >
          <FileText className="w-6 h-6 text-gold mr-2" />
          <h3 className="text-xl font-semibold text-gold">Resume</h3>
        </motion.div>
        
        <p className="text-gray-300 mb-6">
          Download my latest resume to learn more about my experience and qualifications.
        </p>
        
        <Button
          onClick={handleDownload}
          className="bg-gradient-to-r from-gold to-gold-light text-black px-8 py-3 text-lg font-semibold hover:scale-105 transition-transform"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Resume
        </Button>
        
        <p className="text-sm text-gray-400 mt-3">
          PDF • Last updated {new Date(resumeData.uploadedAt).toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
}
