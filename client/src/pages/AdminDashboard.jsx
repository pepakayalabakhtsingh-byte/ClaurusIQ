import React, { useState, useEffect } from 'react';
import { FiServer, FiUsers, FiActivity, FiShield, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, workflows: 0, logs: 0 });
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, healthRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/health')
      ]);
      setStats(statsRes.data.data);
      setHealth(healthRes.data.data);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">System overview and health metrics.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
              <FiUsers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Users</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.users}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
              <FiActivity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Active Workflows</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.workflows}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400">
              <FiShield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Audit Logs</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.logs}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <FiServer className="text-slate-400" />
            System Health
          </h2>
        </div>
        <div className="p-6">
          {health ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Status</p>
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                  <FiCheckCircle />
                  {health.status}
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Environment</p>
                <p className="text-slate-900 dark:text-white capitalize">{health.environment}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Memory Used</p>
                <p className="text-slate-900 dark:text-white">{health.memory.rss}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Uptime</p>
                <p className="text-slate-900 dark:text-white">
                  {Math.floor(health.uptime / 60)} minutes
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-500">
              <FiAlertTriangle />
              Failed to load health status
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
