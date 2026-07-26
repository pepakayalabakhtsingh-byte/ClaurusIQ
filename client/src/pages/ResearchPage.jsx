import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineSearch, HiOutlineSparkles, HiOutlineLightningBolt, HiOutlineBookOpen, HiOutlineAcademicCap } from 'react-icons/hi';
import { workflowService } from '../services/workflowService';
import WorkflowVisualizer from '../components/workflow/WorkflowVisualizer';
import StatusPanel from '../components/workflow/StatusPanel';
import AgentDetailsPanel from '../components/workflow/AgentDetailsPanel';
import SourceCard from '../components/workflow/SourceCard';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ResearchPage = () => {
  const [query, setQuery] = useState('');
  const [workflow, setWorkflow] = useState(null);
  const [selectedAgentIndex, setSelectedAgentIndex] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false);
  const [currentDepth, setCurrentDepth] = useState('Detailed');
  const sseRef = useRef(null);

  const startResearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('Please enter a research query.');
      return;
    }
    
    setIsStarting(true);
    try {
      const result = await workflowService.startWorkflow(query);
      if (result.success) {
        subscribeToWorkflow(result.workflowId);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to start research workflow');
      setIsStarting(false);
    }
  };

  const subscribeToWorkflow = (id) => {
    if (sseRef.current) {
      sseRef.current.close();
    }
    
    sseRef.current = workflowService.subscribeToWorkflow(
      id,
      (data) => {
        if (data.type === 'STATE_UPDATE' || data.type === 'PROGRESS_UPDATE') {
          setWorkflow(data.workflow);
          setIsStarting(false); // Make sure loading state is cleared once we get data
        }
      },
      (error) => {
        console.error('SSE Error', error);
      }
    );
  };

  const handleAction = async (action) => {
    if (!workflow) return;
    try {
      await workflowService.performAction(workflow._id, action);
      toast.success(`Workflow ${action}ed`);
    } catch (err) {
      toast.error(`Failed to ${action} workflow`);
    }
  };

  const handleDepthChange = async (depth) => {
    if (!workflow || isGeneratingExplanation || depth === currentDepth) return;
    setIsGeneratingExplanation(true);
    setCurrentDepth(depth);
    try {
      const result = await workflowService.generateExplanation(workflow._id, depth);
      if (result.success) {
        setWorkflow(prev => {
          const newWorkflow = { ...prev };
          const idx = newWorkflow.agents.findIndex(a => a.agentName === 'ReportGenerationAgent');
          if (idx !== -1) {
            newWorkflow.agents[idx].output.explanation = result.explanation;
            newWorkflow.agents[idx].output.depth = result.depth;
          }
          return newWorkflow;
        });
        toast.success('Explanation depth updated');
      }
    } catch (err) {
      toast.error('Failed to update explanation depth');
      setCurrentDepth(workflow.agents[5]?.output?.depth || 'Detailed');
    } finally {
      setIsGeneratingExplanation(false);
    }
  };

  // Clean up SSE on unmount
  useEffect(() => {
    return () => {
      if (sseRef.current) {
        sseRef.current.close();
      }
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-8rem)]">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full transition-all duration-300">
        
        {/* Input Section (Hidden if workflow is active) */}
        {!workflow && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl mx-auto w-full"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-6">
              <HiOutlineSparkles className="w-8 h-8 text-primary-500" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              What would you like to research?
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              Our autonomous agents will discover sources, verify claims, and generate a comprehensive report.
            </p>

            <form onSubmit={startResearch} className="w-full relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="E.g., What are the effects of microplastics on marine life?"
                className="w-full pl-6 pr-32 py-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 text-slate-900 dark:text-white placeholder-slate-400 transition-all text-lg shadow-xl shadow-slate-200/20 dark:shadow-none"
                disabled={isStarting}
                maxLength={300}
              />
              <button
                type="submit"
                disabled={isStarting || !query.trim()}
                className="absolute right-3 top-3 bottom-3 px-6 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isStarting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <HiOutlineSearch className="w-5 h-5" />
                    Start
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {/* Workflow Active State */}
        {workflow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full space-y-6 pb-20"
          >
            <StatusPanel workflow={workflow} onAction={handleAction} />
            
            {/* Final Report Section (Moved to top per user request) */}
            {workflow.agents[5]?.status === 'completed' && workflow.agents[5]?.output && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl relative"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
                      <HiOutlineSparkles className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Research Final Report</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Synthesized from verified sources</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    {['Quick', 'Detailed', 'Research'].map(depth => (
                      <button
                        key={depth}
                        onClick={() => handleDepthChange(depth)}
                        disabled={isGeneratingExplanation}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentDepth === depth ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                      >
                        {depth === 'Quick' && <span className="mr-1">⚡</span>}
                        {depth === 'Detailed' && <span className="mr-1">📘</span>}
                        {depth === 'Research' && <span className="mr-1">🎓</span>}
                        {depth}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary-600 dark:prose-a:text-primary-400">
                  {isGeneratingExplanation ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                      <span className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-4" />
                      <p>Generating {currentDepth.toLowerCase()} explanation...</p>
                    </div>
                  ) : (
                    workflow.agents[5].output.explanation ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {workflow.agents[5].output.explanation}
                      </ReactMarkdown>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Executive Summary</h4>
                          {workflow.agents[5].output.summary && typeof workflow.agents[5].output.summary === 'object' ? (
                            <div className="space-y-2">
                              {workflow.agents[5].output.summary.objective && <p><strong>Objective:</strong> {workflow.agents[5].output.summary.objective}</p>}
                              {workflow.agents[5].output.summary.scope && <p><strong>Scope:</strong> {workflow.agents[5].output.summary.scope}</p>}
                              {workflow.agents[5].output.summary.conclusion && <p><strong>Conclusion:</strong> {workflow.agents[5].output.summary.conclusion}</p>}
                            </div>
                          ) : (
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                              {typeof workflow.agents[5].output.summary === 'string' ? workflow.agents[5].output.summary : ''}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
                
                {workflow.agents[6]?.status === 'completed' && workflow.agents[6]?.output?.conversationId && (
                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <Link 
                      to={`/dashboard/assistant`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                    >
                      Discuss with AI Assistant
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 overflow-hidden">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Active Research Flow</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">"{workflow.query}"</p>
              </div>
              
              <WorkflowVisualizer 
                agents={workflow.agents}
                selectedAgentIndex={selectedAgentIndex}
                onSelectAgent={setSelectedAgentIndex}
              />
            </div>
            
            {/* Real-time Sources Section */}
            {workflow.agents[1]?.status === 'completed' && workflow.agents[1]?.output?.allProcessedSources && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Retrieved Sources
                    <span className="text-xs font-semibold px-2.5 py-1 bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400 rounded-full">
                      {workflow.agents[1].output.allProcessedSources.length} Found
                    </span>
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workflow.agents[1].output.allProcessedSources.map((source, idx) => (
                    <SourceCard key={idx} source={source} index={idx} />
                  ))}
                </div>
              </motion.div>
            )}


          </motion.div>
        )}
      </div>

      {/* Side Panel for Agent Details */}
      <AnimatePresence>
        {workflow && selectedAgentIndex !== null && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 400, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="hidden lg:block h-[calc(100vh-10rem)] sticky top-6"
          >
            <div className="w-[400px] h-full">
              <AgentDetailsPanel 
                agent={workflow.agents[selectedAgentIndex]}
                onClose={() => setSelectedAgentIndex(null)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Modal for Agent Details */}
      <AnimatePresence>
        {workflow && selectedAgentIndex !== null && (
          <div className="lg:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 p-4">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-w-lg h-[80vh] sm:h-[600px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <AgentDetailsPanel 
                agent={workflow.agents[selectedAgentIndex]}
                onClose={() => setSelectedAgentIndex(null)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResearchPage;
