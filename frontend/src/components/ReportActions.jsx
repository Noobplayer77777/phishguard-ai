import React, { useState } from 'react';
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
    <div className="flex flex-wrap gap-4">
      <button 
        onClick={handleCopy}
        className="arcade-btn-secondary px-4 py-2 font-label-sm text-xs flex items-center gap-2 select-none"
      >
        <span className="material-symbols-outlined text-[18px]">
          {copied ? 'check' : 'content_copy'}
        </span>
        {copied ? 'COPIED' : 'COPY'}
      </button>
      
      <button 
        onClick={handleDownloadJSON}
        className="arcade-btn-secondary px-4 py-2 font-label-sm text-xs flex items-center gap-2 select-none"
      >
        <span className="material-symbols-outlined text-[18px]">download</span>
        EXPORT JSON
      </button>
      
      <button 
        onClick={handleExportPDF}
        disabled={downloading}
        className="arcade-btn px-4 py-2 font-label-sm text-xs flex items-center gap-2 select-none"
      >
        <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
        {downloading ? 'EXPORTING...' : 'EXPORT PDF'}
      </button>
      
      {navigator.share && (
        <button 
          onClick={handleShare}
          className="arcade-btn-secondary px-4 py-2 font-label-sm text-xs flex items-center gap-2 select-none"
        >
          <span className="material-symbols-outlined text-[18px]">share</span>
          SHARE
        </button>
      )}
    </div>
  );
};

export default ReportActions;

