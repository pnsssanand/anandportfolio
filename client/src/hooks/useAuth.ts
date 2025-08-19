import { useState, useEffect } from "react";
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth, ADMIN_EMAIL } from "@/lib/firebase";
import { useToast } from "./use-toast";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener - this is optimized and only runs once per auth change
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      try {
        setUser(user);
        // Check if the logged-in user email matches the admin email from environment
        setIsAdmin(user?.email === ADMIN_EMAIL);
        setLoading(false);
        
        // Debug logging for admin email verification
        if (user) {
          console.log(`🔐 User logged in: ${user.email}`);
          console.log(`👑 Admin email expected: ${ADMIN_EMAIL}`);
          console.log(`✅ Is admin: ${user.email === ADMIN_EMAIL}`);
        }
      } catch (error) {
        console.error("❌ Error in auth state change:", error);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // WHY LOGIN FAILS AFTER EMAIL CHANGE:
      // The code was updated to use "pnsssanand@gmail.com" but Firebase Auth
      // still only has "anandpinisetty@gmail.com" registered as a user.
      // The ADMIN_EMAIL constant comes from env variable VITE_ADMIN_EMAIL
      
      console.log(`🔑 Attempting login with: ${email}`);
      console.log(`👑 Expected admin email: ${ADMIN_EMAIL}`);
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Verify the logged-in user is the authorized admin
      if (result.user.email !== ADMIN_EMAIL) {
        console.log(`❌ Login rejected: ${result.user.email} is not authorized admin`);
        await signOut(auth);
        throw new Error(`Unauthorized access. Expected admin: ${ADMIN_EMAIL}, got: ${result.user.email}`);
      }
      
      console.log(`✅ Admin login successful: ${result.user.email}`);
      
      toast({
        title: "Success",
        description: `Successfully logged in as admin: ${result.user.email}`,
        className: "border-green-500 bg-green-950 text-white",
      });
      
      return result.user;
    } catch (error: any) {
      console.error("❌ Login error details:", {
        code: error.code,
        message: error.message,
        email: email,
        expectedAdmin: ADMIN_EMAIL
      });
      
      // User-friendly error messages
      let userMessage = "Invalid credentials";
      if (error.code === 'auth/user-not-found') {
        userMessage = `No account found for ${email}. Please check the email or create an account in Firebase Console.`;
      } else if (error.code === 'auth/wrong-password') {
        userMessage = "Incorrect password. Please try again.";
      } else if (error.code === 'auth/invalid-email') {
        userMessage = "Invalid email format.";
      } else if (error.code === 'auth/too-many-requests') {
        userMessage = "Too many failed attempts. Please try again later.";
      } else if (error.message.includes('Unauthorized access')) {
        userMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: userMessage,
        className: "border-red-500 bg-red-950 text-white",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      console.log("👋 User logged out successfully");
      
      toast({
        title: "Logged Out",
        description: "Successfully logged out",
        className: "border-blue-500 bg-blue-950 text-white",
      });
    } catch (error: any) {
      console.error("❌ Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: error.message || "Failed to logout",
        className: "border-red-500 bg-red-950 text-white",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to create admin user (for development/setup)
  const createAdminUser = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log(`🔧 Creating admin user: ${email}`);
      
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      toast({
        title: "Admin User Created",
        description: `Successfully created admin account: ${email}`,
        className: "border-green-500 bg-green-950 text-white",
      });
      
      console.log(`✅ Admin user created: ${result.user.email}`);
      return result.user;
    } catch (error: any) {
      console.error("❌ Error creating admin user:", error);
      
      let userMessage = "Failed to create admin user";
      if (error.code === 'auth/email-already-in-use') {
        userMessage = `Account already exists for ${email}`;
      } else if (error.code === 'auth/weak-password') {
        userMessage = "Password is too weak. Use at least 6 characters.";
      } else if (error.code === 'auth/invalid-email') {
        userMessage = "Invalid email format.";
      }
      
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: userMessage,
        className: "border-red-500 bg-red-950 text-white",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isAdmin,
    loading,
    login,
    logout,
    createAdminUser, // Exposed for development/setup purposes
    adminEmail: ADMIN_EMAIL // Expose current admin email for debugging
  };
}
