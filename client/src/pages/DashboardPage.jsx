import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  HiOutlineSearch,
  HiOutlineShieldCheck,
  HiOutlineDocumentReport,
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineTrendingUp,
  HiOutlineLightningBolt,
  HiOutlineCollection,
} from 'react-icons/hi';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.name?.split(' ')[0] || 'User';

  const [workflows, setWorkflows] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [wfRes, verRes] = await Promise.allSettled([
        api.get('/workflow'),
        api.get('/verification/history'),
      ]);

      if (wfRes.status === 'fulfilled') setWorkflows(wfRes.value.data.data || []);
      if (verRes.status === 'fulfilled') setVerifications(verRes.value.data.data || []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const completedWorkflows = workflows.filter(w => w.status === 'completed');
  const avgAccuracy = verifications.length > 0
    ? Math.round(verifications.reduce((sum, v) => {
        const claims = v.claims || [];
        const verified = claims.filter(c => c.status === 'Verified' || c.status === 'Likely Verified').length;
        return sum + (claims.length > 0 ? (verified / claims.length) * 100 : 0);
      }, 0) / verifications.length)
    : null;

  const quickActions = [
    { icon: HiOutlineSearch, label: 'New Research', color: 'from-blue-500 to-cyan-500', path: '/dashboard/research' },
    { icon: HiOutlineShieldCheck, label: 'Verify Claim', color: 'from-emerald-500 to-teal-500', path: '/dashboard/verification' },
    { icon: HiOutlineDocumentReport, label: 'Generate Report', color: 'from-violet-500 to-purple-500', path: '/dashboard/workspace' },
  ];

  const stats = [
    { icon: HiOutlineSearch, label: 'Researches', value: String(workflows.length), change: workflows.length > 0 ? `+${workflows.length}` : '', color: 'text-blue-500' },
    { icon: HiOutlineShieldCheck, label: 'Verifications', value: String(verifications.length), change: verifications.length > 0 ? `+${verifications.length}` : '', color: 'text-emerald-500' },
    { icon: HiOutlineDocumentReport, label: 'Reports', value: String(completedWorkflows.length), change: completedWorkflows.length > 0 ? `+${completedWorkflows.length}` : '', color: 'text-violet-500' },
    { icon: HiOutlineChartBar, label: 'Accuracy', value: avgAccuracy !== null ? `${avgAccuracy}%` : '—', change: '', color: 'text-amber-500' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Card */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 p-6 lg:p-8 text-white"
      >
        <div className="relative z-10">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-white/80 text-sm lg:text-base max-w-lg">
            Your AI research workspace is ready. Start a new investigation or review your recent findings.
          </p>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(action.path)}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:shadow-lg dark:hover:shadow-slate-900/50 transition-all cursor-pointer text-left"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {action.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Statistics
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  {stat.change && (
                    <span className="text-xs font-medium text-emerald-500 flex items-center gap-0.5">
                      <HiOutlineTrendingUp className="w-3 h-3" />
                      {stat.change}
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity & Saved Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Research */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Recent Research
            </h3>
            <HiOutlineClock className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-3">
            {workflows.length === 0 ? (
              <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-6">
                No research yet. Start your first one!
              </p>
            ) : (
              workflows.slice(0, 5).map((wf) => (
                <div
                  key={wf._id}
                  onClick={() => navigate('/dashboard/research')}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${wf.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/30' : wf.status === 'failed' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                    <HiOutlineSearch className={`w-4 h-4 ${wf.status === 'completed' ? 'text-emerald-600' : wf.status === 'failed' ? 'text-red-600' : 'text-blue-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{wf.query}</p>
                    <p className="text-xs text-slate-500">{new Date(wf.createdAt).toLocaleDateString()} · {wf.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Saved Reports */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Saved Reports
            </h3>
            <HiOutlineCollection className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-3">
            {completedWorkflows.length === 0 ? (
              <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-6">
                No reports generated yet.
              </p>
            ) : (
              completedWorkflows.slice(0, 5).map((wf) => (
                <div
                  key={wf._id}
                  onClick={() => navigate('/dashboard/workspace')}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
                    <HiOutlineDocumentReport className="w-4 h-4 text-violet-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{wf.query}</p>
                    <p className="text-xs text-slate-500">{new Date(wf.createdAt).toLocaleDateString()} · Completed</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Recent Activity
          </h3>
          <HiOutlineLightningBolt className="w-5 h-5 text-slate-400" />
        </div>
        {workflows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400 dark:text-slate-500">
            <HiOutlineClock className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm font-medium">No activity yet</p>
            <p className="text-xs mt-1">Your research activity will appear here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {workflows.slice(0, 8).map((wf) => (
              <div key={wf._id} className="flex items-center gap-3 text-sm py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div className={`w-2 h-2 rounded-full shrink-0 ${wf.status === 'completed' ? 'bg-emerald-500' : wf.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'}`} />
                <span className="text-slate-700 dark:text-slate-300 flex-1 truncate">Research: {wf.query}</span>
                <span className="text-xs text-slate-400 shrink-0">{new Date(wf.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;
