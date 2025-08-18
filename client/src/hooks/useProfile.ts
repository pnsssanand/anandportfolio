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

    // Set up real-time listener
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

  const uploadProfileImage = async (file: File): Promise<string> => {
    setUploading(true);
    
    try {
      // Create a reference to the profile image in Firebase Storage
      const imageRef = ref(storage, `profile/profile-image-${Date.now()}`);
      
      // Upload the file
      const snapshot = await uploadBytes(imageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Update the profile document in Firestore
      const profileRef = doc(db, 'profile', 'main');
      await setDoc(profileRef, {
        profileImageUrl: downloadURL,
        lastUpdated: new Date()
      }, { merge: true });
      
      toast({
        title: 'Success',
        description: 'Profile image updated successfully'
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
    }
  };

  const removeProfileImage = async () => {
    try {
      setUploading(true);
      
      // If there's an existing image, delete it from storage
      if (profile.profileImageUrl) {
        try {
          const imageRef = ref(storage, profile.profileImageUrl);
          await deleteObject(imageRef);
        } catch (error) {
          // Image might already be deleted or not exist, continue anyway
          console.warn('Error deleting old image:', error);
        }
      }
      
      // Update the profile document
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
    uploadProfileImage,
    removeProfileImage
  };
}
