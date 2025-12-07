import React, { useState, useEffect, useRef } from 'react';
import { TabOption, RefactorResult, HistoryItem } from '../types';
import { VisualComparison } from './VisualComparison';
import { SandboxedPreview } from './SandboxedPreview';
import { FileCode, ShieldCheck, Play, Copy, Check, Eye, Code2 } from 'lucide-react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import ts from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('typescript', ts);

interface CodeOutputProps {
  originalCode: string;
  data: RefactorResult | null;
  isLoading: boolean;
  historyItem?: HistoryItem | null;
}

export const CodeOutput: React.FC<CodeOutputProps> = ({ originalCode, data, isLoading, historyItem }) => {
  // Auto-select sandbox tab for React code, visual tab for backend/Python (to show logic flow)
  const isReactCode = historyItem?.isBackend === false;
  const isBackendCode = historyItem?.isBackend === true;
  const [activeTab, setActiveTab] = useState<TabOption>(
    isReactCode ? 'sandbox' : (isBackendCode ? 'visual' : 'refactor')
  );
  const [copied, setCopied] = useState(false);
  const lastAutoSwitchedItemId = useRef<string | null>(null);

  // Update tab when history item changes or when refactored code becomes available
  // Only auto-switch once per item, not when user manually changes tabs
  useEffect(() => {
    if (!historyItem) return;
    
    const isReact = historyItem.isBackend === false;
    const isBackend = historyItem.isBackend === true;
    
    // Only auto-switch on initial load of a new item
    if (historyItem.id !== lastAutoSwitchedItemId.current) {
      if (isReact && data?.refactoredCode) {
        setActiveTab('sandbox');
        lastAutoSwitchedItemId.current = historyItem.id;
      } else if (isBackend) {
        // Python/backend code should never show sandbox - switch to visual for logic flow
        setActiveTab('visual');
        lastAutoSwitchedItemId.current = historyItem.id;
      } else if (!isReact && !isBackend) {
        setActiveTab('refactor');
        lastAutoSwitchedItemId.current = historyItem.id;
      }
    }
  }, [historyItem?.id, data?.refactoredCode]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = () => {
    if (!originalCode && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 min-h-[300px]">
               <p>Submit code to see the magic happen.</p>
            </div>
        );
    }

    switch (activeTab) {
      case 'refactor':
        if (isLoading && !data) return <div className="p-8 text-center text-slate-500 animate-pulse">Generating clean code...</div>;
        return (
          <div className="relative h-full flex flex-col">
             <div className="absolute top-2 right-2 z-10">
                <button 
                  onClick={() => handleCopy(data?.refactoredCode || '')}
                  className="p-2 bg-white/80 backdrop-blur rounded-md border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                  disabled={!data}
                >
                    {copied ? <Check size={16} className="text-green-600"/> : <Copy size={16}/>}
                </button>
             </div>
             {data?.explanation && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 text-sm text-blue-800 shrink-0">
                    <p className="font-semibold mb-1">AI Note:</p>
                    {data.explanation}
                </div>
             )}
             <div className="rounded-lg overflow-hidden border border-slate-200 text-sm flex-grow relative">
                <div className="absolute inset-0 overflow-auto">
                    <SyntaxHighlighter language="typescript" style={docco} showLineNumbers customStyle={{margin: 0, minHeight: '100%', background: '#f8fafc', padding: '1.5rem'}}>
                        {data?.refactoredCode || '// No code generated yet'}
                    </SyntaxHighlighter>
                </div>
             </div>
          </div>
        );
      case 'tests':
        if (isLoading && !data) return <div className="p-8 text-center text-slate-500 animate-pulse">Writing unit tests...</div>;
        return (
          <div className="relative h-full flex flex-col">
             <div className="absolute top-2 right-2 z-10">
                <button 
                   onClick={() => handleCopy(data?.unitTests || '')}
                   className="p-2 bg-white/80 backdrop-blur rounded-md border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                   disabled={!data}
                >
                   {copied ? <Check size={16} className="text-green-600"/> : <Copy size={16}/>}
                </button>
             </div>
             <div className="rounded-lg overflow-hidden border border-slate-200 text-sm flex-grow relative">
                <div className="absolute inset-0 overflow-auto">
                    <SyntaxHighlighter language="typescript" style={docco} showLineNumbers customStyle={{margin: 0, minHeight: '100%', background: '#f8fafc', padding: '1.5rem'}}>
                        {data?.unitTests || '// No tests generated yet'}
                    </SyntaxHighlighter>
                </div>
             </div>
          </div>
        );
      case 'sandbox':
        // Never show sandbox for backend/Python code - redirect to visual
        if (isBackendCode) {
          return (
            <div className="h-full flex items-center justify-center text-slate-400">
              <div className="text-center">
                <p className="mb-2">Python/Backend code detected</p>
                <p className="text-sm">View the <strong>Visual Diagram</strong> tab for logic flow visualization.</p>
              </div>
            </div>
          );
        }
        
        if (isLoading && !data) {
          return <div className="p-8 text-center text-slate-500 animate-pulse">Generating refactored code...</div>;
        }
        return (
          <div className="h-full grid grid-cols-2 gap-4 min-h-0">
            {/* Code Editor Side */}
            <div className="flex flex-col h-full min-h-0 border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
              <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between shrink-0">
                <span className="text-xs font-semibold text-slate-700">Refactored Code</span>
                <button 
                  onClick={() => handleCopy(data?.refactoredCode || '')}
                  className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                  disabled={!data}
                >
                  {copied ? <Check size={14} className="text-green-600"/> : <Copy size={14} className="text-slate-600"/>}
                </button>
              </div>
              {data?.explanation && (
                <div className="bg-blue-50 border-b border-blue-200 px-3 py-2 text-xs text-blue-800 shrink-0">
                  <p className="font-semibold mb-0.5">AI Note:</p>
                  <p>{data.explanation}</p>
                </div>
              )}
              <div className="flex-1 overflow-auto p-4 min-h-0">
                <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap">
                  {data?.refactoredCode || '// No code generated yet'}
                </pre>
              </div>
            </div>

            {/* Live Preview Side */}
            <div className="flex flex-col h-full min-h-0">
              <SandboxedPreview 
                code={data?.refactoredCode || originalCode} 
                title="Live Preview" 
              />
            </div>
          </div>
        );
      case 'visual':
        return <VisualComparison 
            originalCode={originalCode} 
            refactoredCode={data?.refactoredCode || null} 
            isLoading={isLoading} 
            isBackend={historyItem?.isBackend}
            visualBeforeUrl={historyItem?.visualBeforeUrl}
            visualAfterUrl={historyItem?.visualAfterUrl}
        />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('refactor')}
          className={`flex-1 py-4 px-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === 'refactor'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <FileCode size={18} />
          Refactored Code
        </button>
        {isReactCode && (
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`flex-1 py-4 px-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'sandbox'
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Code2 size={18} />
            Sandbox
          </button>
        )}
        <button
          onClick={() => setActiveTab('tests')}
          className={`flex-1 py-4 px-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === 'tests'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck size={18} />
          Unit Tests
        </button>
        <button
          onClick={() => setActiveTab('visual')}
          className={`flex-1 py-4 px-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === 'visual'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          {historyItem?.isBackend ? <Eye size={18} /> : <Play size={18} />}
          {historyItem?.isBackend ? 'Visual Diagram' : 'Runtime Preview'}
        </button>
      </div>
      <div className={`flex-grow overflow-hidden flex flex-col ${activeTab === 'sandbox' ? 'p-4' : 'p-6'}`}>
        {renderContent()}
      </div>
    </div>
  );
};
