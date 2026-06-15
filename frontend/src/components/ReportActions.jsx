import React, { useState } from 'react';
import { Download, Copy, Share2, Check } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ReportActions = ({ result }) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCopy = () => {
    const reportText = `
PhishGuard AI Scan Report
-------------------------
URL: ${result.url}
Status: ${result.status}
Risk Score: ${result.risk_score}%
Category: ${result.category || 'N/A'}

Reasons:
${result.reasons.map(r => `- ${r.detector}: ${r.reason}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `security_report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleExportPDF = async () => {
    setDownloading(true);
    try {
      const element = document.getElementById('results-card');
      if (element) {
        // We use html2canvas to take a snapshot of the results card
        // Note: in dark mode, taking screenshots of DOM elements can sometimes have background issues
        // so we save the current theme class, force light mode if needed, take shot, and restore.
        // For simplicity here, we just take it as is.
        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
        pdf.save(`PhishGuard_Report_${Date.now()}.pdf`);
      }
    } catch (err) {
      console.error("PDF Export failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'PhishGuard AI Security Report',
      text: `Security scan result for ${result.url}: ${result.status} (${result.risk_score}% Risk).`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button 
        onClick={handleCopy}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-cyber-800 dark:text-gray-300 dark:border-cyber-600 dark:hover:bg-cyber-700 transition-colors"
      >
        {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
      
      <button 
        onClick={handleDownloadJSON}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-cyber-800 dark:text-gray-300 dark:border-cyber-600 dark:hover:bg-cyber-700 transition-colors"
      >
        <Download className="w-4 h-4 mr-2" />
        JSON Report
      </button>
      
      <button 
        onClick={handleExportPDF}
        disabled={downloading}
        className={`flex items-center px-4 py-2 text-sm font-medium text-white bg-cyber-blue border border-transparent rounded-lg hover:bg-blue-600 transition-colors shadow-sm ${downloading ? 'opacity-70 cursor-wait' : ''}`}
      >
        <Download className="w-4 h-4 mr-2" />
        {downloading ? 'Exporting...' : 'Export PDF'}
      </button>
      
      {navigator.share && (
        <button 
          onClick={handleShare}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-cyber-800 dark:text-gray-300 dark:border-cyber-600 dark:hover:bg-cyber-700 transition-colors"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </button>
      )}
    </div>
  );
};

export default ReportActions;
