import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CodeInput } from './components/CodeInput';
import { CodeOutput } from './components/CodeOutput';
import { HistorySidebar } from './components/HistorySidebar';
import { DocumentationModal } from './components/DocumentationModal';
import { useMultiModalRefactor } from './hooks/useMultiModalRefactor';
import { HistoryItem } from './types';
import { Menu, X, BookOpen, Code2 } from 'lucide-react';

export default function App() {
  // Use the new custom hook for logic
  const { 
    isLoading, 
    error, 
    executePipeline, 
    currentItem, 
    history, 
    setCurrentItem, 
    setError 
  } = useMultiModalRefactor();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  const handleRefactor = (code: string) => {
    executePipeline(code);
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setCurrentItem(item);
    setIsSidebarOpen(false); // Close sidebar on mobile select
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Documentation Modal */}
      {isDocsOpen && <DocumentationModal onClose={() => setIsDocsOpen(false)} />}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <HistorySidebar 
            history={history} 
            onSelect={handleSelectHistory} 
            selectedId={currentItem?.id}
        />
        <button 
            className="absolute top-4 right-[-40px] bg-white p-2 rounded-r-md shadow-md md:hidden text-slate-600"
            onClick={() => setIsSidebarOpen(false)}
        >
            <X size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0 h-[73px]">
          <div className="flex items-center gap-4">
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden text-slate-500 hover:text-indigo-600 transition-colors"
            >
                <Menu size={24} />
            </button>
            <div>
                <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">Refactor & Verify</span>
                    <span className="text-xs font-normal px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full border border-indigo-200 hidden sm:inline-block">Gemini 3</span>
                </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/sandbox"
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
            >
              <Code2 size={16} />
              <span className="hidden sm:inline">Sandbox</span>
            </Link>
            <button
              onClick={() => setIsDocsOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
            >
              <BookOpen size={16} />
              <span className="hidden sm:inline">Docs</span>
            </button>
          </div>
        </header>

        {/* Error Banner */}
        {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4 mb-0 flex items-center justify-between shrink-0">
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

        {/* Workspace */}
        <main className="flex-grow p-4 md:p-6 overflow-hidden grid grid-rows-[45%_55%] md:grid-rows-1 md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="h-full min-h-0">
            <CodeInput onRefactor={handleRefactor} isLoading={isLoading} />
          </div>

          {/* Output Section */}
          <div className="h-full min-h-0">
            <CodeOutput 
                originalCode={currentItem?.originalCode || ''}
                data={currentItem?.refactorResult || null} 
                isLoading={isLoading} 
                historyItem={currentItem}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
