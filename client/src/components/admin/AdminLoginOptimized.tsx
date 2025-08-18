import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, X, AlertTriangle, CheckCircle } from "lucide-react";
import { useAuthOptimized } from "@/hooks/useAuthOptimized";

interface AdminLoginOptimizedProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminLoginOptimized({ isOpen, onClose, onSuccess }: AdminLoginOptimizedProps) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [lastError, setLastError] = useState<string | null>(null);
  const { login, loading, validateSession, getSessionRemainingTime } = useAuthOptimized();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLastError(null);
    
    try {
      console.log('🚀 Starting quota-optimized admin login...');
      
      const result = await login(credentials.email, credentials.password);
      
      if (result.success) {
        console.log('✅ Login successful, redirecting...');
        onSuccess();
        onClose();
        setCredentials({ email: "", password: "" });
      } else {
        // Set local error state for additional UI feedback
        setLastError(result.message);
        
        // Log the specific error for debugging
        console.error('❌ Login failed:', {
          code: result.error?.code,
          message: result.error?.message
        });
        
        // Show specific guidance based on error type
        if (result.error?.code === 'resource-exhausted') {
          setLastError('Too many requests. Please wait a few minutes and try again.');
        } else if (result.error?.code === 'permission-denied') {
          setLastError('Access denied. Please check your admin permissions.');
        }
      }
    } catch (error) {
      console.error('🚫 Unexpected login error:', error);
      setLastError('An unexpected error occurred. Please try again.');
    }
  };

  const handleClose = () => {
    setCredentials({ email: "", password: "" });
    setLastError(null);
    onClose();
  };

  // Check if session is still valid when opening
  const sessionTime = getSessionRemainingTime();
  const isSessionValid = validateSession();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md"
      >
        <Card className="glass-effect border-gold/20 bg-luxury-darker">
          <CardHeader className="text-center relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="absolute right-0 top-0 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-gold mr-2" />
              <CardTitle className="text-2xl font-bold text-gold">Admin Login</CardTitle>
            </div>
            <p className="text-sm text-gray-400">
              Quota-optimized authentication
            </p>
          </CardHeader>
          <CardContent>
            {/* Session Info */}
            {isSessionValid && sessionTime > 0 && (
              <Alert className="mb-4 border-green-600 bg-green-950/20">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-300">
                  Active session: {Math.floor(sessionTime / 60)}h {sessionTime % 60}m remaining
                </AlertDescription>
              </Alert>
            )}
            
            {/* Error Display */}
            {lastError && (
              <Alert className="mb-4 border-red-600 bg-red-950/20">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300">
                  {lastError}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="admin-email" className="text-gray-300">
                  Admin Email
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => {
                    setCredentials(prev => ({ ...prev, email: e.target.value }));
                    setLastError(null); // Clear error when user types
                  }}
                  placeholder="admin@example.com"
                  className="bg-luxury-light border-gray-600 text-white focus:border-gold mt-2"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="admin-password" className="text-gray-300">
                  Password
                </Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => {
                    setCredentials(prev => ({ ...prev, password: e.target.value }));
                    setLastError(null); // Clear error when user types
                  }}
                  placeholder="Enter admin password"
                  className="bg-luxury-light border-gray-600 text-white focus:border-gold mt-2"
                  required
                  disabled={loading}
                />
              </div>
              
              {/* Quota Usage Info */}
              <div className="text-xs text-gray-500 bg-gray-800/30 p-2 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Optimized: Single Firestore read per login</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Session cached locally for 24 hours</span>
                </div>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-gold to-gold-light text-black font-semibold disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 border-gray-600 text-white hover:bg-gray-700 disabled:opacity-50"
                >
                  Cancel
                </Button>
              </div>
            </form>
            
            {/* Debug Info (remove in production) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-2 bg-gray-800/50 rounded text-xs text-gray-400">
                <div>💡 Dev Info:</div>
                <div>• Uses Firestore collection: 'admins'</div>
                <div>• Query by email field</div>
                <div>• Plain text password (example only)</div>
                <div>• Session stored in localStorage</div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

/**
 * Usage Instructions:
 * 
 * 1. Replace your existing AdminLogin import:
 *    import AdminLoginOptimized from "@/components/admin/AdminLoginOptimized";
 * 
 * 2. Use it exactly like the original:
 *    <AdminLoginOptimized 
 *      isOpen={showLogin} 
 *      onClose={() => setShowLogin(false)}
 *      onSuccess={() => setIsLoggedIn(true)} 
 *    />
 * 
 * 3. Set up your Firestore 'admins' collection:
 *    - Document structure: { email: string, password: string, role?: string, active?: boolean }
 *    - Example document:
 *      {
 *        email: "admin@example.com",
 *        password: "your_password",
 *        role: "admin",
 *        active: true
 *      }
 */
