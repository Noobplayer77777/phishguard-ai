import React from 'react';

const PrivacyProtocol = () => {
  return (
    <div className="px-6 py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-primary-container">Privacy Protocol</h1>
      <p className="text-on-surface mb-2">
        We do not store any personal data submitted through the URL analysis. All processing occurs in memory and results are discarded after the response.
      </p>
      <p className="text-on-surface mb-2">
        Uploaded CSV files for batch analysis are processed on the server and deleted immediately after the analysis completes.
      </p>
      <p className="text-on-surface">
        For more details, see our <a href="/docs" className="text-primary-container underline">API documentation</a>.
      </p>
    </div>
  );
};

export default PrivacyProtocol;
