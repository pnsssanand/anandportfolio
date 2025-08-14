import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  FileText, 
  Trash2, 
  Download,
  Loader2
} from "lucide-react";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { storage, db } from "@/lib/firebase";

interface ResumeData {
  url: string;
  filename: string;
  uploadedAt: string;
}

export default function ResumeManager() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  const uploadResume = async (file: File) => {
    if (!file.type.includes("pdf") && !file.type.includes("doc")) {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload a PDF or Word document.",
      });
      return;
    }

    setUploading(true);
    try {
      // Delete existing resume if it exists
      if (resumeData) {
        await deleteResume(false);
      }

      // Upload new resume
      const storageRef = ref(storage, `resumes/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const newResumeData: ResumeData = {
        url: downloadURL,
        filename: file.name,
        uploadedAt: new Date().toISOString(),
      };

      // Save to Firestore
      await setDoc(doc(db, "settings", "resume"), newResumeData);
      setResumeData(newResumeData);

      toast({
        title: "Success",
        description: "Resume uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Failed to upload resume. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteResume = async (showToast = true) => {
    if (!resumeData) return;

    try {
      // Delete from storage
      const storageRef = ref(storage, `resumes/${resumeData.filename}`);
      await deleteObject(storageRef);

      // Delete from Firestore
      await deleteDoc(doc(db, "settings", "resume"));
      setResumeData(null);

      if (showToast) {
        toast({
          title: "Success",
          description: "Resume deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      if (showToast) {
        toast({
          variant: "destructive",
          title: "Delete Failed",
          description: "Failed to delete resume. Please try again.",
        });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadResume(file);
    }
  };

  if (loading) {
    return (
      <Card className="glass-effect border-gold/20 bg-transparent">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-gold/20 bg-transparent">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gold flex items-center">
          <FileText className="w-6 h-6 mr-2" />
          Resume Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {resumeData ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-luxury-light p-4 rounded-lg border border-gold/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white mb-1">{resumeData.filename}</h3>
                  <p className="text-sm text-gray-400">
                    Uploaded: {new Date(resumeData.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="text-gold border-gold hover:bg-gold hover:text-black"
                  >
                    <a href={resumeData.url} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteResume()}
                    className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gold mb-2">No Resume Uploaded</h3>
            <p className="text-gray-300 mb-6">Upload your resume to make it available for download.</p>
          </div>
        )}

        <div>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
            id="resume-upload"
          />
          <Button
            type="button"
            onClick={() => document.getElementById("resume-upload")?.click()}
            disabled={uploading}
            className="w-full bg-gradient-to-r from-gold to-gold-light text-black font-semibold"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {resumeData ? "Replace Resume" : "Upload Resume"}
              </>
            )}
          </Button>
          <p className="text-sm text-gray-400 mt-2 text-center">
            Accepted formats: PDF, DOC, DOCX (Max 10MB)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
