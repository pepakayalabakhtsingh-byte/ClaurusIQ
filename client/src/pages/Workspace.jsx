import { useState, useEffect } from 'react';
import { HiOutlineDocumentText, HiOutlineDownload, HiOutlineChartPie, HiOutlineShare } from 'react-icons/hi';
import api from '../services/api';
import ExecutiveSummaryPanel from '../components/workspace/ExecutiveSummaryPanel';
import KnowledgeGraph from '../components/workspace/KnowledgeGraph';

const Workspace = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    fetchLatestReport();
  }, []);

  const fetchLatestReport = async () => {
    try {
      // Find the most recently completed workflow
      const workflowRes = await api.get('/workflow');
      const latestCompleted = workflowRes.data.data.find(w => w.status === 'completed');
      
      if (latestCompleted) {
        const reportRes = await api.get(`/reports/workflow/${latestCompleted._id}`);
        setReport(reportRes.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch report', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await api.post(`/reports/workflow/${report.workflowId}/export/${format}`, {}, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ClaurusIQ-Report.${format}`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(`Export ${format} failed`, error);
    }
  };

  if (loading) {
    return (
      <div className="p-8 h-full flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Loading Executive Intelligence Workspace...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-8 text-center text-slate-500">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Reports Available</h2>
        <p>Run a new research workflow to generate an executive intelligence report.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Workspace Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-1">
            Executive Intelligence Workspace
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Interactive research analysis and automated reporting.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => handleExport('pdf')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <HiOutlineDownload className="w-5 h-5" /> PDF
          </button>
          <button onClick={() => handleExport('docx')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <HiOutlineDocumentText className="w-5 h-5" /> DOCX
          </button>
          <button onClick={() => handleExport('ppt')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <HiOutlineShare className="w-5 h-5" /> PPTX
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-900 px-6 border-b border-slate-200 dark:border-slate-800 flex gap-6">
        <button 
          onClick={() => setActiveTab('summary')}
          className={`py-4 font-bold border-b-2 transition-colors ${activeTab === 'summary' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Executive Summary
        </button>
        <button 
          onClick={() => setActiveTab('graph')}
          className={`py-4 font-bold border-b-2 transition-colors ${activeTab === 'graph' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Knowledge Graph
        </button>
      </div>

      {/* Workspace Body */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto h-full">
          {activeTab === 'summary' && <ExecutiveSummaryPanel report={report} />}
          {activeTab === 'graph' && <KnowledgeGraph />}
        </div>
      </div>
    </div>
  );
};

export default Workspace;
