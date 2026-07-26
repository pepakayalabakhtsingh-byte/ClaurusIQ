import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import html2canvas from 'html2canvas';
import { HiOutlineDownload, HiOutlineX } from 'react-icons/hi';

export const FactorBreakdownChart = ({ breakdown }) => {
  const chartRef = useRef(null);

  const data = [
    { name: 'Consensus', value: breakdown.consensusContribution, color: '#10b981' },
    { name: 'Diversity', value: breakdown.sourceDiversityContribution, color: '#3b82f6' },
    { name: 'Evidence', value: breakdown.evidenceQualityContribution, color: '#6366f1' },
    { name: 'Citations', value: breakdown.citationQualityContribution, color: '#f59e0b' },
    { name: 'Objectivity', value: breakdown.objectivityContribution, color: '#ec4899' }
  ];

  const handleExport = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current, { backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = 'reliability-factor-breakdown.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={handleExport}
        className="absolute -top-12 right-0 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        title="Export as PNG"
      >
        <HiOutlineDownload className="w-5 h-5" />
      </button>
      <div ref={chartRef} className="h-64 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} width={80} />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24} animationDuration={1500}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const ExplainScoreModal = ({ isOpen, onClose, reliability }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Factor Breakdown</h2>
              <p className="text-slate-500 font-medium">Transparent scoring based on the Enterprise Rule Engine.</p>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800">
              <HiOutlineX className="w-6 h-6" />
            </button>
          </div>
          
          <div className="mb-8">
            <FactorBreakdownChart breakdown={reliability.breakdown} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <span className="block text-xs font-bold text-slate-500 uppercase">Algorithm Output</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {reliability.score}/100
              </span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <span className="block text-xs font-bold text-slate-500 uppercase">Confidence Level</span>
              <span className="text-lg font-bold text-slate-700 dark:text-slate-300">
                {reliability.level}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
