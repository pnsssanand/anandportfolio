import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export interface ResumeData {
  url: string;
  filename: string;
  uploadedAt: Date;
  fileSize: number;
  fileType: string;
}

export function useResume() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>();
  const { toast } = useToast();

  useEffect(() => {
    const resumeRef = doc(db, 'settings', 'resume');
    
    // Set up real-time listener for resume data
    const unsubscribe = onSnapshot(resumeRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setResumeData({
          url: data.url || '',
          filename: data.filename || '',
          uploadedAt: data.uploadedAt?.toDate() || new Date(),
          fileSize: data.fileSize || 0,
          fileType: data.fileType || ''
        });
      } else {
        setResumeData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const validateResumeFile = (file: File): boolean => {
    // Check file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload a PDF, DOC, or DOCX file.",
      });
      return false;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Resume file must be less than 10MB.",
      });
      return false;
    }

    return true;
  };

  const uploadResume = async (file: File): Promise<string> => {
    if (!validateResumeFile(file)) {
      throw new Error('Invalid file');
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Delete existing resume if it exists
      if (resumeData) {
        await deleteResume(false);
      }

      // Create a unique filename with timestamp
      const timestamp = Date.now();
      const extension = file.name.split('.').pop();
      const filename = `resume-${timestamp}.${extension}`;

      // Upload to Firebase Storage with progress tracking
      const storageRef = ref(storage, `resumes/${filename}`);
      
      // Use a custom upload with progress tracking
      const uploadTask = uploadBytes(storageRef, file);
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev === undefined) return 20;
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);

      try {
        const snapshot = await uploadTask;
        clearInterval(progressInterval);
        setUploadProgress(95);
        
        const downloadURL = await getDownloadURL(snapshot.ref);
        setUploadProgress(100);

        // Prepare resume data for Firestore
        const newResumeData = {
          url: downloadURL,
          filename: file.name,
          uploadedAt: new Date(),
          fileSize: file.size,
          fileType: file.type
        };

        // Save to Firestore for real-time sync
        await setDoc(doc(db, "settings", "resume"), newResumeData);

        toast({
          title: "Success!",
          description: "Resume uploaded successfully and is now available for download",
          duration: 4000,
        });

        return downloadURL;
      } catch (error) {
        clearInterval(progressInterval);
        throw error;
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Failed to upload resume. Please try again.",
      });
      throw error;
    } finally {
      setUploading(false);
      setUploadProgress(undefined);
    }
  };

  const deleteResume = async (showToast = true): Promise<void> => {
    if (!resumeData) return;

    try {
      // Delete from Firebase Storage
      const storageRef = ref(storage, `resumes/${resumeData.filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`);
      try {
        await deleteObject(storageRef);
      } catch (storageError) {
        // File might not exist in storage, continue with Firestore deletion
        console.warn('Error deleting from storage:', storageError);
      }

      // Delete from Firestore
      await deleteDoc(doc(db, "settings", "resume"));

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
      throw error;
    }
  };

  const downloadResume = (): void => {
    if (!resumeData?.url) {
      toast({
        variant: "destructive",
        title: "No Resume Available",
        description: "No resume has been uploaded yet.",
      });
      return;
    }

    try {
      // Create a temporary anchor element for download
      const link = document.createElement('a');
      link.href = resumeData.url;
      link.download = resumeData.filename || 'resume.pdf';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Resume Downloaded",
        description: "Resume file has been downloaded successfully!",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast({
        variant: "destructive",
        title: "Download Error",
        description: "Failed to download resume. Please try again.",
      });
    }
  };

  const viewResume = (): void => {
    if (!resumeData?.url) {
      toast({
        variant: "destructive",
        title: "No Resume Available",
        description: "No resume has been uploaded yet.",
      });
      return;
    }

    try {
      window.open(resumeData.url, '_blank', 'noopener,noreferrer');
      
      toast({
        title: "Resume Opened",
        description: "Resume opened in a new tab!",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error viewing resume:', error);
      toast({
        variant: "destructive",
        title: "View Error",
        description: "Failed to open resume. Please try again.",
      });
    }
  };

  return {
    resumeData,
    loading,
    uploading,
    uploadProgress,
    uploadResume,
    deleteResume,
    downloadResume,
    viewResume
  };
}
