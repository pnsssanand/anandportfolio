import { useState, useEffect } from "react";
import { adminLogin, LoginResponse } from "@/lib/adminAuth";
import { useToast } from "./use-toast";

/**
 * Interface for user state
 */
interface AdminUser {
  email: string;
  role: string;
  isAuthenticated: boolean;
}

/**
 * Quota-optimized useAuth hook for admin authentication
 * This version uses Firestore queries instead of Firebase Auth to reduce quota usage
 */
export function useAuthOptimized() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  // Check for existing session in localStorage (persist login state)
  useEffect(() => {
    const savedUser = localStorage.getItem('admin_user');
    const loginTimestamp = localStorage.getItem('admin_login_time');
    
    if (savedUser && loginTimestamp) {
      const loginTime = parseInt(loginTimestamp);
      const currentTime = Date.now();
      const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      // Check if session is still valid
      if (currentTime - loginTime < sessionDuration) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAdmin(true);
        console.log('🔄 Restored admin session from localStorage');
      } else {
        // Session expired, clear localStorage
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_login_time');
        console.log('⏰ Admin session expired, cleared localStorage');
      }
    }
  }, []);

  /**
   * Quota-friendly login function using Firestore
   * @param email Admin email
   * @param password Admin password
   * @returns Promise with login result
   */
  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      setLoading(true);
      
      console.log('🔐 Starting quota-optimized admin login...');
      
      // Use the quota-friendly adminLogin function
      const result = await adminLogin(email, password);
      
      if (result.success && result.user) {
        // Set user state
        const userData: AdminUser = {
          email: result.user.email,
          role: result.user.role,
          isAuthenticated: true
        };
        
        setUser(userData);
        setIsAdmin(true);
        
        // Persist session in localStorage (avoid repeated Firestore queries)
        localStorage.setItem('admin_user', JSON.stringify(userData));
        localStorage.setItem('admin_login_time', Date.now().toString());
        
        toast({
          title: "Login Successful",
          description: result.message,
          className: "border-green-500 bg-green-950 text-white",
        });
        
        console.log('✅ Admin login successful, session saved');
      } else {
        // Login failed
        setUser(null);
        setIsAdmin(false);
        
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: result.message,
          className: "border-red-500 bg-red-950 text-white",
        });
        
        console.log('❌ Admin login failed:', result.error);
      }
      
      return result;
      
    } catch (error) {
      console.error('🚫 Unexpected error during login:', error);
      
      setUser(null);
      setIsAdmin(false);
      
      const errorResult: LoginResponse = {
        success: false,
        message: "An unexpected error occurred during login",
        error: {
          code: "unexpected-error",
          message: error instanceof Error ? error.message : "Unknown error"
        }
      };
      
      toast({
        variant: "destructive",
        title: "Login Error",
        description: errorResult.message,
        className: "border-red-500 bg-red-950 text-white",
      });
      
      return errorResult;
      
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout function that clears local state and storage
   */
  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Clear user state
      setUser(null);
      setIsAdmin(false);
      
      // Clear localStorage
      localStorage.removeItem('admin_user');
      localStorage.removeItem('admin_login_time');
      
      toast({
        title: "Logged Out",
        description: "Successfully logged out from admin panel",
        className: "border-blue-500 bg-blue-950 text-white",
      });
      
      console.log('👋 Admin logout successful');
      
    } catch (error) {
      console.error('❌ Error during logout:', error);
      
      toast({
        variant: "destructive",
        title: "Logout Error",
        description: "There was an issue logging out",
        className: "border-red-500 bg-red-950 text-white",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if current session is still valid
   */
  const validateSession = (): boolean => {
    const loginTimestamp = localStorage.getItem('admin_login_time');
    
    if (!loginTimestamp || !user) {
      return false;
    }
    
    const loginTime = parseInt(loginTimestamp);
    const currentTime = Date.now();
    const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
    
    const isValid = currentTime - loginTime < sessionDuration;
    
    if (!isValid) {
      // Auto-logout if session expired
      logout();
    }
    
    return isValid;
  };

  /**
   * Get session remaining time in minutes
   */
  const getSessionRemainingTime = (): number => {
    const loginTimestamp = localStorage.getItem('admin_login_time');
    
    if (!loginTimestamp) {
      return 0;
    }
    
    const loginTime = parseInt(loginTimestamp);
    const currentTime = Date.now();
    const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
    const elapsed = currentTime - loginTime;
    const remaining = sessionDuration - elapsed;
    
    return Math.max(0, Math.floor(remaining / (60 * 1000))); // Return minutes
  };

  return {
    user,
    isAdmin,
    loading,
    login,
    logout,
    validateSession,
    getSessionRemainingTime,
    // Legacy compatibility (if you want to keep the same interface)
    isAuthenticated: isAdmin
  };
}

/**
 * Example usage in AdminLogin component:
 * 
 * const { login, loading, isAdmin } = useAuthOptimized();
 * 
 * const handleSubmit = async (e: React.FormEvent) => {
 *   e.preventDefault();
 *   
 *   const result = await login(email, password);
 *   
 *   if (result.success) {
 *     onSuccess(); // Redirect or update UI
 *     onClose();   // Close login modal
 *   }
 *   // Error handling is already done in the hook via toast
 * };
 */
