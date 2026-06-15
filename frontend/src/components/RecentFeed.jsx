import React from 'react';

const RecentFeed = ({ scans }) => {
  if (!scans || scans.length === 0) {
    return (
      <div className="bg-surface pixel-border p-6 text-center text-on-surface-variant font-label-md select-none">
        &gt; NO RECENT TELEMETRY DATA DETECTED.
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Safe':
        return (
          <span className="inline-flex items-center px-2 py-0.5 border-2 border-matrix-green text-matrix-green text-xs font-bold uppercase select-none">
            [ SAFE ]
          </span>
        );
      case 'Suspicious':
        return (
          <span className="inline-flex items-center px-2 py-0.5 border-2 border-gold-warning text-gold-warning text-xs font-bold uppercase select-none">
            [ ALERT ]
          </span>
        );
      case 'Phishing':
        return (
          <span className="inline-flex items-center px-2 py-0.5 border-2 border-glitch-red text-glitch-red text-xs font-bold uppercase select-none">
            [ THREAT ]
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 border-2 border-outline text-outline text-xs font-bold uppercase select-none">
            [ UNKNOWN ]
          </span>
        );
    }
  };

  return (
    <div className="bg-surface pixel-border overflow-hidden mt-6">
      <div className="px-6 py-4 border-b-2 border-surface-container-highest flex items-center justify-between">
        <h3 className="text-lg font-bold text-primary-container flex items-center gap-2 select-none">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
          RECENT DETECTIONS TELEMETRY
        </h3>
        <span className="text-[10px] text-on-surface-variant font-mono">FEED_UPDATED_LIVE</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-surface-container-highest">
          <thead className="bg-surface-container-lowest font-label-sm text-label-sm text-on-surface-variant">
            <tr>
              <th scope="col" className="px-6 py-3 text-left uppercase tracking-wider select-none">Target URL</th>
              <th scope="col" className="px-6 py-3 text-left uppercase tracking-wider select-none">Verdict</th>
              <th scope="col" className="px-6 py-3 text-left uppercase tracking-wider select-none">Threat Level</th>
              <th scope="col" className="px-6 py-3 text-left uppercase tracking-wider select-none">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-highest font-mono text-sm">
            {scans.map((scan) => (
              <tr key={scan.id} className="hover:bg-surface-container-low transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-on-surface max-w-xs truncate font-mono">
                  {scan.url}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(scan.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-on-surface">
                  <div className="flex items-center gap-2">
                    <span className="font-bold w-10 text-right">{scan.risk_score}%</span>
                    <div className="w-24 h-3 bg-surface-container-lowest border border-surface-container-highest">
                      <div 
                        className={`h-full ${scan.risk_score >= 65 ? 'bg-glitch-red' : scan.risk_score >= 30 ? 'bg-gold-warning' : 'bg-matrix-green'}`} 
                        style={{ width: `${scan.risk_score}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-on-surface-variant text-xs">
                  {new Date(scan.scan_date).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentFeed;

