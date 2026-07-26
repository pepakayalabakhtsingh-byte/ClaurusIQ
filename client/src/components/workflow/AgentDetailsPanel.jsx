import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineX, HiOutlineCode, HiOutlineTerminal } from 'react-icons/hi';

const AgentDetailsPanel = ({ agent, onClose }) => {
  if (!agent) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="h-full flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">
              {agent.agentName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase
                ${agent.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                  agent.status === 'running' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                  agent.status === 'failed' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                  'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}
              >
                {agent.status}
              </span>
              {agent.executionTimeMs > 0 && (
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {(agent.executionTimeMs / 1000).toFixed(2)}s
                </span>
              )}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Logs */}
          <section>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white mb-3">
              <HiOutlineTerminal className="text-primary-500" /> Execution Logs
            </h4>
            <div className="bg-slate-900 text-slate-300 font-mono text-xs p-4 rounded-xl overflow-x-auto space-y-1">
              {agent.logs && agent.logs.length > 0 ? (
                agent.logs.map((log, i) => (
                  <div key={i} className="whitespace-pre-wrap">{log}</div>
                ))
              ) : (
                <div className="text-slate-600 italic">No logs available yet...</div>
              )}
              {agent.error && (
                <div className="text-red-400 whitespace-pre-wrap mt-2 font-semibold">ERROR: {agent.error}</div>
              )}
            </div>
          </section>

          {/* I/O Payloads */}
          <section>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white mb-3">
              <HiOutlineCode className="text-accent-500" /> Data Payload
            </h4>
            <div className="space-y-4">
              {/* Input */}
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Input</div>
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 overflow-x-auto">
                  <pre className="text-xs text-slate-700 dark:text-slate-300 font-mono">
                    {agent.input ? JSON.stringify(agent.input, null, 2) : 'Awaiting input...'}
                  </pre>
                </div>
              </div>
              
              {/* Output */}
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Output</div>
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 overflow-x-auto">
                  <pre className="text-xs text-slate-700 dark:text-slate-300 font-mono">
                    {agent.output ? JSON.stringify(agent.output, null, 2) : 'Awaiting output...'}
                  </pre>
                </div>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AgentDetailsPanel;
