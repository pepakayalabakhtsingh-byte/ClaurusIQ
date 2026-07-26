import { useState, useEffect } from 'react';
import { HiOutlineAcademicCap, HiOutlineShieldCheck, HiOutlineDocumentDuplicate, HiOutlineCollection } from 'react-icons/hi';
import api from '../services/api';
import SourceCard from '../components/citation/SourceCard';

const CitationDashboard = () => {
  const [history, setHistory] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/citations/history');
      setHistory(res.data.data);
      if (res.data.data.length > 0) {
        setSelectedSession(res.data.data[0]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch citation history');
    } finally {
      setLoading(false);
    }
  };

  const getAnalytics = (session) => {
    if (!session || !session.citations) return { total: 0, avgTrust: 0, highQuality: 0 };
    const citations = session.citations;
    const avgTrust = citations.length > 0 ? citations.reduce((acc, c) => acc + c.trustScore, 0) / citations.length : 0;
    const highQuality = citations.filter(c => c.trustScore >= 80).length;
    
    return { 
      total: citations.length, 
      avgTrust: Math.round(avgTrust), 
      highQuality 
    };
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  const analytics = getAnalytics(selectedSession);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar - History */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col hidden lg:flex">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Citation Sessions</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-10">No citation sessions found.</p>
          ) : (
            history.map((session) => (
              <div 
                key={session._id}
                onClick={() => setSelectedSession(session)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  selectedSession?._id === session._id 
                  ? 'bg-primary-50 border-primary-200 dark:bg-primary-900/20 dark:border-primary-800' 
                  : 'bg-slate-50 border-transparent hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500">
                  <HiOutlineCollection className="w-4 h-4" />
                  {new Date(session.createdAt).toLocaleDateString()}
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {session.citations?.length || 0} Deduplicated Sources
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {selectedSession ? (
          <>
            <div className="p-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex-shrink-0 backdrop-blur-md">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Source Quality & Citations</h1>
              
              {/* Analytics Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                    <HiOutlineDocumentDuplicate className="w-4 h-4"/> Unique Sources
                  </div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white">{analytics.total}</div>
                </div>
                <div className="bg-primary-50 dark:bg-primary-900/20 p-5 rounded-2xl border border-primary-200 dark:border-primary-800/50">
                  <div className="text-primary-600 dark:text-primary-400 text-sm font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                    <HiOutlineShieldCheck className="w-4 h-4" /> Avg Trust Score
                  </div>
                  <div className="text-3xl font-black text-primary-700 dark:text-primary-300">{analytics.avgTrust}%</div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/50">
                  <div className="text-emerald-600 dark:text-emerald-400 text-sm font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                    <HiOutlineAcademicCap className="w-4 h-4" /> High Quality Sources
                  </div>
                  <div className="text-3xl font-black text-emerald-700 dark:text-emerald-300">{analytics.highQuality}</div>
                </div>
              </div>
            </div>

            {/* Citations Grid */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-950">
              <div className="max-w-4xl mx-auto space-y-6 pb-20">
                {selectedSession.citations?.map((source, index) => (
                  <SourceCard 
                    key={index} 
                    source={source} 
                    index={index} 
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <HiOutlineAcademicCap className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-700" />
            <h2 className="text-xl font-bold">No Citation Session Selected</h2>
            <p className="mt-2 text-sm">Run a workflow to generate structured citations.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitationDashboard;
