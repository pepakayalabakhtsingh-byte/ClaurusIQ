import { motion } from 'framer-motion';
import { HiOutlineExternalLink, HiOutlineX } from 'react-icons/hi';

const EvidenceViewer = ({ claim, onClose }) => {
  if (!claim) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800"
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Evidence Analysis</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Rule-based confidence verification</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
          >
            <HiOutlineX className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Claim Summary */}
          <div className="bg-slate-100 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Claim</h3>
            <p className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
              "{claim.text}"
            </p>
          </div>

          {/* Rationale Engine */}
          <div>
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Confidence Calculation Rationale</h3>
            <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800/50 rounded-xl p-4 font-mono text-sm text-primary-800 dark:text-primary-300 whitespace-pre-wrap">
              {claim.rationale || 'No rationale available.'}
            </div>
            <div className="mt-3 flex justify-end">
              <span className="text-lg font-black text-slate-900 dark:text-white">Final Score: {claim.confidenceScore}%</span>
            </div>
          </div>

          {/* Supporting Evidence */}
          <div>
            <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Supporting Evidence ({claim.supportingEvidence?.length || 0})
            </h3>
            <div className="space-y-4">
              {claim.supportingEvidence?.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-sm italic">No supporting evidence found.</p>
              ) : (
                claim.supportingEvidence?.map((ev, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">"{ev.text}"</p>
                    <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2 border-t border-slate-100 dark:border-slate-700 pt-3 mt-3">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{ev.provider}</span>
                      <span>{ev.date}</span>
                      <a href={ev.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
                        Source <HiOutlineExternalLink />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Contradicting Evidence */}
          <div>
            <h3 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Contradicting Evidence ({claim.contradictingEvidence?.length || 0})
            </h3>
            <div className="space-y-4">
              {claim.contradictingEvidence?.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-sm italic">No contradicting evidence found.</p>
              ) : (
                claim.contradictingEvidence?.map((ev, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 border border-red-200 dark:border-red-500/30 rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">"{ev.text}"</p>
                    <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2 border-t border-slate-100 dark:border-slate-700 pt-3 mt-3">
                      <span className="font-semibold text-red-600 dark:text-red-400">{ev.provider}</span>
                      <span>{ev.date}</span>
                      <a href={ev.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-red-600 transition-colors">
                        Source <HiOutlineExternalLink />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default EvidenceViewer;
