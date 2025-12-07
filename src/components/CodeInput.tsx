import React, { useState } from 'react';
import { Spinner } from './Spinner';
import { ChevronDown, Code2 } from 'lucide-react';
import { SAMPLES } from '../data/samples';

interface CodeInputProps {
  onRefactor: (code: string) => void;
  isLoading: boolean;
}

export const CodeInput: React.FC<CodeInputProps> = ({ onRefactor, isLoading }) => {
  const [inputCode, setInputCode] = useState('');
  const [showSamples, setShowSamples] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      onRefactor(inputCode);
    }
  };

  const loadSample = (code: string) => {
    setInputCode(code);
    setShowSamples(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full relative">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Input Code</h2>
        
        <div className="relative">
            <button 
                onClick={() => setShowSamples(!showSamples)}
                className="flex items-center gap-2 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors border border-indigo-200"
            >
                <Code2 size={14} />
                Load Sample
                <ChevronDown size={14} className={`transform transition-transform ${showSamples ? 'rotate-180' : ''}`} />
            </button>
            
            {showSamples && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-20 overflow-hidden">
                    <div className="max-h-[300px] overflow-y-auto py-2">
                        {SAMPLES.map((sample, idx) => (
                            <div key={idx} className="border-b border-slate-100 last:border-0">
                                <button 
                                    onClick={() => loadSample(sample.code)}
                                    className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors group"
                                >
                                    <div className="text-xs font-bold text-slate-400 mb-0.5 group-hover:text-indigo-500">{sample.category}</div>
                                    <div className="text-sm font-medium text-slate-700">{sample.name}</div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* Backdrop to close */}
            {showSamples && (
                <div className="fixed inset-0 z-10" onClick={() => setShowSamples(false)}></div>
            )}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <textarea
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          placeholder="// Paste messy code here or select a sample from the button above..."
          className="flex-grow w-full p-4 font-mono text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none mb-4 min-h-[300px]"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !inputCode.trim()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg px-6 py-2.5 transition-colors shadow-sm"
          >
            {isLoading ? <Spinner /> : null}
            {isLoading ? 'Processing...' : 'Refactor & Visualize'}
          </button>
        </div>
      </form>
    </div>
  );
};
