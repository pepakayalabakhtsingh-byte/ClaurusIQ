import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiX, FiFileText, FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const UploadModal = ({ isOpen, onClose, onUploadComplete }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => file.size <= 50 * 1024 * 1024);
    if (validFiles.length < newFiles.length) {
      toast.error('Some files exceed the 50MB limit and were skipped.');
    }
    
    const mapped = validFiles.map(f => ({
      file: f,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending', // pending, uploading, success, error
      progress: 0
    }));
    
    setFiles(prev => [...prev, ...mapped]);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;
    setUploading(true);

    let allSuccess = true;

    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'success') continue;

      setFiles(prev => prev.map(f => f.id === files[i].id ? { ...f, status: 'uploading', progress: 10 } : f));
      
      const formData = new FormData();
      formData.append('document', files[i].file);

      try {
        await api.post('/documents/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setFiles(prev => prev.map(f => f.id === files[i].id ? { ...f, progress: percentCompleted } : f));
          }
        });

        setFiles(prev => prev.map(f => f.id === files[i].id ? { ...f, status: 'success', progress: 100 } : f));
      } catch (error) {
        console.error('Upload error:', error);
        allSuccess = false;
        setFiles(prev => prev.map(f => f.id === files[i].id ? { ...f, status: 'error' } : f));
        toast.error(`Failed to upload ${files[i].file.name}`);
      }
    }

    setUploading(false);
    if (allSuccess) {
      toast.success('All documents uploaded and processing started.');
      setTimeout(() => {
        onUploadComplete();
        onClose();
        setFiles([]);
      }, 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Upload Documents</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" disabled={uploading}>
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto">
            {/* Drag Drop Zone */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors ${
                dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 hover:border-slate-500 bg-slate-800/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleChange}
                accept=".pdf,.docx,.txt,.md,.csv,.html,.pptx,.json,.png,.jpg,.jpeg,.webp,.tiff"
              />
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-indigo-400 shadow-inner">
                <FiUploadCloud className="w-8 h-8" />
              </div>
              <p className="text-white font-medium mb-1">Drag & drop your files here</p>
              <p className="text-slate-400 text-sm mb-4">Support for PDF, DOCX, TXT, CSV, Images (Max 50MB)</p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors"
                disabled={uploading}
              >
                Browse Files
              </button>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="text-sm font-medium text-slate-300">Selected Files</h4>
                {files.map(fileObj => (
                  <div key={fileObj.id} className="bg-slate-800 rounded-lg p-3 flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-slate-700 flex items-center justify-center text-indigo-400 shrink-0">
                      <FiFileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{fileObj.file.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-1.5 flex-1 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${fileObj.status === 'error' ? 'bg-red-500' : 'bg-indigo-500'}`}
                            style={{ width: `${fileObj.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400 w-8">{fileObj.progress}%</span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {fileObj.status === 'pending' && (
                        <button onClick={() => removeFile(fileObj.id)} className="text-slate-400 hover:text-red-400" disabled={uploading}>
                          <FiX />
                        </button>
                      )}
                      {fileObj.status === 'uploading' && <FiLoader className="text-indigo-400 animate-spin" />}
                      {fileObj.status === 'success' && <FiCheckCircle className="text-emerald-400" />}
                      {fileObj.status === 'error' && <FiAlertCircle className="text-red-400" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-300 hover:text-white transition-colors text-sm font-medium"
              disabled={uploading}
            >
              Cancel
            </button>
            <button 
              onClick={uploadFiles}
              disabled={files.length === 0 || uploading || files.every(f => f.status === 'success')}
              className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              {uploading ? 'Uploading...' : 'Upload & Process'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UploadModal;
