
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmokeBackground from '@/components/SmokeBackground';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Clock, Play, Pause, Square } from 'lucide-react';

const DashboardTimeTracking = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-webdev-black flex items-center justify-center">
        <div className="text-webdev-silver">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-webdev-black relative overflow-hidden">
      <SmokeBackground />
      <Header />
      
      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <DashboardSidebar />
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              <div className="glass-effect rounded-2xl p-8 border border-webdev-glass-border">
                <div className="flex items-center gap-4 mb-8">
                  <Clock className="w-8 h-8 text-webdev-gradient-blue" />
                  <h1 className="text-3xl font-light text-webdev-silver">Time Tracking</h1>
                </div>

                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-webdev-soft-gray mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-light text-webdev-silver mb-2">Time Tracking Coming Soon</h3>
                  <p className="text-webdev-soft-gray mb-8">
                    This feature will allow you to track time spent on projects and tasks.
                  </p>
                  
                  {/* Placeholder UI */}
                  <div className="max-w-md mx-auto space-y-4">
                    <div className="glass-effect rounded-xl p-6 border border-webdev-glass-border">
                      <div className="text-4xl font-mono text-webdev-silver mb-4">00:00:00</div>
                      <div className="flex justify-center gap-4">
                        <button className="glass-effect px-4 py-2 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] relative overflow-hidden group border border-transparent hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)] text-sm flex items-center gap-2 opacity-50 cursor-not-allowed">
                          <Play className="w-4 h-4" />
                          <span className="relative z-10">Start</span>
                        </button>
                        <button className="glass-effect px-4 py-2 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] relative overflow-hidden group border border-transparent hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)] text-sm flex items-center gap-2 opacity-50 cursor-not-allowed">
                          <Pause className="w-4 h-4" />
                          <span className="relative z-10">Pause</span>
                        </button>
                        <button className="glass-effect px-4 py-2 rounded-xl text-webdev-silver hover:text-white transition-all duration-300 tracking-wide font-medium hover:scale-[1.02] relative overflow-hidden group border border-transparent hover:shadow-[0_0_20px_rgba(66,133,244,0.3),0_0_30px_rgba(138,43,226,0.2)] text-sm flex items-center gap-2 opacity-50 cursor-not-allowed">
                          <Square className="w-4 h-4" />
                          <span className="relative z-10">Stop</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DashboardTimeTracking;
