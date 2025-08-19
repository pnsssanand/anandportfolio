/**
 * FIREBASE ADMIN SETUP HELPER
 * 
 * This file provides utilities to create admin users in Firebase Authentication.
 * 
 * CURRENT ISSUE:
 * - Code was updated to use "pnsssanand@gmail.com" as admin email
 * - But Firebase Auth still only has "anandpinisetty@gmail.com" registered
 * - This causes login failures with "user-not-found" error
 * 
 * SOLUTIONS:
 * 1. Create new admin user with "pnsssanand@gmail.com" (recommended)
 * 2. OR revert VITE_ADMIN_EMAIL back to "anandpinisetty@gmail.com"
 */

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

/**
 * Helper function to create admin user programmatically
 * 
 * @param email - Admin email address
 * @param password - Admin password (minimum 6 characters)
 * @returns Promise<User> - The created user object
 */
export async function createAdminUser(email: string, password: string) {
  try {
    console.log(`🔧 Creating admin user: ${email}`);
    
    // Validate inputs
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log(`✅ Admin user created successfully: ${user.email}`);
    console.log(`🆔 User UID: ${user.uid}`);
    
    return user;
  } catch (error: any) {
    console.error('❌ Error creating admin user:', error);
    
    // Provide user-friendly error messages
    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new Error(`Account already exists for ${email}. You can log in with this email.`);
      case 'auth/invalid-email':
        throw new Error('Invalid email format provided.');
      case 'auth/weak-password':
        throw new Error('Password is too weak. Use at least 6 characters with numbers and letters.');
      case 'auth/operation-not-allowed':
        throw new Error('Email/password authentication is not enabled in Firebase Console.');
      default:
        throw new Error(`Failed to create admin user: ${error.message}`);
    }
  }
}

/**
 * MANUAL SETUP INSTRUCTIONS FOR FIREBASE CONSOLE:
 * 
 * If you prefer to create the admin user manually:
 * 
 * 1. Go to Firebase Console: https://console.firebase.google.com
 * 2. Select your project: "anand-portfolio-f1667"
 * 3. Navigate to "Authentication" in the left sidebar
 * 4. Click on the "Users" tab
 * 5. Click "Add user" button
 * 6. Enter email: pnsssanand@gmail.com (or your preferred admin email)
 * 7. Enter a secure password (minimum 6 characters)
 * 8. Click "Add user"
 * 9. Update your .env.local file:
 *    VITE_ADMIN_EMAIL=pnsssanand@gmail.com
 * 10. Restart your development server
 * 
 * ALTERNATIVE: Keep existing user
 * If you want to keep using the existing "anandpinisetty@gmail.com" account:
 * 1. Update .env.local file:
 *    VITE_ADMIN_EMAIL=anandpinisetty@gmail.com
 * 2. Restart your development server
 */

/**
 * Quick setup function to create the preferred admin user
 * Call this from browser console or a setup script
 */
export async function quickAdminSetup() {
  try {
    console.log('🚀 Starting quick admin setup...');
    
    // CHANGE THESE CREDENTIALS TO YOUR PREFERRED VALUES
    const adminEmail = 'pnsssanand@gmail.com';
    const adminPassword = 'SecureAdminPassword123!'; // CHANGE THIS PASSWORD!
    
    console.log('⚠️  WARNING: Change the default password in this function before running!');
    console.log(`📧 Admin email: ${adminEmail}`);
    
    // Create the admin user
    const user = await createAdminUser(adminEmail, adminPassword);
    
    console.log('✅ Quick admin setup completed!');
    console.log('📝 Next steps:');
    console.log('   1. Update .env.local with VITE_ADMIN_EMAIL=' + adminEmail);
    console.log('   2. Restart your development server');
    console.log('   3. Log in with the new credentials');
    
    return user;
  } catch (error) {
    console.error('❌ Quick admin setup failed:', error);
    console.log('💡 Try manual setup using Firebase Console instead');
    throw error;
  }
}

/**
 * Verify admin email configuration
 * Call this to debug login issues
 */
export function debugAdminConfig() {
  const currentAdminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const fallbackEmail = 'pnsssanand@gmail.com'; // From firebase.ts
  
  console.log('🔍 Admin Configuration Debug:');
  console.log('   Environment variable VITE_ADMIN_EMAIL:', currentAdminEmail);
  console.log('   Fallback email from firebase.ts:', fallbackEmail);
  console.log('   Effective admin email:', currentAdminEmail || fallbackEmail);
  
  if (!currentAdminEmail) {
    console.warn('⚠️  VITE_ADMIN_EMAIL not set in .env.local file');
    console.log('💡 Add this line to .env.local:');
    console.log('   VITE_ADMIN_EMAIL=your-admin@email.com');
  }
  
  console.log('🧪 To test login, use credentials for:', currentAdminEmail || fallbackEmail);
}

/**
 * Usage Examples:
 * 
 * // In browser console:
 * import('./lib/adminSetup').then(({ quickAdminSetup }) => quickAdminSetup());
 * 
 * // Debug configuration:
 * import('./lib/adminSetup').then(({ debugAdminConfig }) => debugAdminConfig());
 * 
 * // Create specific user:
 * import('./lib/adminSetup').then(({ createAdminUser }) => {
 *   createAdminUser('your-email@domain.com', 'your-password');
 * });
 */
