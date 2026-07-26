import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineLockClosed, HiOutlineLogin } from 'react-icons/hi';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-surface-darker px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6"
        >
          <HiOutlineLockClosed className="w-10 h-10 text-red-500" />
        </motion.div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
          Access Denied
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
          You don't have permission to access this page.
          Please log in with an authorized account.
        </p>

        <Link
          to="/login"
          className="btn-primary px-6 py-3 rounded-xl font-semibold text-white inline-flex items-center gap-2"
        >
          <HiOutlineLogin className="w-5 h-5" />
          Go to Login
        </Link>
      </motion.div>
    </div>
  );
};

export default UnauthorizedPage;
