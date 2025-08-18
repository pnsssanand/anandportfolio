import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const profileRef = doc(db, 'profile', 'main');
    
    // Initialize profile document if it doesn't exist
    const initializeProfile = async () => {
      try {
        const profileDoc = await getDoc(profileRef);
        if (!profileDoc.exists()) {
          const initialData = {
            profileImageUrl: '',
            lastUpdated: new Date()
          };
          await setDoc(profileRef, initialData);
        }
      } catch (error) {
        console.error('Error initializing profile:', error);
      }
    };

    initializeProfile();

    // Set up real-time listener for live updates
    const unsubscribe = onSnapshot(profileRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setProfile({
          profileImageUrl: data.profileImageUrl || '',
          lastUpdated: data.lastUpdated?.toDate() || new Date()
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Cloudinary upload configuration using environment variables
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo'; // Fallback to demo for testing
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default'; // Default preset
    
    // Create FormData for Cloudinary upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'portfolio/profile_images'); // Organize uploads in folders
    formData.append('transformation', 'c_fill,w_400,h_400,q_auto'); // Auto optimization
    
    try {
      // Upload to Cloudinary with progress tracking
      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
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
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  const uploadProfileImage = async (file: File): Promise<string> => {
    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Delete existing image from storage if it exists
      if (profile.profileImageUrl) {
        try {
          // Extract filename from URL for deletion
          const existingImageRef = ref(storage, `profile/${profile.profileImageUrl.split('/').pop()}`);
          await deleteObject(existingImageRef);
        } catch (error) {
          // Continue if deletion fails (image might not exist)
          console.warn('Error deleting old image:', error);
        }
      }

      let downloadURL: string;

      // Try Cloudinary upload first, fallback to Firebase Storage
      try {
        // Upload to Cloudinary for better performance and CDN
        downloadURL = await uploadToCloudinary(file);
        console.log('Image uploaded to Cloudinary successfully');
      } catch (cloudinaryError) {
        console.warn('Cloudinary upload failed, falling back to Firebase Storage:', cloudinaryError);
        
        // Fallback to Firebase Storage
        setUploadProgress(50); // Reset progress for Firebase upload
        const imageRef = ref(storage, `profile/profile-image-${Date.now()}`);
        const snapshot = await uploadBytes(imageRef, file);
        downloadURL = await getDownloadURL(snapshot.ref);
        setUploadProgress(100);
      }
      
      // Store the image URL in Firestore for real-time sync
      const profileRef = doc(db, 'profile', 'main');
      await setDoc(profileRef, {
        profileImageUrl: downloadURL,
        lastUpdated: new Date()
      }, { merge: true });
      
      toast({
        title: 'Success!',
        description: 'Profile image uploaded and synced successfully'
      });
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'Failed to upload profile image. Please try again.'
      });
      throw error;
    } finally {
      setUploading(false);
      setUploadProgress(undefined);
    }
  };

  const removeProfileImage = async () => {
    try {
      setUploading(true);
      
      // If there's an existing image, delete it from storage
      if (profile.profileImageUrl) {
        try {
          // Handle both Cloudinary and Firebase Storage URLs
          if (profile.profileImageUrl.includes('cloudinary.com')) {
            // For Cloudinary, we don't need to manually delete as it has auto-cleanup features
            console.log('Cloudinary image will be managed by their auto-cleanup');
          } else {
            // For Firebase Storage
            const imageRef = ref(storage, profile.profileImageUrl);
            await deleteObject(imageRef);
          }
        } catch (error) {
          // Image might already be deleted or not exist, continue anyway
          console.warn('Error deleting old image:', error);
        }
      }
      
      // Update the profile document to remove image URL
      const profileRef = doc(db, 'profile', 'main');
      await setDoc(profileRef, {
        profileImageUrl: '',
        lastUpdated: new Date()
      }, { merge: true });
      
      toast({
        title: 'Success',
        description: 'Profile image removed successfully'
      });
    } catch (error) {
      console.error('Error removing profile image:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to remove profile image'
      });
    } finally {
      setUploading(false);
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
