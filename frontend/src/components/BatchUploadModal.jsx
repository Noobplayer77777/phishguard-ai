import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Loader2, ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useBatchAnalyze } from '../hooks/useBatchAnalyze';

const BatchUploadModal = ({ isOpen, onClose, onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const { analyzeBatch, loading, error, result, reset } = useBatchAnalyze();

  if (!isOpen) return null;

  const handleClose = () => {
    setFile(null);
    reset();
    onClose();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      reset();
    } else if (selectedFile) {
      alert("Please select a valid CSV file");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      setFile(droppedFile);
      reset();
    } else if (droppedFile) {
      alert("Please drop a valid CSV file");
    }
  };

  const handleUpload = async () => {
    if (file) {
      try {
        await analyzeBatch(file);
        if (onUploadComplete) onUploadComplete();
      } catch (e) {
        // Error handled by hook
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-cyber-900 border border-gray-200 dark:border-cyber-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-cyber-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Upload className="mr-2 h-5 w-5 text-cyber-blue" /> Bulk CSV Analysis
          </h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          {!result && (
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors
                ${file ? 'border-cyber-blue bg-blue-50 dark:bg-blue-900/10' : 'border-gray-300 dark:border-cyber-700 hover:border-cyber-blue dark:hover:border-cyber-blue'}`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".csv" 
                className="hidden" 
              />
              
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-gray-100 dark:bg-cyber-800 rounded-full">
                  <FileText className="h-10 w-10 text-cyber-blue" />
                </div>
                
                {file ? (
                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{file.name}</p>
                    <p className="text-sm text-gray-500 mt-1">Ready to analyze</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">Drag & drop your CSV file here</p>
                    <p className="text-sm text-gray-500 mt-1 mb-4">or click below to browse</p>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-gray-200 dark:bg-cyber-800 hover:bg-gray-300 dark:hover:bg-cyber-700 text-gray-800 dark:text-white font-medium rounded-lg transition-colors"
                    >
                      Browse Files
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-400 max-w-sm mt-4">
                  Note: The first column should contain the URLs. Maximum 100 URLs per batch.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              <AlertTriangle className="h-4 w-4 inline mr-2" /> {error}
            </div>
          )}

          {result && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/50 p-4 rounded-xl text-center">
                  <ShieldCheck className="h-8 w-8 mx-auto text-green-500 mb-2" />
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{result.counts.Safe}</div>
                  <div className="text-xs font-medium uppercase text-green-700 dark:text-green-500">Safe</div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/50 p-4 rounded-xl text-center">
                  <AlertTriangle className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{result.counts.Suspicious}</div>
                  <div className="text-xs font-medium uppercase text-yellow-700 dark:text-yellow-500">Suspicious</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 p-4 rounded-xl text-center">
                  <ShieldAlert className="h-8 w-8 mx-auto text-red-500 mb-2" />
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{result.counts.Phishing}</div>
                  <div className="text-xs font-medium uppercase text-red-700 dark:text-red-500">Phishing</div>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Batch Results ({result.total_processed} processed)</h3>
              <div className="border border-gray-200 dark:border-cyber-700 rounded-xl overflow-hidden">
                <div className="max-h-60 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-cyber-700">
                    <thead className="bg-gray-50 dark:bg-cyber-800 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">URL</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 w-24">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-cyber-900 divide-y divide-gray-100 dark:divide-cyber-800">
                      {result.results.map((r, i) => (
                        <tr key={i}>
                          <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200 truncate max-w-[250px] font-mono">{r.url}</td>
                          <td className="px-4 py-2 text-sm">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium 
                              ${r.status === 'Safe' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                                r.status === 'Phishing' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                                r.status === 'Error' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' :
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-cyber-800 bg-gray-50 dark:bg-cyber-800/50 flex justify-end space-x-3">
          {result ? (
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-cyber-blue hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Done
            </button>
          ) : (
            <>
              <button
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-cyber-700 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className={`flex items-center px-6 py-2 bg-cyber-blue hover:bg-blue-600 text-white font-medium rounded-lg transition-colors ${(loading || !file) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? <><Loader2 className="animate-spin h-4 w-4 mr-2" /> Processing...</> : 'Analyze Batch'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchUploadModal;
