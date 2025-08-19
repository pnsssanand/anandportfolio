import { useState, useEffect, useRef } from 'react';
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
  
  // Ref to track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    const resumeRef = doc(db, 'settings', 'resume');
    
    // QUOTA OPTIMIZATION: Single onSnapshot listener with proper error handling
    // This prevents multiple listeners and reduces unnecessary read operations
    const unsubscribe = onSnapshot(resumeRef, (doc) => {
      try {
        // Check if component is still mounted before updating state
        if (!isMountedRef.current) return;
        
        if (doc.exists()) {
          const data = doc.data();
          setResumeData({
            url: data.url || '',
            filename: data.filename || '',
            uploadedAt: data.uploadedAt?.toDate() || new Date(),
            fileSize: data.fileSize || 0,
            fileType: data.fileType || ''
          });
          console.log('📄 Resume data loaded from Firestore');
        } else {
          setResumeData(null);
          console.log('📄 No resume document found');
        }
        
        if (isMountedRef.current) {
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error processing resume snapshot:', error);
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    }, (error) => {
      // QUOTA EXHAUSTED ERROR HANDLING
      console.error('❌ Firestore resume snapshot error:', error);
      if (error.code === 'resource-exhausted') {
        console.error('🚨 QUOTA EXCEEDED in resume listener: Consider upgrading Firebase plan');
        if (isMountedRef.current) {
          toast({
            variant: "destructive",
            title: "Service Temporarily Unavailable",
            description: "Resume service quota exceeded. Please try again later.",
            className: "border-red-500 bg-red-950 text-white",
          });
        }
        // TODO: Implement exponential backoff retry logic
        // TODO: Consider upgrading to Firebase Blaze plan for higher quotas
      }
      if (isMountedRef.current) {
        setLoading(false);
      }
    });

    // Cleanup function to prevent memory leaks
    return () => {
      isMountedRef.current = false;
      unsubscribe();
      console.log('🧹 Resume listener cleaned up');
    };
  }, []); // Empty dependency array to prevent re-initialization

  const validateResumeFile = (file: File): boolean => {
    try {
      // Check file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a PDF, DOC, or DOCX file.",
          className: "border-red-500 bg-red-950 text-white",
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
          className: "border-red-500 bg-red-950 text-white",
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Error validating resume file:', error);
      return false;
    }
  };

  const uploadResume = async (file: File): Promise<string> => {
    if (!validateResumeFile(file) || !isMountedRef.current) {
      throw new Error('Invalid file');
    }

    // Prevent duplicate operations if already uploading
    if (uploading) {
      console.warn('⚠️ Resume upload already in progress');
      return '';
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // QUOTA OPTIMIZATION: Only delete existing resume if we have a different file
      // This prevents unnecessary read/write operations
      if (resumeData && resumeData.filename !== file.name) {
        await deleteResume(false);
      }

      // Create a unique filename with timestamp
      const timestamp = Date.now();
      const extension = file.name.split('.').pop();
      const filename = `resume-${timestamp}.${extension}`;

      // Upload to Firebase Storage with progress simulation
      const storageRef = ref(storage, `resumes/${filename}`);
      
      const uploadTask = uploadBytes(storageRef, file);
      
      // Simulate progress for better UX (Firebase Storage doesn't provide real-time progress)
      const progressInterval = setInterval(() => {
        if (isMountedRef.current) {
          setUploadProgress(prev => {
            if (prev === undefined) return 20;
            if (prev >= 90) return prev;
            return prev + Math.random() * 15;
          });
        }
      }, 200);

      try {
        const snapshot = await uploadTask;
        clearInterval(progressInterval);
        
        if (!isMountedRef.current) return '';
        
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

        // QUOTA OPTIMIZATION: Only write to Firestore if data has actually changed
        const hasChanged = !resumeData || 
          resumeData.filename !== file.name || 
          resumeData.fileSize !== file.size ||
          resumeData.url !== downloadURL;

        if (hasChanged && isMountedRef.current) {
          try {
            // Save to Firestore for real-time sync
            await setDoc(doc(db, "settings", "resume"), newResumeData);
            console.log('💾 Resume data saved to Firestore');
          } catch (firestoreError: any) {
            console.error('❌ Firestore write error during resume upload:', firestoreError);
            if (firestoreError.code === 'resource-exhausted') {
              console.error('🚨 QUOTA EXCEEDED on resume write operation');
              // TODO: Implement write operation queuing for retry
              // TODO: Consider upgrading Firebase plan if this persists
              throw new Error('Database quota exceeded. Please try again later.');
            }
            throw firestoreError;
          }
        }

        if (isMountedRef.current) {
          toast({
            title: "Success!",
            description: "Resume uploaded successfully and is now available for download",
            duration: 4000,
            className: "border-green-500 bg-green-950 text-white",
          });
        }

        return downloadURL;
      } catch (error) {
        clearInterval(progressInterval);
        throw error;
      }
    } catch (error) {
      console.error("❌ Error uploading resume:", error);
      if (isMountedRef.current) {
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: error instanceof Error ? error.message : "Failed to upload resume. Please try again.",
          className: "border-red-500 bg-red-950 text-white",
        });
      }
      throw error;
    } finally {
      if (isMountedRef.current) {
        setUploading(false);
        setUploadProgress(undefined);
      }
    }
  };

  const deleteResume = async (showToast = true): Promise<void> => {
    if (!resumeData || !isMountedRef.current) return;

    try {
      // Delete from Firebase Storage
      const storageRef = ref(storage, `resumes/${resumeData.filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`);
      try {
        await deleteObject(storageRef);
        console.log('🗑️ Resume deleted from Firebase Storage');
      } catch (storageError) {
        console.warn('⚠️ Could not delete resume from storage (may not exist):', storageError);
      }

      // QUOTA OPTIMIZATION: Only attempt Firestore deletion if we have resume data
      try {
        await deleteDoc(doc(db, "settings", "resume"));
        console.log('💾 Resume document deleted from Firestore');
      } catch (firestoreError: any) {
        console.error('❌ Firestore delete error:', firestoreError);
        if (firestoreError.code === 'resource-exhausted') {
          console.error('🚨 QUOTA EXCEEDED on resume delete operation');
          throw new Error('Database quota exceeded. Please try again later.');
        }
        throw firestoreError;
      }

      if (showToast && isMountedRef.current) {
        toast({
          title: "Success",
          description: "Resume deleted successfully",
          className: "border-green-500 bg-green-950 text-white",
        });
      }
    } catch (error) {
      console.error("❌ Error deleting resume:", error);
      if (showToast && isMountedRef.current) {
        toast({
          variant: "destructive",
          title: "Delete Failed",
          description: error instanceof Error ? error.message : "Failed to delete resume. Please try again.",
          className: "border-red-500 bg-red-950 text-white",
        });
      }
      throw error;
    }
  };

  const downloadResume = (): void => {
    try {
      if (!resumeData?.url) {
        toast({
          variant: "destructive",
          title: "No Resume Available",
          description: "No resume has been uploaded yet.",
          className: "border-red-500 bg-red-950 text-white",
        });
        return;
      }

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
        className: "border-green-500 bg-green-950 text-white",
      });
    } catch (error) {
      console.error('❌ Error downloading resume:', error);
      toast({
        variant: "destructive",
        title: "Download Error",
        description: "Failed to download resume. Please try again.",
        className: "border-red-500 bg-red-950 text-white",
      });
    }
  };

  const viewResume = (): void => {
    try {
      if (!resumeData?.url) {
        toast({
          variant: "destructive",
          title: "No Resume Available",
          description: "No resume has been uploaded yet.",
          className: "border-red-500 bg-red-950 text-white",
        });
        return;
      }

      window.open(resumeData.url, '_blank', 'noopener,noreferrer');
      
      toast({
        title: "Resume Opened",
        description: "Resume opened in a new tab!",
        duration: 3000,
        className: "border-green-500 bg-green-950 text-white",
      });
    } catch (error) {
      console.error('❌ Error viewing resume:', error);
      toast({
        variant: "destructive",
        title: "View Error",
        description: "Failed to open resume. Please try again.",
        className: "border-red-500 bg-red-950 text-white",
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
