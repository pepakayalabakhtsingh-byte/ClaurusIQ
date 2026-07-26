import { motion } from 'framer-motion';
import { 
  HiOutlineCheckCircle, 
  HiOutlineClock, 
  HiOutlineExclamationCircle, 
  HiOutlinePlay,
  HiOutlineServer
} from 'react-icons/hi';

const AgentCard = ({ agent, index, isActive, onClick }) => {
  const getStatusConfig = () => {
    switch (agent.status) {
      case 'completed': return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: HiOutlineCheckCircle };
      case 'running': return { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/50', icon: HiOutlinePlay, pulse: true };
      case 'failed': return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: HiOutlineExclamationCircle };
      case 'idle':
      case 'queued':
      default: return { color: 'text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700', icon: HiOutlineClock };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 border backdrop-blur-md
        ${config.bg} ${config.border}
        ${isActive ? 'ring-2 ring-primary-500 shadow-lg scale-[1.02]' : 'hover:scale-[1.01] hover:shadow-md'}`}
    >
      <div className="flex items-center gap-4">
        {/* Icon container */}
        <div className={`p-3 rounded-lg ${config.bg} ${config.color}`}>
          <Icon className={`w-6 h-6 ${config.pulse ? 'animate-pulse' : ''}`} />
        </div>
        
        {/* Agent Info */}
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
            {agent.agentName.replace(/Agent$/, '')} Agent
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-medium uppercase tracking-wider ${config.color}`}>
              {agent.status}
            </span>
            {agent.executionTimeMs > 0 && (
              <>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {(agent.executionTimeMs / 1000).toFixed(1)}s
                </span>
              </>
            )}
          </div>
        </div>

        {/* Glow effect if running */}
        {agent.status === 'running' && (
          <div className="absolute inset-0 rounded-xl bg-blue-500/5 animate-pulse pointer-events-none" />
        )}
      </div>
    </motion.div>
  );
};

export default AgentCard;
