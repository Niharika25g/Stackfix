import React, { useState } from 'react';

function App() {
  const [logText, setLogText] = useState('');
  const [language, setLanguage] = useState('python');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!logText.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ log_text: logText, language }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze error. Check backend logs.');
      }

      const data = await response.json();
      setResult(data);

      // Add to history stack
      const newItem = {
        id: Date.now(),
        language,
        logText,
        result: data,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setHistory(prev => [newItem, ...prev.slice(0, 4)]); // Keep last 5

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (result && result.corrected_code) {
      navigator.clipboard.writeText(result.corrected_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportMarkdown = () => {
    if (!result) return;
    const mdContent = `# StackFix Diagnostic Report\n\n**Language:** ${language}\n**Timestamp:** ${new Date().toLocaleString()}\n\n## Root Cause\n${result.root_cause}\n\n## Corrected Code\n\`\`\`${language}\n${result.corrected_code}\n\`\`\`\n\n## Prevention Tip\n${result.prevention_tip}\n`;
    
    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stackfix-report-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSelectHistoryItem = (item) => {
    setLanguage(item.language);
    setLogText(item.logText);
    setResult(item.result);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 border-b border-slate-800 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-indigo-400">StackFix ⚡</h1>
            <p className="text-slate-400 text-sm mt-1">AI-powered error intelligence and automated code patch generator.</p>
          </div>
          {history.length > 0 && (
            <div className="text-xs text-slate-400">
              Session Fixes: <span className="font-bold text-indigo-400">{history.length}</span>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col">
            <h2 className="text-lg font-semibold mb-3 text-slate-200">Paste Error Log</h2>
            <form onSubmit={handleAnalyze} className="flex flex-col flex-grow">
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-400 mb-1">Language</label>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript / TypeScript</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>

              <div className="flex-grow mb-4 flex flex-col">
                <label className="block text-xs font-medium text-slate-400 mb-1">Stack Trace / Log Text</label>
                <textarea 
                  rows="8"
                  value={logText}
                  onChange={(e) => setLogText(e.target.value)}
                  placeholder="Paste your messy traceback or error log here..."
                  className="w-full flex-grow bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                {loading ? 'Analyzing Error...' : 'Diagnose & Fix 🚀'}
              </button>
            </form>

            {/* History Sidebar list */}
            {history.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recent Fixes</h3>
                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectHistoryItem(item)}
                      className="text-left text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 p-2 rounded-lg transition-colors truncate flex justify-between items-center text-slate-300"
                    >
                      <span className="truncate pr-2 font-mono">[{item.language}] {item.logText.slice(0, 25)}...</span>
                      <span className="text-slate-500 text-[10px]">{item.time}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-slate-200">AI Diagnostic Report</h2>
              {result && (
                <button
                  onClick={handleExportMarkdown}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg transition-colors border border-slate-700 flex items-center gap-1.5"
                >
                  📥 Export Report (.md)
                </button>
              )}
            </div>
            
            {error && (
              <div className="bg-red-950/50 border border-red-800 text-red-300 p-3 rounded-lg text-xs mb-4">
                {error}
              </div>
            )}

            {!result && !loading && !error && (
              <div className="flex-grow flex items-center justify-center text-slate-600 text-sm text-center border border-dashed border-slate-800 rounded-lg p-12">
                Paste an error log on the left and click diagnose to view root-cause analysis, patches, and prevention tips.
              </div>
            )}

            {loading && (
              <div className="flex-grow flex items-center justify-center text-indigo-400 text-sm py-20">
                Analyzing stack trace structure...
              </div>
            )}

            {result && (
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[550px]">
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Root Cause</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{result.root_cause}</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 relative">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Corrected Code</h3>
                    <button 
                      onClick={handleCopyCode}
                      className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded transition-colors"
                    >
                      {copied ? '✅ Copied!' : '📋 Copy Code'}
                    </button>
                  </div>
                  <pre className="text-xs font-mono text-emerald-200 overflow-x-auto p-3 bg-slate-900 rounded border border-slate-800/60">
                    {result.corrected_code}
                  </pre>
                </div>

                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Prevention Tip</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{result.prevention_tip}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;