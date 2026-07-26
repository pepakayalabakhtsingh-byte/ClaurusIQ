import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineLockClosed,
  HiOutlineRefresh,
} from 'react-icons/hi';
import { WHY_CLAURUSIQ } from '../../constants';

const icons = [
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineLockClosed,
  HiOutlineRefresh,
];

const WhyClaurusIQ = () => {
  return (
    <section
      id="why-claurusiq"
      className="py-20 lg:py-32 bg-slate-50/50 dark:bg-slate-900/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mt-3 mb-6">
              Why{' '}
              <span className="gradient-text">ClaurusIQ</span>?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              We combine cutting-edge multi-agent AI with rigorous verification
              methodology to deliver research insights you can actually trust.
            </p>

            <div className="space-y-6">
              {WHY_CLAURUSIQ.map((item, index) => {
                const Icon = icons[index];
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mt-10"
            >
              <Link
                to="/register"
                className="btn-primary px-8 py-4 rounded-2xl text-base font-semibold text-white inline-block"
              >
                Start Researching Now
              </Link>
            </motion.div>
          </motion.div>

          {/* Right — Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative bg-white dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50 shadow-xl">
              {/* Fake Agent Status */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Research Agent</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">Active — Analyzing 12 sources</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30">
                  <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">Verification Agent</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Active — Cross-referencing 8 claims</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800/30">
                  <div className="w-3 h-3 rounded-full bg-violet-500 animate-pulse" />
                  <div>
                    <p className="text-sm font-semibold text-violet-800 dark:text-violet-300">Bias Detector</p>
                    <p className="text-xs text-violet-600 dark:text-violet-400">Active — Scanning for bias patterns</p>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Overall Confidence</span>
                    <span className="text-sm font-bold text-primary-500">94.7%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '94.7%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Background Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/10 to-accent-500/10 blur-3xl -z-10 rounded-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyClaurusIQ;
