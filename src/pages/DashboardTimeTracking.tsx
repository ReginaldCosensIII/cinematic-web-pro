
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmokeBackground from '@/components/SmokeBackground';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import TimeEntryDetailsModal from '@/components/dashboard/TimeEntryDetailsModal';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Clock, FolderOpen, Target, Menu, X } from 'lucide-react';
import { format } from 'date-fns';

interface TimeEntry {
  id: string;
  project_title: string;
  hours: number;
  description: string;
  date: string;
  created_at: string;
}

const DashboardTimeTracking = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [totalHours, setTotalHours] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTimeEntry, setSelectedTimeEntry] = useState<TimeEntry | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const entriesPerPage = 10;

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchTimeEntries();
    }
  }, [user, currentPage]);

  const fetchTimeEntries = async () => {
    try {
      console.log('Fetching time entries for user:', user?.id);
      
      // Get total count first
      const { count } = await supabase
        .from('time_entries')
        .select('*', { count: 'exact', head: true })
        .eq('projects.user_id', user?.id);

      setTotalEntries(count || 0);

      // Get paginated time entries with project information
      const { data, error } = await supabase
        .from('time_entries')
        .select(`
          id,
          hours,
          description,
          date,
          created_at,
          projects!inner(
            id,
            title,
            user_id
          )
        `)
        .eq('projects.user_id', user?.id)
        .order('date', { ascending: false })
        .range((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage - 1);

      if (error) {
        console.error('Error fetching time entries:', error);
      } else {
        const formattedEntries = (data || []).map(entry => ({
          id: entry.id,
          project_title: entry.projects.title,
          hours: Number(entry.hours),
          description: entry.description || '',
          date: entry.date,
          created_at: entry.created_at
        }));
        
        console.log('Formatted time entries:', formattedEntries);
        setTimeEntries(formattedEntries);
        
        // Calculate total hours (for all entries, not just current page)
        const { data: allData } = await supabase
          .from('time_entries')
          .select(`
            hours,
            projects!inner(
              user_id
            )
          `)
          .eq('projects.user_id', user?.id);

        const total = (allData || []).reduce((sum, entry) => sum + Number(entry.hours), 0);
        setTotalHours(total);
        console.log('Total hours calculated:', total);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleTimeEntryClick = (timeEntry: TimeEntry) => {
    setSelectedTimeEntry(timeEntry);
    setModalOpen(true);
  };

  const totalPages = Math.ceil(totalEntries / entriesPerPage);

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
      
      <main className="relative z-10 pt-24 md:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex gap-8">
            {/* Mobile Sidebar Toggle */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="fixed top-24 left-4 z-50 glass-effect rounded-xl p-3 border border-webdev-glass-border lg:hidden"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5 text-webdev-silver" />
                ) : (
                  <Menu className="w-5 h-5 text-webdev-silver" />
                )}
              </button>
            )}

            {/* Sidebar */}
            <div className={`
              ${isMobile ? 'fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out' : 'hidden lg:block w-64 flex-shrink-0'}
              ${sidebarOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'}
            `}>
              {isMobile && (
                <div className="pt-24">
                  <DashboardSidebar />
                </div>
              )}
              {!isMobile && <DashboardSidebar />}
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobile && sidebarOpen && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            
            {/* Main Content */}
            <div className={`flex-1 ${isMobile ? 'ml-0' : ''}`}>
              <div className="glass-effect rounded-2xl p-4 md:p-8 border border-webdev-glass-border">
                <div className="flex items-center gap-4 mb-6 md:mb-8">
                  <Clock className="w-6 md:w-8 h-6 md:h-8 text-webdev-gradient-blue" />
                  <h1 className="text-2xl md:text-3xl font-light text-webdev-silver">Time Tracking</h1>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                  <div className="glass-effect rounded-xl p-4 md:p-6 border border-webdev-glass-border">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 md:w-6 h-5 md:h-6 text-webdev-gradient-blue" />
                      <h3 className="text-base md:text-lg font-medium text-webdev-silver">Total Hours</h3>
                    </div>
                    <p className="text-2xl md:text-3xl font-light text-white">{totalHours.toFixed(1)}</p>
                  </div>
                  
                  <div className="glass-effect rounded-xl p-4 md:p-6 border border-webdev-glass-border">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-5 md:w-6 h-5 md:h-6 text-webdev-gradient-purple" />
                      <h3 className="text-base md:text-lg font-medium text-webdev-silver">Time Entries</h3>
                    </div>
                    <p className="text-2xl md:text-3xl font-light text-white">{totalEntries}</p>
                  </div>
                  
                  <div className="glass-effect rounded-xl p-4 md:p-6 border border-webdev-glass-border sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FolderOpen className="w-5 md:w-6 h-5 md:h-6 text-green-400" />
                      <h3 className="text-base md:text-lg font-medium text-webdev-silver">This Month</h3>
                    </div>
                    <p className="text-2xl md:text-3xl font-light text-white">
                      {timeEntries.filter(entry => {
                        const entryDate = new Date(entry.date);
                        const now = new Date();
                        return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
                      }).reduce((sum, entry) => sum + entry.hours, 0).toFixed(1)}h
                    </p>
                  </div>
                </div>

                {loadingData ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 md:h-20 bg-webdev-darker-gray/50 rounded-xl"></div>
                    ))}
                  </div>
                ) : timeEntries.length === 0 ? (
                  <div className="text-center py-8 md:py-12">
                    <Clock className="w-12 md:w-16 h-12 md:h-16 text-webdev-soft-gray mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg md:text-xl font-light text-webdev-silver mb-2">No Time Logged Yet</h3>
                    <p className="text-webdev-soft-gray text-sm md:text-base">
                      Time entries will appear here as work is logged on your projects.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg md:text-xl font-light text-webdev-silver">Time Entries</h2>
                      <div className="text-sm text-webdev-soft-gray">
                        Page {currentPage} of {totalPages} ({totalEntries} total entries)
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {timeEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="glass-effect rounded-xl p-4 md:p-6 border border-webdev-glass-border hover:border-webdev-gradient-blue/50 transition-all duration-300 cursor-pointer"
                          onClick={() => handleTimeEntryClick(entry)}
                        >
                          <div className="flex flex-col gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <FolderOpen className="w-4 md:w-5 h-4 md:h-5 text-webdev-gradient-blue" />
                                <h3 className="text-base md:text-lg font-medium text-webdev-silver">
                                  {entry.project_title}
                                </h3>
                              </div>
                              {entry.description && (
                                <p className="text-sm md:text-base text-webdev-soft-gray mb-3">{entry.description}</p>
                              )}
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs md:text-sm text-webdev-soft-gray">
                                <span>Date: {format(new Date(entry.date), 'MMM d, yyyy')}</span>
                                <span>Logged: {format(new Date(entry.created_at), 'MMM d, yyyy')}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 sm:justify-end">
                              <Clock className="w-4 md:w-5 h-4 md:h-5 text-webdev-gradient-blue" />
                              <span className="text-xl md:text-2xl font-light text-white">{entry.hours}</span>
                              <span className="text-webdev-soft-gray text-sm md:text-base">hours</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center mt-8">
                        <Pagination>
                          <PaginationContent className="glass-effect rounded-xl p-2 border border-webdev-glass-border">
                            <PaginationItem>
                              <PaginationPrevious 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                className={`text-webdev-silver hover:text-webdev-gradient-blue ${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                              />
                            </PaginationItem>
                            
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              let pageNumber;
                              if (totalPages <= 5) {
                                pageNumber = i + 1;
                              } else if (currentPage <= 3) {
                                pageNumber = i + 1;
                              } else if (currentPage > totalPages - 3) {
                                pageNumber = totalPages - 4 + i;
                              } else {
                                pageNumber = currentPage - 2 + i;
                              }
                              
                              return (
                                <PaginationItem key={pageNumber}>
                                  <PaginationLink
                                    onClick={() => setCurrentPage(pageNumber)}
                                    isActive={currentPage === pageNumber}
                                    className={`cursor-pointer ${
                                      currentPage === pageNumber
                                        ? 'bg-webdev-gradient-blue text-white'
                                        : 'text-webdev-silver hover:text-webdev-gradient-blue'
                                    }`}
                                  >
                                    {pageNumber}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            })}
                            
                            <PaginationItem>
                              <PaginationNext 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                className={`text-webdev-silver hover:text-webdev-gradient-blue ${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {selectedTimeEntry && (
        <TimeEntryDetailsModal
          timeEntry={selectedTimeEntry}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedTimeEntry(null);
          }}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default DashboardTimeTracking;
