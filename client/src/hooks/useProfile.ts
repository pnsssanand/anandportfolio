import { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export interface ProfileData {
  profileImageUrl: string;
  lastUpdated: Date;
}

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData>({
    profileImageUrl: '',
    lastUpdated: new Date()
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>();
  const { toast } = useToast();
  
  // Ref to track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);
  // Ref to track initialization to prevent duplicate writes
  const isInitializedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    const profileRef = doc(db, 'profile', 'main');
    
    // QUOTA OPTIMIZATION: Use single onSnapshot listener with proper cleanup
    // This prevents multiple listeners and reduces read operations
    const unsubscribe = onSnapshot(profileRef, async (doc) => {
      try {
        // Check if component is still mounted before updating state
        if (!isMountedRef.current) return;
        
        if (doc.exists()) {
          const data = doc.data();
          setProfile({
            profileImageUrl: data.profileImageUrl || '',
            lastUpdated: data.lastUpdated?.toDate() || new Date()
          });
          isInitializedRef.current = true;
          console.log('📄 Profile data loaded from Firestore');
        } else if (!isInitializedRef.current) {
          // QUOTA OPTIMIZATION: Only initialize document if it doesn't exist AND we haven't initialized yet
          // This prevents infinite initialization loops that cause quota exhaustion
          try {
            console.log('🔧 Initializing profile document (one-time operation)');
            const initialData = {
              profileImageUrl: '',
              lastUpdated: new Date()
            };
            await setDoc(profileRef, initialData);
            isInitializedRef.current = true;
            console.log('✅ Profile document initialized');
          } catch (error) {
            console.error('❌ Error initializing profile:', error);
            // Don't throw error to prevent breaking the app
          }
        }
        
        if (isMountedRef.current) {
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error in profile snapshot listener:', error);
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    }, (error) => {
      // QUOTA EXHAUSTED ERROR HANDLING
      console.error('❌ Firestore snapshot error:', error);
      if (error.code === 'resource-exhausted') {
        console.error('🚨 QUOTA EXCEEDED: Consider upgrading Firebase plan or optimizing reads');
        toast({
          variant: "destructive",
          title: "Service Temporarily Unavailable", 
          description: "Database quota exceeded. Please try again later.",
          className: "border-red-500 bg-red-950 text-white",
        });
        // TODO: Implement exponential backoff retry logic
        // TODO: Consider upgrading to Firebase Blaze plan for higher quotas
      }
      if (isMountedRef.current) {
        setLoading(false);
      }
    });

    // Cleanup function to prevent memory leaks and stop listeners
    return () => {
      isMountedRef.current = false;
      unsubscribe();
      console.log('🧹 Profile listener cleaned up');
    };
  }, []); // Empty dependency array to prevent re-initialization

  // Cloudinary upload configuration using environment variables
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'portfolio/profile_images');
    formData.append('transformation', 'c_fill,w_400,h_400,q_auto');
    
    try {
      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && isMountedRef.current) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percentComplete);
          }
        });
        
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve(response.secure_url);
          } else {
            reject(new Error(`Upload failed: ${xhr.statusText}`));
          }
        });
        
        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'));
        });
        
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
        xhr.send(formData);
      });
    } catch (error) {
      console.error('❌ Cloudinary upload error:', error);
      throw error;
    }
  };

  const uploadProfileImage = async (file: File): Promise<string> => {
    if (!isMountedRef.current) return '';
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Validate file before processing to prevent unnecessary operations
      if (!file || file.size === 0) {
        throw new Error('Invalid file selected');
      }

      // Prevent duplicate operations if already uploading
      if (uploading) {
        console.warn('⚠️ Upload already in progress, skipping duplicate request');
        return '';
      }

      // Delete existing image from storage if it exists
      if (profile.profileImageUrl) {
        try {
          const existingImageRef = ref(storage, `profile/${profile.profileImageUrl.split('/').pop()}`);
          await deleteObject(existingImageRef);
          console.log('🗑️ Deleted old profile image');
        } catch (error) {
          console.warn('⚠️ Could not delete old image (may not exist):', error);
        }
      }

      let downloadURL: string;

      try {
        // Try Cloudinary upload first for better performance
        downloadURL = await uploadToCloudinary(file);
        console.log('☁️ Image uploaded to Cloudinary successfully');
      } catch (cloudinaryError) {
        console.warn('⚠️ Cloudinary upload failed, falling back to Firebase Storage:', cloudinaryError);
        
        if (!isMountedRef.current) return '';
        
        // Fallback to Firebase Storage
        setUploadProgress(50);
        const imageRef = ref(storage, `profile/profile-image-${Date.now()}`);
        const snapshot = await uploadBytes(imageRef, file);
        downloadURL = await getDownloadURL(snapshot.ref);
        setUploadProgress(100);
        console.log('🔥 Image uploaded to Firebase Storage');
      }
      
      // QUOTA OPTIMIZATION: Only update Firestore if URL actually changed
      if (downloadURL !== profile.profileImageUrl && isMountedRef.current) {
        try {
          const profileRef = doc(db, 'profile', 'main');
          await setDoc(profileRef, {
            profileImageUrl: downloadURL,
            lastUpdated: new Date()
          }, { merge: true }); // Use merge to prevent overwriting other fields
          
          console.log('💾 Profile image URL saved to Firestore');
        } catch (firestoreError: any) {
          console.error('❌ Firestore write error:', firestoreError);
          if (firestoreError.code === 'resource-exhausted') {
            console.error('🚨 QUOTA EXCEEDED on write operation');
            // TODO: Implement write operation queuing for retry
            // TODO: Consider upgrading Firebase plan if this persists
            throw new Error('Database quota exceeded. Please try again later.');
          }
          throw firestoreError;
        }
      }
      
      if (isMountedRef.current) {
        toast({
          title: 'Success!',
          description: 'Profile image uploaded and synced successfully',
          className: "border-green-500 bg-green-950 text-white",
        });
      }
      
      return downloadURL;
    } catch (error) {
      console.error('❌ Error uploading profile image:', error);
      if (isMountedRef.current) {
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: error instanceof Error ? error.message : 'Failed to upload profile image. Please try again.',
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

  const removeProfileImage = async () => {
    if (!isMountedRef.current) return;
    
    try {
      setUploading(true);
      
      if (profile.profileImageUrl) {
        try {
          if (profile.profileImageUrl.includes('cloudinary.com')) {
            console.log('☁️ Cloudinary image will be managed by auto-cleanup');
          } else {
            const imageRef = ref(storage, profile.profileImageUrl);
            await deleteObject(imageRef);
            console.log('🗑️ Image deleted from Firebase Storage');
          }
        } catch (error) {
          console.warn('⚠️ Could not delete image from storage:', error);
        }
      }
      
      // QUOTA OPTIMIZATION: Only write if we actually had an image to remove
      if (profile.profileImageUrl && isMountedRef.current) {
        try {
          const profileRef = doc(db, 'profile', 'main');
          await setDoc(profileRef, {
            profileImageUrl: '',
            lastUpdated: new Date()
          }, { merge: true });
          console.log('💾 Profile image URL removed from Firestore');
        } catch (firestoreError: any) {
          console.error('❌ Firestore write error during removal:', firestoreError);
          if (firestoreError.code === 'resource-exhausted') {
            throw new Error('Database quota exceeded. Please try again later.');
          }
          throw firestoreError;
        }
      }
      
      if (isMountedRef.current) {
        toast({
          title: 'Success',
          description: 'Profile image removed successfully',
          className: "border-green-500 bg-green-950 text-white",
        });
      }
    } catch (error) {
      console.error('❌ Error removing profile image:', error);
      if (isMountedRef.current) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to remove profile image',
          className: "border-red-500 bg-red-950 text-white",
        });
      }
    } finally {
      if (isMountedRef.current) {
        setUploading(false);
      }
    }
  };

  return {
    profile,
    loading,
    uploading,
    uploadProgress,
    uploadProfileImage,
    removeProfileImage
  };
}
