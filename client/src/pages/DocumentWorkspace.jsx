import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiSearch, FiFileText, FiTrash2, FiMaximize2, FiMinimize2, FiLayers, FiInfo, FiList, FiTrendingUp } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';
import UploadModal from '../components/documents/UploadModal';
import DocumentComparison from '../components/documents/DocumentComparison';

const DocumentWorkspace = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [activeTab, setActiveTab] = useState('metadata'); // metadata, summaries, entities, claims, knowledge
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  useEffect(() => {
    fetchDocuments();
    // Poll for updates if any doc is processing
    const interval = setInterval(() => {
      setDocuments(prev => {
        if (prev.some(d => d.status === 'parsing' || d.status === 'extracting')) {
          fetchDocuments(false);
        }
        return prev;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDocuments = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await api.get('/documents');
      setDocuments(res.data.data);
    } catch (error) {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDocClick = async (doc) => {
    if (compareMode) {
      if (selectedForCompare.includes(doc._id)) {
        setSelectedForCompare(prev => prev.filter(id => id !== doc._id));
      } else {
        if (selectedForCompare.length >= 3) {
          toast.error('Maximum 3 documents can be compared at once.');
          return;
        }
        setSelectedForCompare(prev => [...prev, doc._id]);
      }
      return;
    }

    try {
      const res = await api.get(`/documents/${doc._id}`);
      setSelectedDoc(res.data.data);
    } catch (error) {
      toast.error('Failed to load document details');
    }
  };

  const deleteDocument = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this document?')) return;
    try {
      await api.delete(`/documents/${id}`);
      setDocuments(prev => prev.filter(d => d._id !== id));
      if (selectedDoc?._id === id) setSelectedDoc(null);
      toast.success('Document deleted');
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const renderStatus = (status) => {
    const map = {
      uploaded: { color: 'bg-slate-500', text: 'Uploaded' },
      parsing: { color: 'bg-amber-500 animate-pulse', text: 'Parsing Text' },
      extracting: { color: 'bg-blue-500 animate-pulse', text: 'Extracting AI Intelligence' },
      completed: { color: 'bg-emerald-500', text: 'Ready' },
      failed: { color: 'bg-red-500', text: 'Failed' }
    };
    const s = map[status] || map.uploaded;
    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${s.color}`} />
        <span className="text-xs text-slate-400 font-medium">{s.text}</span>
      </div>
    );
  };

  if (compareMode && selectedForCompare.length >= 2 && selectedDoc === 'COMPARE_VIEW') {
    return (
      <DocumentComparison 
        documentIds={selectedForCompare} 
        onBack={() => {
          setSelectedDoc(null);
          setCompareMode(false);
          setSelectedForCompare([]);
        }} 
      />
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-white dark:bg-slate-900">
      {/* Sidebar List */}
      <div className={`${selectedDoc ? 'w-1/3 border-r border-slate-200 dark:border-slate-800' : 'w-full'} flex flex-col bg-slate-50 dark:bg-slate-900 transition-all duration-300`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FiLayers className="text-indigo-600 dark:text-indigo-400" /> Document Intelligence
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Upload and analyze research materials</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setCompareMode(!compareMode);
                setSelectedForCompare([]);
                setSelectedDoc(null);
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                compareMode ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              Compare
            </button>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              <FiUpload /> Upload
            </button>
          </div>
        </div>

        {compareMode && (
          <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 border-b border-indigo-100 dark:border-indigo-500/20 flex justify-between items-center">
            <span className="text-sm text-indigo-700 dark:text-indigo-300">{selectedForCompare.length} selected for comparison</span>
            <button 
              disabled={selectedForCompare.length < 2}
              onClick={() => setSelectedDoc('COMPARE_VIEW')}
              className="px-3 py-1 bg-indigo-600 disabled:opacity-50 text-white rounded text-xs font-medium"
            >
              Run Comparison
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="text-center text-slate-500 py-10">Loading documents...</div>
          ) : documents.length === 0 ? (
            <div className="text-center text-slate-500 py-20 flex flex-col items-center">
              <FiFileText className="w-12 h-12 mb-4 opacity-50" />
              <p>No documents uploaded yet.</p>
              <p className="text-sm">Upload PDFs, DOCX, Images, and more to extract intelligence.</p>
            </div>
          ) : (
            documents.map(doc => (
              <motion.div
                key={doc._id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleDocClick(doc)}
                className={`p-4 rounded-xl cursor-pointer border transition-colors ${
                  selectedDoc?._id === doc._id 
                    ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-500/10 dark:border-indigo-500/30' 
                    : compareMode && selectedForCompare.includes(doc._id)
                    ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30'
                    : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 dark:bg-slate-800/50 dark:border-slate-700/50 dark:hover:bg-slate-800 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      compareMode && selectedForCompare.includes(doc._id) ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-slate-100 text-indigo-600 dark:bg-slate-700 dark:text-indigo-400'
                    }`}>
                      <FiFileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-slate-900 dark:text-slate-200 font-medium truncate" title={doc.metadata?.title}>{doc.metadata?.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{new Date(doc.createdAt).toLocaleDateString()} • {doc.metadata?.format?.split('/')[1]?.toUpperCase() || 'FILE'}</p>
                    </div>
                  </div>
                  <button onClick={(e) => deleteDocument(doc._id, e)} className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 p-1">
                    <FiTrash2 />
                  </button>
                </div>
                {renderStatus(doc.status)}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Workspace Viewer (Split View) */}
      {selectedDoc && selectedDoc !== 'COMPARE_VIEW' && (
        <div className="w-2/3 flex flex-col bg-slate-50 dark:bg-[#0f172a]">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
            {[
              { id: 'metadata', icon: FiInfo, label: 'Metadata' },
              { id: 'summaries', icon: FiList, label: 'Summaries' },
              { id: 'entities', icon: FiLayers, label: 'Entities' },
              { id: 'claims', icon: FiFileText, label: 'Claims' },
              { id: 'knowledge', icon: FiTrendingUp, label: 'Knowledge' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? 'border-indigo-600 text-indigo-700 bg-indigo-50 dark:border-indigo-500 dark:text-indigo-400 dark:bg-indigo-500/5' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-800/50'
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'metadata' && (
              <div className="space-y-6 max-w-3xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Title</span>
                    <p className="text-slate-900 dark:text-white mt-1">{selectedDoc.metadata?.title}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Author</span>
                    <p className="text-slate-900 dark:text-white mt-1">{selectedDoc.metadata?.author || 'Unknown'}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Format</span>
                    <p className="text-slate-900 dark:text-white mt-1">{selectedDoc.metadata?.format || 'Unknown'}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Language</span>
                    <p className="text-slate-900 dark:text-white mt-1">{selectedDoc.metadata?.language || 'Unknown'}</p>
                  </div>
                </div>
                {selectedDoc.content?.rawText && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2"><FiFileText /> Raw Extracted Text</h3>
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 max-h-96 overflow-y-auto text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono">
                      {selectedDoc.content.rawText}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'summaries' && (
              <div className="space-y-6 max-w-4xl">
                {selectedDoc.summaries?.executive && (
                  <div className="bg-indigo-50/50 dark:bg-slate-800/40 border border-indigo-200 dark:border-indigo-500/20 rounded-xl p-5">
                    <h3 className="text-indigo-700 dark:text-indigo-400 font-semibold mb-2">Executive Summary</h3>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedDoc.summaries.executive}</p>
                  </div>
                )}
                {selectedDoc.summaries?.technical && (
                  <div className="bg-emerald-50/50 dark:bg-slate-800/40 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-5">
                    <h3 className="text-emerald-700 dark:text-emerald-400 font-semibold mb-2">Technical Summary</h3>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedDoc.summaries.technical}</p>
                  </div>
                )}
                {selectedDoc.summaries?.bullets?.length > 0 && (
                  <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                    <h3 className="text-slate-900 dark:text-slate-300 font-semibold mb-3">Key Points</h3>
                    <ul className="space-y-2">
                      {selectedDoc.summaries.bullets.map((b, i) => (
                        <li key={i} className="flex gap-3 text-slate-700 dark:text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                          <span className="leading-relaxed">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'entities' && (
              <div className="max-w-4xl">
                {selectedDoc.entities?.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedDoc.entities.map((ent, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg p-3 flex justify-between items-center">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate" title={ent.name}>{ent.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{ent.type}</p>
                        </div>
                        <span className="text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 px-2 py-1 rounded-full">{ent.mentions}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-slate-500 dark:text-slate-400">No entities extracted.</p>}
              </div>
            )}

            {activeTab === 'claims' && (
              <div className="max-w-4xl space-y-4">
                {selectedDoc.claims?.length > 0 ? (
                  selectedDoc.claims.map((claim, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 flex gap-4">
                      <div className="shrink-0 pt-1">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 mb-2 inline-block">
                          {claim.category || 'Fact'}
                        </span>
                        <p className="text-slate-800 dark:text-slate-200 font-medium mb-2">{claim.text}</p>
                        {claim.location?.context && (
                          <div className="mt-3 pl-3 border-l-2 border-slate-200 dark:border-slate-700">
                            <p className="text-xs text-slate-500 font-mono">Context: "{claim.location.context}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : <p className="text-slate-500 dark:text-slate-400">No claims extracted.</p>}
              </div>
            )}

            {activeTab === 'knowledge' && (
              <div className="max-w-4xl space-y-6">
                {selectedDoc.insights?.findings?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Key Findings</h3>
                    <ul className="list-disc pl-5 text-slate-700 dark:text-slate-300 space-y-1">
                      {selectedDoc.insights.findings.map((f, idx) => <li key={idx}>{f}</li>)}
                    </ul>
                  </div>
                )}
                
                {selectedDoc.knowledge?.definitions?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Extracted Definitions</h3>
                    <div className="grid gap-3">
                      {selectedDoc.knowledge.definitions.map((def, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50">
                          <span className="font-semibold text-indigo-600 dark:text-indigo-400">{def.term}:</span> <span className="text-slate-700 dark:text-slate-300">{def.definition}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDoc.insights?.gaps?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-400 mb-3">Research Gaps Detected</h3>
                    <ul className="list-disc pl-5 text-amber-700/80 dark:text-amber-200/70 space-y-1">
                      {selectedDoc.insights.gaps.map((g, idx) => <li key={idx}>{g}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onUploadComplete={() => fetchDocuments(false)} 
      />
    </div>
  );
};

export default DocumentWorkspace;
