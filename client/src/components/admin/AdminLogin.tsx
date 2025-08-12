import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Shield, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminLogin({ isOpen, onClose, onSuccess }: AdminLoginProps) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(credentials.email, credentials.password);
      onSuccess();
      onClose();
      setCredentials({ email: "", password: "" });
    } catch (error) {
      // Error handling is done in the useAuth hook
    }
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
              onClick={onClose}
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="admin-email" className="text-gray-300">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Admin email"
                  className="bg-luxury-light border-gray-600 text-white focus:border-gold mt-2"
                  required
                />
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
              <div className="flex space-x-4 pt-4">
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
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-gray-600 text-white hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
