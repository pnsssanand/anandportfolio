import { doc, getDoc, query, collection, where, limit, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { FirebaseError } from 'firebase/app';

/**
 * Interface for the admin document structure in Firestore
 */
interface AdminDocument {
  email: string;
  password: string;
  role?: string;
  active?: boolean;
  lastLogin?: Date;
}

/**
 * Response interface for the login function
 */
export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    email: string;
    role: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Quota-friendly admin login function using Firestore
 * 
 * This function:
 * - Uses a single get() request instead of real-time listeners
 * - Optimizes the query to search for a specific document
 * - Includes comprehensive error handling for Firebase errors
 * - Returns detailed success/failure status
 * 
 * @param email - Admin email address
 * @param password - Admin password (plain text in this example)
 * @returns Promise<LoginResponse> - Contains success status, message, and user data
 */
export async function adminLogin(email: string, password: string): Promise<LoginResponse> {
  try {
    // Input validation
    if (!email || !password) {
      return {
        success: false,
        message: 'Email and password are required',
        error: {
          code: 'invalid-input',
          message: 'Missing required credentials'
        }
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: 'Invalid email format',
        error: {
          code: 'invalid-email',
          message: 'Please provide a valid email address'
        }
      };
    }

    console.log(`🔍 Attempting admin login for email: ${email}`);

    // Method 1: Query by email field (most efficient for multiple admins)
    // This approach is better when you have multiple admin documents
    const adminsRef = collection(db, 'admins');
    const emailQuery = query(
      adminsRef,
      where('email', '==', email.toLowerCase()), // Case-insensitive search
      limit(1) // Optimize: only get the first match
    );

    console.log('📄 Executing Firestore query for admin authentication...');
    
    // Single read operation - quota-friendly
    const querySnapshot = await getDocs(emailQuery);
    
    if (querySnapshot.empty) {
      console.log('❌ No admin found with provided email');
      return {
        success: false,
        message: 'Invalid credentials',
        error: {
          code: 'admin-not-found',
          message: 'No admin account found with this email'
        }
      };
    }

    // Get the admin document
    const adminDoc = querySnapshot.docs[0];
    const adminData = adminDoc.data() as AdminDocument;

    console.log('✅ Admin document retrieved successfully');

    // Verify the password
    if (adminData.password !== password) {
      console.log('❌ Password verification failed');
      return {
        success: false,
        message: 'Invalid credentials',
        error: {
          code: 'invalid-password',
          message: 'Incorrect password provided'
        }
      };
    }

    // Check if admin account is active (optional security check)
    if (adminData.active === false) {
      console.log('❌ Admin account is deactivated');
      return {
        success: false,
        message: 'Account is deactivated',
        error: {
          code: 'account-disabled',
          message: 'This admin account has been deactivated'
        }
      };
    }

    console.log('🎉 Admin login successful');

    // Optional: Update last login timestamp (this would be an additional write operation)
    // Only uncomment if you need to track login times and can spare the quota
    /*
    try {
      await updateDoc(adminDoc.ref, {
        lastLogin: new Date()
      });
      console.log('📝 Last login timestamp updated');
    } catch (updateError) {
      console.warn('⚠️ Failed to update last login timestamp:', updateError);
      // Don't fail the login if timestamp update fails
    }
    */

    return {
      success: true,
      message: 'Login successful',
      user: {
        email: adminData.email,
        role: adminData.role || 'admin'
      }
    };

  } catch (error) {
    // Comprehensive Firebase error handling
    if (error instanceof FirebaseError) {
      console.error('🔥 Firebase Error during admin login:', {
        code: error.code,
        message: error.message,
        details: error
      });

      // Handle specific Firebase error codes
      switch (error.code) {
        case 'permission-denied':
          return {
            success: false,
            message: 'Access denied. Please check your permissions.',
            error: {
              code: error.code,
              message: 'Insufficient permissions to access admin data'
            }
          };
          
        case 'unavailable':
          return {
            success: false,
            message: 'Service temporarily unavailable. Please try again.',
            error: {
              code: error.code,
              message: 'Firestore service is currently unavailable'
            }
          };
          
        case 'resource-exhausted':
          return {
            success: false,
            message: 'Service temporarily overwhelmed. Please try again in a few minutes.',
            error: {
              code: error.code,
              message: 'Quota exceeded - too many requests'
            }
          };
          
        case 'deadline-exceeded':
          return {
            success: false,
            message: 'Request timed out. Please check your connection and try again.',
            error: {
              code: error.code,
              message: 'Request took too long to complete'
            }
          };
          
        default:
          return {
            success: false,
            message: 'Login failed due to a system error. Please try again.',
            error: {
              code: error.code,
              message: error.message
            }
          };
      }
    } else {
      // Handle non-Firebase errors
      console.error('❌ Unexpected error during admin login:', error);
      
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
        error: {
          code: 'unknown-error',
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        }
      };
    }
  }
}

/**
 * Alternative approach: Direct document access (if you know the document ID)
 * This is even more efficient when you have a predictable document structure
 * 
 * @param email - Admin email address
 * @param password - Admin password
 * @returns Promise<LoginResponse>
 */
export async function adminLoginById(email: string, password: string): Promise<LoginResponse> {
  try {
    // If you use email as document ID (sanitized), this is the most efficient approach
    const sanitizedEmail = email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
    const adminDocRef = doc(db, 'admins', sanitizedEmail);
    
    console.log(`🔍 Attempting direct document access for: ${sanitizedEmail}`);
    
    // Single document read - most quota-efficient
    const adminDoc = await getDoc(adminDocRef);
    
    if (!adminDoc.exists()) {
      console.log('❌ Admin document not found');
      return {
        success: false,
        message: 'Invalid credentials',
        error: {
          code: 'admin-not-found',
          message: 'No admin account found'
        }
      };
    }

    const adminData = adminDoc.data() as AdminDocument;

    // Verify email and password
    if (adminData.email !== email.toLowerCase() || adminData.password !== password) {
      console.log('❌ Credential verification failed');
      return {
        success: false,
        message: 'Invalid credentials',
        error: {
          code: 'invalid-credentials',
          message: 'Email or password is incorrect'
        }
      };
    }

    console.log('🎉 Direct admin login successful');

    return {
      success: true,
      message: 'Login successful',
      user: {
        email: adminData.email,
        role: adminData.role || 'admin'
      }
    };

  } catch (error) {
    // Same error handling as the main function
    if (error instanceof FirebaseError) {
      console.error('🔥 Firebase Error in direct login:', {
        code: error.code,
        message: error.message
      });
      
      return {
        success: false,
        message: 'Login failed due to a system error.',
        error: {
          code: error.code,
          message: error.message
        }
      };
    }

    console.error('❌ Unexpected error in direct login:', error);
    return {
      success: false,
      message: 'An unexpected error occurred.',
      error: {
        code: 'unknown-error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}

/**
 * Example usage in a React component:
 * 
 * const handleLogin = async () => {
 *   setLoading(true);
 *   
 *   try {
 *     const result = await adminLogin(email, password);
 *     
 *     if (result.success) {
 *       // Login successful
 *       console.log('Welcome,', result.user?.email);
 *       setIsLoggedIn(true);
 *       setUserData(result.user);
 *       
 *       toast({
 *         title: "Login Successful",
 *         description: result.message,
 *       });
 *     } else {
 *       // Login failed
 *       console.error('Login failed:', result.error);
 *       
 *       toast({
 *         variant: "destructive",
 *         title: "Login Failed",
 *         description: result.message,
 *       });
 *     }
 *   } catch (error) {
 *     console.error('Login error:', error);
 *     
 *     toast({
 *       variant: "destructive",
 *       title: "Login Error",
 *       description: "An unexpected error occurred during login.",
 *     });
 *   } finally {
 *     setLoading(false);
 *   }
 * };
 */
