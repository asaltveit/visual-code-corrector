import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SandboxedPreview } from './SandboxedPreview';
import { useMultiModalRefactor } from '../hooks/useMultiModalRefactor';
import { Spinner } from './Spinner';
import { Play, RotateCcw, Code2, ArrowLeft, Sparkles, Copy, Check, X } from 'lucide-react';

const DEFAULT_TEMPLATE = `// React Component Sandbox
// Write your component code here. The component will be automatically rendered below.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// Example component - replace with your own
function MyComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-slate-800 mb-4">
        React Component Sandbox
      </h1>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-slate-600 mb-2">Counter: <span className="font-bold text-indigo-600">{count}</span></p>
          <div className="flex gap-2">
            <button
              onClick={() => setCount(count + 1)}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            >
              Increment
            </button>
            <button
              onClick={() => setCount(count - 1)}
              className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors"
            >
              Decrement
            </button>
            <button
              onClick={() => setCount(0)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-slate-500">
            Edit the code above to create your own component!
          </p>
        </div>
      </div>
    </div>
  );
}

// Export your component (use App, Component, or Example as the name)
const App = MyComponent;
`;

export const ComponentSandbox: React.FC = () => {
  const [code, setCode] = useState(DEFAULT_TEMPLATE);
  const [previewCode, setPreviewCode] = useState(DEFAULT_TEMPLATE);
  const [isRunning, setIsRunning] = useState(true);
  const [showRefactored, setShowRefactored] = useState(false);
  const [copied, setCopied] = useState(false);

  const { 
    isLoading, 
    error, 
    executePipeline, 
    currentItem,
    setError 
  } = useMultiModalRefactor();

  const handleRun = () => {
    setPreviewCode(code);
    setIsRunning(true);
    setShowRefactored(false);
  };

  const handleReset = () => {
    setCode(DEFAULT_TEMPLATE);
    setPreviewCode(DEFAULT_TEMPLATE);
    setIsRunning(true);
    setShowRefactored(false);
  };

  const handleRefactor = async () => {
    if (!code.trim()) return;
    await executePipeline(code);
    setShowRefactored(true);
  };

  const handleApplyRefactored = () => {
    if (currentItem?.refactorResult?.refactoredCode) {
      setCode(currentItem.refactorResult.refactoredCode);
      setPreviewCode(currentItem.refactorResult.refactoredCode);
      setShowRefactored(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const refactoredCode = currentItem?.refactorResult?.refactoredCode || null;

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Back</span>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Code2 className="text-indigo-600" size={28} />
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
                    React Component Sandbox
                  </span>
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Test and preview React components in real-time
                </p>
              </div>
            </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
            >
              <RotateCcw size={16} />
              Reset
            </button>
            <button
              onClick={handleRefactor}
              disabled={isLoading || !code.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              {isLoading ? <Spinner /> : <Sparkles size={16} />}
              {isLoading ? 'Refactoring...' : 'Refactor & Clean'}
            </button>
            <button
              onClick={handleRun}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              <Play size={16} />
              Run
            </button>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 mt-4 flex items-center justify-between shrink-0">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-2 gap-6 p-6 overflow-hidden">
        {/* Code Editor */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0">
            <h2 className="text-sm font-semibold text-slate-700">
              {showRefactored && refactoredCode ? 'Refactored Code' : 'Component Code'}
            </h2>
            <div className="flex items-center gap-2">
              {refactoredCode && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowRefactored(!showRefactored)}
                    className={`text-xs px-2 py-1 rounded transition-colors ${
                      showRefactored 
                        ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {showRefactored ? 'Show Original' : 'Show Refactored'}
                  </button>
                  {showRefactored && (
                    <button
                      onClick={handleApplyRefactored}
                      className="text-xs px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded transition-colors"
                    >
                      Apply
                    </button>
                  )}
                </div>
              )}
              <div className="text-xs text-slate-500 font-mono">React + Tailwind CSS</div>
            </div>
          </div>
          {showRefactored && refactoredCode ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-center justify-between shrink-0">
                <span className="text-xs font-semibold text-blue-700">✨ AI Refactored</span>
                <button
                  onClick={() => handleCopy(refactoredCode)}
                  className="p-1.5 hover:bg-blue-100 rounded transition-colors"
                  title="Copy refactored code"
                >
                  {copied ? <Check size={14} className="text-green-600"/> : <Copy size={14} className="text-blue-600"/>}
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap">
                  {refactoredCode}
                </pre>
              </div>
              {currentItem?.refactorResult?.explanation && (
                <div className="bg-blue-50 border-t border-blue-200 px-4 py-3 shrink-0">
                  <p className="text-xs font-semibold text-blue-800 mb-1">AI Explanation:</p>
                  <p className="text-xs text-blue-700">{currentItem.refactorResult.explanation}</p>
                </div>
              )}
            </div>
          ) : (
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 w-full p-4 font-mono text-sm bg-white border-0 focus:ring-0 outline-none resize-none overflow-auto"
              placeholder="Enter your React component code here..."
              spellCheck={false}
            />
          )}
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0">
            <h2 className="text-sm font-semibold text-slate-700">Live Preview</h2>
            <div className="flex items-center gap-2">
              {isRunning && (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-slate-500">Running</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <SandboxedPreview 
              code={showRefactored && refactoredCode ? refactoredCode : previewCode} 
              title="Component Preview" 
            />
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="bg-white border-t border-slate-200 px-6 py-3 shrink-0">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span>✨ React 18</span>
            <span>🎨 Tailwind CSS</span>
            <span>⚡ Babel Standalone</span>
          </div>
          <div>
            <span>Tip: Name your component as <code className="bg-slate-100 px-1.5 py-0.5 rounded">App</code>, <code className="bg-slate-100 px-1.5 py-0.5 rounded">Component</code>, or <code className="bg-slate-100 px-1.5 py-0.5 rounded">Example</code> for auto-detection</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
