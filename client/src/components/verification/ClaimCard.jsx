import { motion } from 'framer-motion';
import { 
  HiOutlineCheckCircle, 
  HiOutlineXCircle, 
  HiOutlineExclamationCircle, 
  HiOutlineQuestionMarkCircle,
  HiOutlineLibrary
} from 'react-icons/hi';

const ClaimCard = ({ claim, index, onClick }) => {
  if (!claim) return null;

  const getStatusColor = (status) => {
    switch(status) {
      case 'Verified':
      case 'Likely Verified':
        return 'text-emerald-600 bg-emerald-100 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/20 dark:border-emerald-500/30';
      case 'Partially Verified':
      case 'Insufficient Evidence':
        return 'text-amber-600 bg-amber-100 border-amber-200 dark:text-amber-400 dark:bg-amber-500/20 dark:border-amber-500/30';
      case 'Conflicting Evidence':
        return 'text-red-600 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-500/20 dark:border-red-500/30';
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:border-slate-700';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Verified':
      case 'Likely Verified': return <HiOutlineCheckCircle className="w-5 h-5" />;
      case 'Conflicting Evidence': return <HiOutlineXCircle className="w-5 h-5" />;
      case 'Partially Verified':
      case 'Insufficient Evidence': return <HiOutlineExclamationCircle className="w-5 h-5" />;
      default: return <HiOutlineQuestionMarkCircle className="w-5 h-5" />;
    }
  };

  const statusClass = getStatusColor(claim.status);
  const evidenceCount = (claim.supportingEvidence?.length || 0) + (claim.contradictingEvidence?.length || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => onClick(claim)}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4 gap-4">
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold shrink-0 ${statusClass}`}>
          {getStatusIcon(claim.status)}
          {claim.status}
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
          Confidence: {claim.confidenceScore}%
        </div>
      </div>

      <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-snug mb-4 group-hover:text-primary-500 transition-colors">
        "{claim.text}"
      </h3>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/50">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
          <span className="flex items-center gap-1"><HiOutlineLibrary className="w-4 h-4" /> {claim.category}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-lg">
            {claim.supportingEvidence?.length || 0} Supporting
          </span>
          <span className="text-xs font-semibold px-2 py-1 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-lg">
            {claim.contradictingEvidence?.length || 0} Contradicting
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ClaimCard;
