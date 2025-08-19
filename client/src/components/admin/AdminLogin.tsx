import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, X, AlertTriangle, Info } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminLogin({ isOpen, onClose, onSuccess }: AdminLoginProps) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const { login, loading, adminEmail, createAdminUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('🔐 Attempting admin login...');
      console.log('📧 Login email:', credentials.email);
      console.log('👑 Expected admin email:', adminEmail);
      
      await login(credentials.email, credentials.password);
      onSuccess();
      onClose();
      setCredentials({ email: "", password: "" });
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      
      // Show debug info if login fails
      if (error.code === 'auth/user-not-found') {
        setShowDebugInfo(true);
      }
    }
  };

  const handleCreateAdmin = async () => {
    try {
      console.log('🔧 Creating admin user...');
      await createAdminUser(credentials.email, credentials.password);
      
      // After creating, try to login
      await login(credentials.email, credentials.password);
      onSuccess();
      onClose();
      setCredentials({ email: "", password: "" });
    } catch (error) {
      console.error('❌ Failed to create admin user:', error);
    }
  };

  const handleClose = () => {
    setCredentials({ email: "", password: "" });
    setShowDebugInfo(false);
    onClose();
  };

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
          </CardHeader>
          <CardContent>
            {/* Debug Information Alert */}
            {showDebugInfo && (
              <Alert className="mb-4 border-yellow-600 bg-yellow-950/20">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <AlertDescription className="text-yellow-200 text-sm">
                  <div className="font-semibold mb-2">Login Issue Detected:</div>
                  <div className="space-y-1 text-xs">
                    <div>• Expected admin: <code className="bg-black/30 px-1 rounded">{adminEmail}</code></div>
                    <div>• Your input: <code className="bg-black/30 px-1 rounded">{credentials.email}</code></div>
                    <div>• Status: User not found in Firebase Auth</div>
                  </div>
                  <div className="mt-2 font-semibold">Solutions:</div>
                  <div className="text-xs space-y-1">
                    <div>1. Create admin user with the button below</div>
                    <div>2. Or use existing email: anandpinisetty@gmail.com</div>
                    <div>3. Or update .env.local with correct admin email</div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Configuration Info */}
            <Alert className="mb-4 border-blue-600 bg-blue-950/20">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-200 text-sm">
                <div>Current admin email: <code className="bg-black/30 px-1 rounded text-xs">{adminEmail}</code></div>
                <div className="text-xs mt-1 text-blue-300">
                  This email must exist in Firebase Authentication to login successfully.
                </div>
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="admin-email" className="text-gray-300">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => {
                    setCredentials(prev => ({ ...prev, email: e.target.value }));
                    setShowDebugInfo(false); // Hide debug info when user types
                  }}
                  placeholder={adminEmail || "Admin email"}
                  className="bg-luxury-light border-gray-600 text-white focus:border-gold mt-2"
                  required
                />
                {credentials.email && credentials.email !== adminEmail && (
                  <div className="text-xs text-yellow-400 mt-1">
                    ⚠️ This email differs from configured admin email
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="admin-password" className="text-gray-300">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Admin password"
                  className="bg-luxury-light border-gray-600 text-white focus:border-gold mt-2"
                  required
                />
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-gold to-gold-light text-black font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
                
                {showDebugInfo && (
                  <Button 
                    type="button"
                    onClick={handleCreateAdmin}
                    disabled={loading || !credentials.email || !credentials.password}
                    variant="outline"
                    className="flex-1 border-gold text-gold hover:bg-gold hover:text-black"
                  >
                    Create Admin
                  </Button>
                )}
              </div>
              
              <Button 
                type="button" 
                variant="outline"
                onClick={handleClose}
                className="w-full border-gray-600 text-white hover:bg-gray-700"
              >
                Cancel
              </Button>
            </form>
            
            {/* Development Tools */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-gray-800/50 rounded text-xs text-gray-400">
                <div className="font-semibold text-gray-300 mb-2">🛠️ Development Tools</div>
                <div className="space-y-1">
                  <div>• Admin email from env: {adminEmail}</div>
                  <div>• Firebase project: anand-portfolio-f1667</div>
                  <div>• Debug mode: Active</div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDebugInfo(!showDebugInfo)}
                  className="mt-2 text-xs text-gray-400 hover:text-white"
                >
                  {showDebugInfo ? 'Hide' : 'Show'} Debug Info
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
