import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineClock, HiOutlineSearch, HiOutlineDocumentText } from 'react-icons/hi';
import { workflowService } from '../services/workflowService';
import toast from 'react-hot-toast';

const HistoryPage = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const result = await workflowService.getWorkflows();
      if (result.success) {
        setWorkflows(result.data);
      }
    } catch (err) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
      case 'running': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
      case 'failed': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
      case 'paused': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HiOutlineClock className="text-primary-500" />
            Research History
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Review your past multi-agent research sessions.
          </p>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search history..." 
            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
          <HiOutlineSearch className="absolute left-3 top-2.5 text-slate-400" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton h-24 rounded-2xl w-full" />
          ))}
        </div>
      ) : workflows.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <HiOutlineDocumentText className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No history found</h3>
          <p className="text-slate-500 mt-1">You haven't run any research workflows yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {workflows.map((wf) => (
            <div 
              key={wf._id} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                    {wf.query}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase ${getStatusColor(wf.status)}`}>
                      {wf.status}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {new Date(wf.createdAt).toLocaleDateString()} at {new Date(wf.createdAt).toLocaleTimeString()}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <HiOutlineClock />
                      {wf.agents.reduce((acc, curr) => acc + (curr.executionTimeMs || 0), 0) / 1000}s
                    </span>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <div className="flex -space-x-2">
                    {wf.agents.map((agent, i) => (
                      <div 
                        key={i} 
                        className={`w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-bold
                          ${agent.status === 'completed' ? 'bg-emerald-500 text-white' : 
                            agent.status === 'running' ? 'bg-blue-500 text-white' : 
                            agent.status === 'failed' ? 'bg-red-500 text-white' : 
                            'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}
                        title={agent.agentName}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default HistoryPage;
