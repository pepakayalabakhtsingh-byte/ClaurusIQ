import { motion } from 'framer-motion';

const HeatmapSection = ({ title, content, confidence }) => {
  let borderColor = 'border-slate-200 dark:border-slate-800';
  let badgeColor = 'bg-slate-100 text-slate-600';
  let badgeText = 'Unknown';

  // The confidence heatmap logic
  if (confidence === 'Excellent' || confidence === 'Very High') {
    borderColor = 'border-emerald-400 dark:border-emerald-500 shadow-emerald-500/10';
    badgeColor = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    badgeText = 'Strong Evidence';
  } else if (confidence === 'High' || confidence === 'Moderate') {
    borderColor = 'border-amber-400 dark:border-amber-500 shadow-amber-500/10';
    badgeColor = 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    badgeText = 'Moderate Evidence';
  } else if (confidence === 'Low' || confidence === 'Very Low') {
    borderColor = 'border-red-400 dark:border-red-500 shadow-red-500/10';
    badgeColor = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    badgeText = 'Conflicting Evidence';
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-slate-900 rounded-2xl p-6 border-l-4 shadow-lg mb-6 relative cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${borderColor}`}
    >
      <div className="absolute top-6 right-6">
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${badgeColor}`}>
          {badgeText}
        </span>
      </div>
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</h3>
      <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
        {content}
      </p>
    </motion.div>
  );
};

const ExecutiveSummaryPanel = ({ report }) => {
  const { executiveSummary, recommendations, researchGaps } = report;

  // We map the overall confidence to the heatmap for the summary sections
  const overallConfidence = recommendations?.[0]?.confidence || 'Unknown';

  return (
    <div className="space-y-12 pb-12">
      <section>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Executive Summary</h2>
        <HeatmapSection title="Research Objective" content={executiveSummary.objective} confidence={overallConfidence} />
        <HeatmapSection title="Methodology" content={executiveSummary.methodology} confidence={overallConfidence} />
        <HeatmapSection title="Conclusion" content={executiveSummary.conclusion} confidence={overallConfidence} />
      </section>

      <section>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Key Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations?.map((rec, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400 px-3 py-1 rounded-full">
                  {rec.category}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase">{rec.priority} Priority</span>
              </div>
              <p className="font-bold text-lg text-slate-900 dark:text-white mb-2">{rec.recommendation}</p>
              <p className="text-slate-500 text-sm">{rec.why}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Research Gaps Detected</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {researchGaps?.map((gap, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
              <p className="font-bold text-slate-900 dark:text-white mb-1">{gap.type}</p>
              <p className="text-slate-500 text-sm">{gap.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ExecutiveSummaryPanel;
