import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminDashboard from "@/components/admin/AdminDashboard";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Loader2 } from "lucide-react";

interface AdminProps {
  onBackToPortfolio: () => void;
}

export default function Admin({ onBackToPortfolio }: AdminProps) {
  const { isAdmin, loading } = useAuth();

  useEffect(() => {
    // If not admin and not loading, redirect to portfolio
    if (!loading && !isAdmin) {
      onBackToPortfolio();
    }
  }, [isAdmin, loading, onBackToPortfolio]);

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-dark flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <Card className="glass-effect border-gold/20 bg-transparent">
            <CardContent className="p-8 text-center">
              <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Loading...</h2>
              <p className="text-gray-300">Verifying admin access</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-luxury-dark flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <Card className="glass-effect border-red-500/20 bg-transparent">
            <CardContent className="p-8 text-center">
              <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
              <p className="text-gray-300 mb-6">You don't have permission to access this area.</p>
              <button
                onClick={onBackToPortfolio}
                className="bg-gradient-to-r from-gold to-gold-light text-black px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                Back to Portfolio
              </button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-dark flex flex-col">
      <div className="flex-1">
        <AdminDashboard onBackToPortfolio={onBackToPortfolio} />
      </div>
      <Footer />
    </div>
  );
}
