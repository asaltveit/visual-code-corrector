import React, { useState, useEffect } from 'react';
import { CodeInput } from './components/CodeInput';
import { CodeOutput } from './components/CodeOutput';
import { HistorySidebar } from './components/HistorySidebar';
import { generateRefactor, generateVisual } from './services/geminiService';
import { HistoryItem } from './types';
import { Menu, X } from 'lucide-react';

// Key for local storage
const STORAGE_KEY = 'refactor_history_v1';

export default function App() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentItem, setCurrentItem] = useState<HistoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(parsed);
        if (parsed.length > 0) {
           // Don't auto-select to keep interface clean, or select first?
           // Let's leave it blank for a fresh start feel
        }
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const handleRefactor = async (code: string) => {
    setIsLoading(true);
    setError(null);
    
    // Create optimistic history item
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      originalCode: code,
      refactorResult: null,
      visualUrl: null,
      status: 'pending'
    };

    setCurrentItem(newItem);
    setHistory(prev => [newItem, ...prev].slice(0, 10)); // Keep last 10

    try {
      // Parallel execution for speed, though sequentially is safer for rate limits.
      // Let's do parallel as it provides a better UX if the user has a good tier key.
      const [refactorData, visualData] = await Promise.all([
        generateRefactor(code),
        generateVisual(code)
      ]);

      const updatedItem: HistoryItem = {
        ...newItem,
        refactorResult: refactorData,
        visualUrl: visualData.imageUrl,
        status: 'success'
      };

      setCurrentItem(updatedItem);
      setHistory(prev => prev.map(item => item.id === newItem.id ? updatedItem : item));

    } catch (err: any) {
      console.error("Pipeline failed", err);
      const errorMessage = err.message || "An unexpected error occurred.";
      setError(errorMessage);
      
      const failedItem: HistoryItem = {
        ...newItem,
        status: 'error',
        error: errorMessage
      };
      
      setCurrentItem(failedItem);
      setHistory(prev => prev.map(item => item.id === newItem.id ? failedItem : item));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setCurrentItem(item);
    setIsSidebarOpen(false); // Close sidebar on mobile select
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
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
        <header className="bg-white border-b border-slate-200 p-4 flex items-center gap-4 shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <Menu size={24} />
          </button>
          <div>
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">Multi-Modal Refactorer</span>
                <span className="text-xs font-normal px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full border border-indigo-200">Gemini 3 Powered</span>
              </h1>
          </div>
        </header>

        {/* Error Banner */}
        {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4 mb-0 flex items-center justify-between">
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
        <main className="flex-grow p-4 md:p-6 overflow-hidden grid grid-rows-[1fr] md:grid-rows-1 md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="h-full min-h-[400px]">
            <CodeInput onRefactor={handleRefactor} isLoading={isLoading} />
          </div>

          {/* Output Section */}
          <div className="h-full min-h-[400px]">
            <CodeOutput 
                data={currentItem?.refactorResult || null} 
                visualUrl={currentItem?.visualUrl || null} 
                isLoading={isLoading} 
            />
          </div>
        </main>
      </div>
    </div>
  );
}
