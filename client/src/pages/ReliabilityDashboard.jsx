import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlineShieldCheck, 
  HiOutlineScale, 
  HiOutlineInformationCircle,
  HiOutlineCollection,
  HiOutlineLightningBolt
} from 'react-icons/hi';
import api from '../services/api';
import { AnimatedGauge, ProgressBar } from '../components/reliability/Visualizations';
import { ExplainScoreModal } from '../components/reliability/AdvancedVisualizations';

const ReliabilityDashboard = () => {
  const [history, setHistory] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [explainModalOpen, setExplainModalOpen] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/reliability/history');
      setHistory(res.data.data);
      if (res.data.data.length > 0) {
        setSelectedSession(res.data.data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!selectedSession) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 flex-col">
        <HiOutlineShieldCheck className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
        <h2 className="text-xl font-bold text-slate-500">No Reliability Sessions Found</h2>
      </div>
    );
  }

  const { reliability, consensus, diversity, bias, explanation, trace } = selectedSession;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar - History */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Reliability Engine</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.map((session) => (
            <div 
              key={session._id}
              onClick={() => setSelectedSession(session)}
              className={`p-4 rounded-xl cursor-pointer transition-all border ${
                selectedSession?._id === session._id 
                ? 'bg-primary-50 border-primary-200 dark:bg-primary-900/20 dark:border-primary-800' 
                : 'bg-slate-50 border-transparent hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <HiOutlineCollection className="w-4 h-4" />
                  {new Date(session.createdAt).toLocaleDateString()}
                </div>
                <div className={`text-sm font-black ${getScoreColor(session.reliability.score)}`}>
                  {session.reliability.score}/100
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {session.reliability.level} Reliability
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="p-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">AI Reliability Analysis</h1>
            <div className="flex gap-4">
              <button 
                onClick={() => setExplainModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-colors"
              >
                Explain this Score
              </button>
              <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-bold ${
                reliability.score >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' :
                reliability.score >= 50 ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800' :
                'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-800'
              }`}>
                <HiOutlineShieldCheck className="w-5 h-5" />
                {reliability.level} Confidence
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <AnimatedGauge value={reliability.score} label="Evidence Strength" colorClass="text-primary-500" />
            <AnimatedGauge value={consensus.score} label="Consensus" colorClass="text-emerald-500" />
            <AnimatedGauge value={diversity.score} label="Source Diversity" colorClass="text-blue-500" />
            <AnimatedGauge value={bias.score} label="Objectivity" colorClass="text-indigo-500" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-5xl mx-auto space-y-8 pb-20">
            
            {/* Explanation Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <HiOutlineLightningBolt className="text-primary-500 w-5 h-5"/> Explainable AI Reasoning
              </h3>
              <p className="text-slate-700 dark:text-slate-300 font-medium mb-6 leading-relaxed">
                {explanation.reason}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-3">Supporting Factors</h4>
                  <ul className="space-y-2">
                    {explanation.supportingFactors.map((f, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">•</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-3">Weaknesses & Missing Info</h4>
                  <ul className="space-y-2">
                    {explanation.weaknesses.concat(explanation.missingInformation).map((w, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span> {w}
                      </li>
                    ))}
                    {explanation.weaknesses.length === 0 && explanation.missingInformation.length === 0 && (
                      <li className="text-sm text-slate-500 italic">None detected.</li>
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Sub-Panels Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Consensus View */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6"
              >
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <HiOutlineScale className="text-emerald-500 w-5 h-5"/> Consensus Breakdown
                </h3>
                <ProgressBar label="Supporting Evidence" value={consensus.metrics.supporting} max={Math.max(10, consensus.metrics.supporting * 1.5)} colorClass="bg-emerald-500" />
                <ProgressBar label="Contradicting Evidence" value={consensus.metrics.contradicting} max={Math.max(10, consensus.metrics.contradicting * 1.5)} colorClass="bg-red-500" />
                <ProgressBar label="Neutral/Mixed" value={consensus.metrics.neutral} max={Math.max(10, consensus.metrics.neutral * 1.5)} colorClass="bg-slate-400" />
                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                  <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</span>
                  <span className="text-lg font-black text-slate-800 dark:text-slate-200">{consensus.level}</span>
                </div>
              </motion.div>

              {/* Bias View */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6"
              >
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <HiOutlineInformationCircle className="text-indigo-500 w-5 h-5"/> Objectivity & Style
                </h3>
                <ProgressBar label="Emotional Language" value={bias.indicators.emotional} max={10} colorClass="bg-pink-500" />
                <ProgressBar label="Subjective Statements" value={bias.indicators.subjective} max={10} colorClass="bg-indigo-500" />
                <ProgressBar label="Sensationalism" value={bias.indicators.sensational} max={10} colorClass="bg-orange-500" />
                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                  <span className="block text-xs font-bold text-slate-500 uppercase mb-1">Writing Style</span>
                  <span className="text-lg font-black text-slate-800 dark:text-slate-200">{bias.style}</span>
                </div>
              </motion.div>
            </div>

            {/* Transparency Trace */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-800"
            >
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                Transparency Trace Log
              </h3>
              <div className="font-mono text-sm text-slate-400 whitespace-pre-wrap bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto">
                {JSON.stringify(trace, null, 2)}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
      <ExplainScoreModal 
        isOpen={explainModalOpen} 
        onClose={() => setExplainModalOpen(false)} 
        reliability={reliability} 
      />
    </div>
  );
};

export default ReliabilityDashboard;
