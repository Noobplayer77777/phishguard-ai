import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

const RecentFeed = ({ scans }) => {
  if (!scans || scans.length === 0) {
    return (
      <div className="glass-card p-6 text-center text-gray-500">
        No recent scans available.
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Safe':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <ShieldCheck className="w-3 h-3 mr-1" /> Safe
          </span>
        );
      case 'Suspicious':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <AlertTriangle className="w-3 h-3 mr-1" /> Suspicious
          </span>
        );
      case 'Phishing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <ShieldAlert className="w-3 h-3 mr-1" /> Phishing
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="glass-card overflow-hidden mt-6">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-cyber-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Detections Feed</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-cyber-700">
          <thead className="bg-gray-50 dark:bg-cyber-800/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">URL</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Result</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Risk Score</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-cyber-900/20 divide-y divide-gray-200 dark:divide-cyber-700">
            {scans.map((scan) => (
              <tr key={scan.id} className="hover:bg-gray-50 dark:hover:bg-cyber-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 max-w-xs truncate font-mono">
                  {scan.url}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(scan.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <span className="mr-2">{scan.risk_score}%</span>
                    <div className="w-16 h-1.5 rounded-full bg-gray-200 dark:bg-cyber-700">
                      <div 
                        className={`h-1.5 rounded-full ${scan.risk_score >= 65 ? 'bg-red-500' : scan.risk_score >= 30 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                        style={{ width: `${scan.risk_score}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
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
