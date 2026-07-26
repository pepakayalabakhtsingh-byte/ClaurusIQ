import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineBookmark, HiOutlineSearch, HiOutlineTrash, HiOutlineExternalLink } from 'react-icons/hi';
import api from '../services/api';
import toast from 'react-hot-toast';

const BookmarksPage = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookmarkedWorkflows();
  }, []);

  const fetchBookmarkedWorkflows = async () => {
    try {
      // Fetch completed workflows as "saved" items the user can reference
      const res = await api.get('/workflow');
      const completed = (res.data.data || []).filter(w => w.status === 'completed');
      setWorkflows(completed);
    } catch (err) {
      toast.error('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HiOutlineBookmark className="text-rose-500" />
          Bookmarks
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Your saved research findings and completed reports for quick access.
        </p>
      </div>

      {workflows.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-500/10 to-pink-500/10 flex items-center justify-center mb-6 mx-auto">
            <HiOutlineBookmark className="w-10 h-10 text-rose-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Bookmarks Yet</h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            Complete research workflows to save them here for quick reference.
          </p>
          <button
            onClick={() => navigate('/dashboard/research')}
            className="mt-6 px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-colors"
          >
            Start Research
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workflows.map((wf) => (
            <motion.div
              key={wf._id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/10 to-pink-500/10 flex items-center justify-center shrink-0">
                  <HiOutlineBookmark className="w-5 h-5 text-rose-500" />
                </div>
                <button
                  onClick={() => navigate('/dashboard/workspace')}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <HiOutlineExternalLink className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 mb-2">
                {wf.query}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{new Date(wf.createdAt).toLocaleDateString()}</span>
                <span>·</span>
                <span>{wf.agents.filter(a => a.status === 'completed').length} agents completed</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default BookmarksPage;
