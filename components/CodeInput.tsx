import React, { useState } from 'react';
import { Spinner } from './Spinner';

interface CodeInputProps {
  onRefactor: (code: string) => void;
  isLoading: boolean;
}

export const CodeInput: React.FC<CodeInputProps> = ({ onRefactor, isLoading }) => {
  const [inputCode, setInputCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      onRefactor(inputCode);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Input Code</h2>
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Paste your messy code here</span>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <textarea
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          placeholder="// Paste your code here..."
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
