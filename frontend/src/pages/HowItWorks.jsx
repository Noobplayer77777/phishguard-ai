import React from 'react';

const HowItWorks = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">How PhishGuard AI Works</h1>
      <p className="mb-4">
        PhishGuard AI leverages advanced language models to analyze URLs and detect phishing attempts in real time. Users can submit a single URL or upload a CSV file with many URLs for bulk analysis.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Core Workflow</h2>
      <ol className="list-decimal list-inside mb-4">
        <li>Fetch the URL content (HTML, scripts, metadata).</li>
        <li>Extract key features (domain, title, links, suspicious keywords).</li>
        <li>Run the text through a fine‑tuned LLM that classifies the request as <b>phishing</b> or <b>safe</b>.</li>
        <li>Return a detailed report with confidence scores and suggested mitigations.</li>
      </ol>
      <h2 className="text-2xl font-semibold mb-2">Why It’s Effective</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Trained on thousands of real phishing URLs.</li>
        <li>Continuously updated threat database.</li>
        <li>Runs locally in the browser‑frontend + Flask‑backend for fast responses.</li>
      </ul>
      <p>
        For more technical details, see the <a href="/docs" className="text-primary-container underline">API Docs</a>.
      </p>
    </div>
  );
};

export default HowItWorks;
