import { motion } from 'framer-motion';
import { HiOutlineChartBar, HiOutlineClock, HiOutlinePause, HiOutlinePlay, HiOutlineStop } from 'react-icons/hi';
import { workflowService } from '../../services/workflowService';

const StatusPanel = ({ workflow, onAction }) => {
  if (!workflow) return null;

  const isRunning = workflow.status === 'running';
  const isPaused = workflow.status === 'paused';
  const isFinished = ['completed', 'failed', 'cancelled'].includes(workflow.status);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HiOutlineChartBar className="text-primary-500" />
            Workflow Status
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            ID: <span className="font-mono text-xs">{workflow._id}</span>
          </p>
        </div>
        
        {/* Actions */}
        {!isFinished && (
          <div className="flex gap-2">
            {isRunning && (
              <button 
                onClick={() => onAction('pause')}
                className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
                title="Pause Workflow"
              >
                <HiOutlinePause className="w-5 h-5" />
              </button>
            )}
            {isPaused && (
              <button 
                onClick={() => onAction('resume')}
                className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                title="Resume Workflow"
              >
                <HiOutlinePlay className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={() => onAction('cancel')}
              className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
              title="Cancel Workflow"
            >
              <HiOutlineStop className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Progress</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {workflow.progress}%
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Status</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white capitalize">
            {workflow.status}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span>Overall Completion</span>
          <span>{workflow.progress}%</span>
        </div>
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
            initial={{ width: 0 }}
            animate={{ width: `${workflow.progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;
