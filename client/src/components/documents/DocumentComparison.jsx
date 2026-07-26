import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiCheckCircle, FiAlertTriangle, FiInfo, FiActivity } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const DocumentComparison = ({ documentIds, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [comparison, setComparison] = useState(null);

  useEffect(() => {
    const runCompare = async () => {
      try {
        const res = await api.post('/documents/compare', { documentIds });
        setComparison(res.data.data);
      } catch (error) {
        toast.error('Failed to compare documents');
        onBack();
      } finally {
        setLoading(false);
      }
    };
    runCompare();
  }, [documentIds, onBack]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0f172a] h-[calc(100vh-4rem)]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-white">Comparing {documentIds.length} Documents</h2>
        <p className="text-slate-400 mt-2">Our AI is analyzing claims, entities, and summaries across the selected documents...</p>
      </div>
    );
  }

  if (!comparison) return null;

  return (
    <div className="flex-1 flex flex-col bg-[#0f172a] h-[calc(100vh-4rem)] overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
            <FiArrowLeft />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Document Comparison Analysis
            </h1>
            <p className="text-sm text-slate-400">Cross-referencing {documentIds.length} sources</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
          <span className="text-sm text-slate-400">Similarity Score</span>
          <div className="text-xl font-bold text-indigo-400">{comparison.overallSimilarityScore}%</div>
        </div>
      </div>

      <div className="p-8 max-w-5xl mx-auto w-full space-y-8">
        
        {/* Contradictions */}
        {comparison.contradictions?.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FiAlertTriangle className="text-red-400" /> Contradictions & Conflicts
            </h2>
            <div className="grid gap-4">
              {comparison.contradictions.map((c, i) => (
                <div key={i} className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-red-400 font-medium">{c.topic}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      c.severity === 'High' ? 'bg-red-500 text-white' : 'bg-red-500/20 text-red-300'
                    }`}>{c.severity} Severity</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                      <span className="text-xs text-slate-400 uppercase">Document 1 Stance</span>
                      <p className="text-slate-200 text-sm mt-1">{c.doc1_stance}</p>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                      <span className="text-xs text-slate-400 uppercase">Document 2 Stance</span>
                      <p className="text-slate-200 text-sm mt-1">{c.doc2_stance}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Agreements */}
        {comparison.agreements?.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FiCheckCircle className="text-emerald-400" /> Shared Agreements
            </h2>
            <div className="grid gap-3">
              {comparison.agreements.map((a, i) => (
                <div key={i} className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex gap-4 items-start">
                  <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <div>
                    <h3 className="text-emerald-300 font-medium mb-1">{a.topic}</h3>
                    <p className="text-slate-300 text-sm">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Unique Insights */}
        {comparison.uniqueInsights?.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FiActivity className="text-blue-400" /> Unique Insights
            </h2>
            <div className="grid gap-3">
              {comparison.uniqueInsights.map((u, i) => (
                <div key={i} className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                  <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">{u.document}</span>
                  <p className="text-slate-300 text-sm mt-2">{u.insight}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Missing Info */}
        {comparison.missingInformation?.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FiInfo className="text-amber-400" /> Missing Information & Blind Spots
            </h2>
            <ul className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 space-y-2 list-disc list-inside">
              {comparison.missingInformation.map((m, i) => (
                <li key={i} className="text-amber-200/80 text-sm">{m}</li>
              ))}
            </ul>
          </section>
        )}

      </div>
    </div>
  );
};

export default DocumentComparison;
