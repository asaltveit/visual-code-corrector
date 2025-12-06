import React, { useState } from 'react';
import { TabOption, RefactorResult } from '../types';
import { VisualDiff } from './VisualDiff';
import { FileCode, ShieldCheck, Image as ImageIcon, Copy, Check } from 'lucide-react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import ts from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('typescript', ts);

interface CodeOutputProps {
  data: RefactorResult | null;
  visualUrl: string | null;
  isLoading: boolean;
}

export const CodeOutput: React.FC<CodeOutputProps> = ({ data, visualUrl, isLoading }) => {
  const [activeTab, setActiveTab] = useState<TabOption>('refactor');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = () => {
    if (isLoading && !data && !visualUrl) {
       return (
         <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <p>Waiting for output...</p>
         </div>
       );
    }

    if (!data && !visualUrl && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
               <p>Submit code to see the magic happen.</p>
            </div>
        );
    }

    switch (activeTab) {
      case 'refactor':
        return (
          <div className="relative">
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
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 text-sm text-blue-800">
                    <p className="font-semibold mb-1">AI Note:</p>
                    {data.explanation}
                </div>
             )}
             <div className="rounded-lg overflow-hidden border border-slate-200 text-sm">
                <SyntaxHighlighter language="typescript" style={docco} showLineNumbers customStyle={{margin: 0, background: '#f8fafc', padding: '1.5rem'}}>
                    {data?.refactoredCode || '// No code generated yet'}
                </SyntaxHighlighter>
             </div>
          </div>
        );
      case 'tests':
        return (
          <div className="relative">
             <div className="absolute top-2 right-2 z-10">
                <button 
                   onClick={() => handleCopy(data?.unitTests || '')}
                   className="p-2 bg-white/80 backdrop-blur rounded-md border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                   disabled={!data}
                >
                   {copied ? <Check size={16} className="text-green-600"/> : <Copy size={16}/>}
                </button>
             </div>
             <div className="rounded-lg overflow-hidden border border-slate-200 text-sm">
                <SyntaxHighlighter language="typescript" style={docco} showLineNumbers customStyle={{margin: 0, background: '#f8fafc', padding: '1.5rem'}}>
                    {data?.unitTests || '// No tests generated yet'}
                </SyntaxHighlighter>
             </div>
          </div>
        );
      case 'visual':
        return <VisualDiff imageUrl={visualUrl} isLoading={isLoading} />;
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
          <ImageIcon size={18} />
          Visual Diagram
        </button>
      </div>
      <div className="p-6 overflow-auto flex-grow bg-white">
        {renderContent()}
      </div>
    </div>
  );
};
