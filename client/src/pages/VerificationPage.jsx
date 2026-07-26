import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineDocumentSearch } from 'react-icons/hi';
import api from '../services/api';
import ClaimCard from '../components/verification/ClaimCard';
import EvidenceViewer from '../components/verification/EvidenceViewer';

const VerificationPage = () => {
  const [history, setHistory] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/verification/history');
      setHistory(res.data.data);
      if (res.data.data.length > 0) {
        setSelectedSession(res.data.data[0]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch verification history');
    } finally {
      setLoading(false);
    }
  };

  const getAnalytics = (session) => {
    if (!session || !session.claims) return { verified: 0, conflicting: 0, avgConfidence: 0, total: 0 };
    const claims = session.claims;
    const verified = claims.filter(c => c.status === 'Verified' || c.status === 'Likely Verified').length;
    const conflicting = claims.filter(c => c.status === 'Conflicting Evidence').length;
    const avgConf = claims.length > 0 ? claims.reduce((acc, c) => acc + c.confidenceScore, 0) / claims.length : 0;
    
    return { verified, conflicting, avgConfidence: Math.round(avgConf), total: claims.length };
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
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Verification Runs</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-10">No verification sessions found.</p>
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
                  <HiOutlineDocumentSearch className="w-4 h-4" />
                  {new Date(session.createdAt).toLocaleDateString()}
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {session.claims?.length || 0} Claims Verified
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
              <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Evidence Verification</h1>
              
              {/* Analytics Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Total Claims</div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white">{analytics.total}</div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/50">
                  <div className="text-emerald-600 dark:text-emerald-400 text-sm font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <HiOutlineCheckCircle /> Verified
                  </div>
                  <div className="text-3xl font-black text-emerald-700 dark:text-emerald-300">{analytics.verified}</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-2xl border border-red-200 dark:border-red-800/50">
                  <div className="text-red-600 dark:text-red-400 text-sm font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <HiOutlineExclamationCircle /> Conflicting
                  </div>
                  <div className="text-3xl font-black text-red-700 dark:text-red-300">{analytics.conflicting}</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-200 dark:border-blue-800/50">
                  <div className="text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-wider mb-1">Avg Confidence</div>
                  <div className="text-3xl font-black text-blue-700 dark:text-blue-300">{analytics.avgConfidence}%</div>
                </div>
              </div>
            </div>

            {/* Claims Grid */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-950">
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                {selectedSession.claims?.map((claim, index) => (
                  <ClaimCard 
                    key={index} 
                    claim={claim} 
                    index={index} 
                    onClick={setSelectedClaim} 
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <HiOutlineDocumentSearch className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-700" />
            <h2 className="text-xl font-bold">No Verification Session Selected</h2>
            <p className="mt-2 text-sm">Run a workflow to generate verification results.</p>
          </div>
        )}
      </div>

      {/* Evidence Viewer Modal */}
      <AnimatePresence>
        {selectedClaim && (
          <EvidenceViewer 
            claim={selectedClaim} 
            onClose={() => setSelectedClaim(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default VerificationPage;
