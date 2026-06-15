import React, { useState, useRef } from 'react';
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
    if (selectedFile && (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv'))) {
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
    if (droppedFile && (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv'))) {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface pixel-border w-full max-w-2xl flex flex-col max-h-[90vh] relative z-[101]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b-2 border-surface-container-highest">
          <h2 className="text-xl font-bold text-primary-container flex items-center gap-2 select-none">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>upload_file</span>
            BULK CSV ANALYSIS
          </h2>
          <button onClick={handleClose} className="text-on-surface-variant hover:text-primary-container transition-colors flex items-center">
            <span className="material-symbols-outlined text-2xl select-none">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow bg-surface-container-lowest/30">
          {!result && (
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed p-10 text-center transition-colors select-none
                ${file ? 'border-primary-container bg-primary-container/5' : 'border-surface-container-highest hover:border-primary-container'}`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".csv" 
                className="hidden" 
              />
              
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-surface-container-high border-2 border-surface-container-highest">
                  <span className="material-symbols-outlined text-4xl text-primary-container">file_open</span>
                </div>
                
                {file ? (
                  <div>
                    <p className="text-lg font-bold text-on-surface font-mono">{file.name}</p>
                    <p className="text-xs text-matrix-green mt-1 font-mono uppercase tracking-widest">[ READY FOR TRANSMISSION ]</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-bold text-on-surface">DRAG & DROP CSV FILE HERE</p>
                    <p className="text-xs text-on-surface-variant mt-1 mb-4 select-none">OR CLICK BELOW TO SEARCH FILESYSTEM</p>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="arcade-btn-secondary px-6 py-2 font-label-sm text-xs"
                    >
                      BROWSE FILES
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-on-surface-variant max-w-sm mt-4 select-none italic">
                  Note: The first column must contain the URLs. Maximum limit of 100 URLs per scan.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-glitch-red/10 border-2 border-glitch-red text-glitch-red font-mono text-xs">
              &gt; ERROR: {error}
            </div>
          )}

          {result && (
            <div className="animate-in fade-in duration-300">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-matrix-green/5 border-2 border-matrix-green p-4 text-center">
                  <span className="material-symbols-outlined text-3xl text-matrix-green mb-1 select-none">verified</span>
                  <div className="text-2xl font-bold text-matrix-green font-mono">{result.counts.Safe}</div>
                  <div className="text-[10px] font-bold uppercase text-matrix-green select-none">Safe</div>
                </div>
                <div className="bg-gold-warning/5 border-2 border-gold-warning p-4 text-center">
                  <span className="material-symbols-outlined text-3xl text-gold-warning mb-1 select-none">warning</span>
                  <div className="text-2xl font-bold text-gold-warning font-mono">{result.counts.Suspicious}</div>
                  <div className="text-[10px] font-bold uppercase text-gold-warning select-none">Alert</div>
                </div>
                <div className="bg-glitch-red/5 border-2 border-glitch-red p-4 text-center">
                  <span className="material-symbols-outlined text-3xl text-glitch-red mb-1 select-none">gpp_bad</span>
                  <div className="text-2xl font-bold text-glitch-red font-mono">{result.counts.Phishing}</div>
                  <div className="text-[10px] font-bold uppercase text-glitch-red select-none">Threat</div>
                </div>
              </div>

              <h3 className="font-bold text-on-surface mb-3 flex justify-between items-center select-none font-label-sm">
                <span>BATCH TELEMETRY RESULTS</span>
                <span className="text-xs text-primary-container font-mono">{result.total_processed} PROCESSED</span>
              </h3>
              <div className="border-2 border-surface-container-highest">
                <div className="max-h-60 overflow-y-auto">
                  <table className="min-w-full divide-y-2 divide-surface-container-highest">
                    <thead className="bg-surface-container-lowest sticky top-0 font-label-sm text-label-sm text-on-surface-variant">
                      <tr>
                        <th className="px-4 py-2 text-left uppercase">URL</th>
                        <th className="px-4 py-2 text-left uppercase w-28">Verdict</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-highest font-mono text-sm">
                      {result.results.map((r, i) => (
                        <tr key={i} className="hover:bg-surface-container-low transition-colors">
                          <td className="px-4 py-2 text-on-surface truncate max-w-[250px] font-mono">{r.url}</td>
                          <td className="px-4 py-2">
                            <span className={`inline-block px-2 py-0.5 border text-xs font-bold uppercase select-none
                              ${r.status === 'Safe' ? 'border-matrix-green text-matrix-green' : 
                                r.status === 'Phishing' ? 'border-glitch-red text-glitch-red' : 
                                r.status === 'Error' ? 'border-outline text-outline' :
                                'border-gold-warning text-gold-warning'}`}>
                              {r.status === 'Safe' ? 'SAFE' : 
                               r.status === 'Phishing' ? 'THREAT' : 
                               r.status === 'Error' ? 'ERROR' : 'ALERT'}
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

        {/* Footer */}
        <div className="p-4 border-t-2 border-surface-container-highest bg-surface-container-lowest/80 flex justify-end gap-3">
          {result ? (
            <button
              onClick={handleClose}
              className="arcade-btn px-6 py-2 font-label-sm text-xs"
            >
              DONE
            </button>
          ) : (
            <>
              <button
                onClick={handleClose}
                disabled={loading}
                className="arcade-btn-secondary px-5 py-2 font-label-sm text-xs"
              >
                CANCEL
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="arcade-btn px-6 py-2 font-label-sm text-xs flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                    PROCESSING...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">send</span>
                    ANALYZE BATCH
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchUploadModal;

