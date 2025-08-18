import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Setup script to create the admin collection in Firestore
 * Run this once to set up your admin accounts
 */

interface AdminAccount {
  email: string;
  password: string;
  role: string;
  active: boolean;
  createdAt: Date;
}

/**
 * Create an admin account in Firestore
 * @param email Admin email address
 * @param password Admin password (plain text for this example)
 * @param role Admin role (default: 'admin')
 */
export async function createAdminAccount(
  email: string, 
  password: string, 
  role: string = 'admin'
): Promise<void> {
  try {
    const adminData: AdminAccount = {
      email: email.toLowerCase(),
      password: password,
      role: role,
      active: true,
      createdAt: new Date()
    };

    // Create document with email as ID (sanitized)
    const sanitizedEmail = email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
    const adminRef = doc(collection(db, 'admins'), sanitizedEmail);
    
    await setDoc(adminRef, adminData);
    
    console.log('✅ Admin account created successfully:', email);
  } catch (error) {
    console.error('❌ Error creating admin account:', error);
    throw error;
  }
}

/**
 * Setup multiple admin accounts
 */
export async function setupAdminAccounts(): Promise<void> {
  try {
    // Example admin accounts - CHANGE THESE CREDENTIALS
    const adminAccounts = [
      {
        email: 'admin@anandportfolio.com',
        password: 'your-secure-password-here', // CHANGE THIS
        role: 'super-admin'
      },
      {
        email: 'pnsssanand@gmail.com',
        password: 'your-admin-password', // CHANGE THIS
        role: 'admin'
      }
    ];

    console.log('🔧 Setting up admin accounts...');

    for (const account of adminAccounts) {
      await createAdminAccount(account.email, account.password, account.role);
    }

    console.log('🎉 All admin accounts created successfully!');
    console.log('⚠️  IMPORTANT: Change the default passwords immediately!');

  } catch (error) {
    console.error('❌ Failed to setup admin accounts:', error);
  }
}

/**
 * Test the admin login function
 */
export async function testAdminLogin(email: string, password: string): Promise<void> {
  try {
    const { adminLogin } = await import('./adminAuth');
    
    console.log('🧪 Testing admin login...');
    const result = await adminLogin(email, password);
    
    if (result.success) {
      console.log('✅ Admin login test successful:', result.user);
    } else {
      console.log('❌ Admin login test failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error testing admin login:', error);
  }
}

/**
 * Usage in browser console or setup script:
 * 
 * 1. Create a single admin account:
 *    createAdminAccount('your-email@example.com', 'your-password')
 * 
 * 2. Setup multiple accounts:
 *    setupAdminAccounts()
 * 
 * 3. Test login:
 *    testAdminLogin('your-email@example.com', 'your-password')
 */

// Example: Uncomment to run setup when this file is imported
// setupAdminAccounts();
