import { useState, useCallback } from 'react';
import { generateRefactor, generateLogicDiagram } from '../services/geminiService';
import { HistoryItem } from '../types';

interface UseMultiModalRefactorReturn {
  isLoading: boolean;
  error: string | null;
  executePipeline: (code: string) => Promise<void>;
  currentItem: HistoryItem | null;
  history: HistoryItem[];
  setCurrentItem: (item: HistoryItem | null) => void;
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  setError: (err: string | null) => void;
}

const STORAGE_KEY = 'refactor_history_v4';
const MAX_HISTORY_ITEMS = 5; // Reduced to prevent quota issues
// Separate storage for images (in-memory only, not persisted)
const imageCache = new Map<string, { visualBeforeUrl?: string | null; visualAfterUrl?: string | null }>();

// Helper to strip images from history item for storage
const stripImagesForStorage = (item: HistoryItem): Omit<HistoryItem, 'visualBeforeUrl' | 'visualAfterUrl'> => {
  const { visualBeforeUrl, visualAfterUrl, ...rest } = item;
  return rest;
};

// Helper to restore images from cache
const restoreImagesFromCache = (item: Omit<HistoryItem, 'visualBeforeUrl' | 'visualAfterUrl'>): HistoryItem => {
  const cached = imageCache.get(item.id);
  return {
    ...item,
    visualBeforeUrl: cached?.visualBeforeUrl ?? null,
    visualAfterUrl: cached?.visualAfterUrl ?? null,
  };
};

export const useMultiModalRefactor = (): UseMultiModalRefactorReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<HistoryItem | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(STORAGE_KEY);
    try {
      const parsed = saved ? JSON.parse(saved) : [];
      // Restore images from cache if available (though cache will be empty on reload)
      return parsed.map(restoreImagesFromCache);
    } catch {
      return [];
    }
  });

  const saveHistory = useCallback((newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    
    // Clean up cache: remove items that are no longer in history
    const historyIds = new Set(newHistory.map(item => item.id));
    for (const [id] of imageCache) {
      if (!historyIds.has(id)) {
        imageCache.delete(id);
      }
    }
    
    // Store images in memory cache
    newHistory.forEach(item => {
      if (item.visualBeforeUrl || item.visualAfterUrl) {
        imageCache.set(item.id, {
          visualBeforeUrl: item.visualBeforeUrl,
          visualAfterUrl: item.visualAfterUrl,
        });
      }
    });

    // Save to localStorage without images (they're too large)
    const historyWithoutImages = newHistory.map(stripImagesForStorage);
    
    try {
      // Limit history size to prevent quota issues
      const trimmedHistory = historyWithoutImages.slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
    } catch (err: any) {
      // Handle quota exceeded error
      if (err.name === 'QuotaExceededError' || err.message?.includes('quota')) {
        console.warn('localStorage quota exceeded, attempting to reduce history size');
        
        // Try with fewer items
        let reducedSize = MAX_HISTORY_ITEMS;
        let saved = false;
        
        while (reducedSize > 0 && !saved) {
          try {
            const reducedHistory = historyWithoutImages.slice(0, reducedSize);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedHistory));
            saved = true;
            
            // Update state to match what was saved
            const restoredHistory = reducedHistory.map(restoreImagesFromCache);
            setHistory(restoredHistory);
            
            if (reducedSize < MAX_HISTORY_ITEMS) {
              console.warn(`History reduced to ${reducedSize} items due to storage limits`);
            }
          } catch {
            reducedSize--;
          }
        }
        
        if (!saved) {
          // Last resort: clear and save just the current item
          try {
            const minimalHistory = historyWithoutImages.slice(0, 1);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(minimalHistory));
            const restoredHistory = minimalHistory.map(restoreImagesFromCache);
            setHistory(restoredHistory);
            console.warn('History cleared due to storage limits');
          } catch {
            // If even that fails, clear localStorage for this key
            localStorage.removeItem(STORAGE_KEY);
            console.error('Unable to save history to localStorage');
          }
        }
      } else {
        throw err;
      }
    }
  }, []);

  const executePipeline = async (code: string) => {
    setIsLoading(true);
    setError(null);

    // Improved heuristic detection for Frontend vs Backend/Logic code
    // Priority: Detect frontend first (React/JSX/HTML), then backend (Python/logic)
    
    const codeTrimmed = code.trim();
    
    // Frontend indicators (React, JSX, HTML, CSS)
    const hasFrontendIndicators = (
      // React/JSX patterns
      code.includes('React') ||
      code.includes('react') ||
      code.includes('useState') ||
      code.includes('useEffect') ||
      code.includes('useRef') ||
      code.includes('useMemo') ||
      code.includes('useCallback') ||
      code.includes('useContext') ||
      code.includes('createElement') ||
      code.includes('ReactDOM') ||
      code.includes('react-dom') ||
      // JSX patterns (even messy ones)
      code.includes('return (') && code.includes('<') ||
      code.includes('return <') ||
      code.includes('<>') ||
      code.includes('</') ||
      code.includes('/>') ||
      // HTML patterns
      codeTrimmed.startsWith('<') ||
      code.includes('<div') ||
      code.includes('<span') ||
      code.includes('<button') ||
      code.includes('<input') ||
      code.includes('className') ||
      code.includes('class=') ||
      // CSS/Tailwind patterns
      code.includes('bg-') ||
      code.includes('text-') ||
      code.includes('flex') ||
      code.includes('grid')
    );
    
    // Backend/Logic indicators (Python, C, Java, etc.)
    // Enhanced Python detection - Python code should never show sandbox/runtime preview
    const isPython = (
      (code.includes('def ') && code.includes(':')) ||
      (code.includes('import ') && (code.includes('numpy') || code.includes('pandas') || code.includes('math') || code.includes('os') || code.includes('sys'))) ||
      code.includes('if __name__') ||
      (code.includes('print(') && !hasFrontendIndicators) ||
      (code.includes('class ') && code.includes('__init__')) ||
      code.includes('lambda ') && code.includes(':') ||
      code.includes('try:') && code.includes('except') ||
      code.includes('with ') && code.includes('as ')
    );
    
    const hasBackendIndicators = (
      isPython ||
      // C/C++ patterns
      code.includes('#include') ||
      code.includes('int main') ||
      // Java patterns
      code.includes('public static void main') ||
      code.includes('public class') ||
      // General logic patterns (only if no frontend indicators)
      (code.includes('class ') && !hasFrontendIndicators && !code.includes('Component'))
    );
    
    // Determine: Frontend takes priority, then backend, default to frontend for ambiguous cases
    const isBackend = hasBackendIndicators && !hasFrontendIndicators;

    // 1. Create Optimistic Item
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      originalCode: code,
      refactorResult: null,
      status: 'pending',
      isBackend,
      visualBeforeUrl: null,
      visualAfterUrl: null
    };

    setCurrentItem(newItem);
    const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
    saveHistory(updatedHistory);

    try {
      if (isBackend) {
          // --- BACKEND PIPELINE (Refactor + Images) ---
          
          // Parallel: Refactor + Before Image
          const [refactorResult, beforeUrl] = await Promise.all([
              generateRefactor(code),
              generateLogicDiagram(code, "Original")
          ]);

          // Update intermediate state
          let intermediateItem = {
              ...newItem,
              refactorResult,
              visualBeforeUrl: beforeUrl
          };
          setCurrentItem(intermediateItem);

          // Generate After Image (Sequential to ensure it matches refactored code)
          const afterUrl = await generateLogicDiagram(refactorResult.refactoredCode, "Refactored");

          // Finalize
          const finalItem: HistoryItem = {
              ...intermediateItem,
              visualAfterUrl: afterUrl,
              status: 'success'
          };
          
          setCurrentItem(finalItem);
          const finalHistory = updatedHistory.map(item => item.id === newItem.id ? finalItem : item);
          saveHistory(finalHistory);

      } else {
          // --- FRONTEND PIPELINE (Refactor Only - Runtime Visuals) ---
          
          const refactorResult = await generateRefactor(code);

          const finalItem: HistoryItem = {
              ...newItem,
              refactorResult,
              status: 'success'
              // visualUrls remain null, UI will use SandboxedPreview
          };

          setCurrentItem(finalItem);
          const finalHistory = updatedHistory.map(item => item.id === newItem.id ? finalItem : item);
          saveHistory(finalHistory);
      }

    } catch (err: any) {
      console.error("Pipeline execution failed:", err);
      const errorMessage = err.message || "An unexpected error occurred during processing.";
      setError(errorMessage);

      const failedItem: HistoryItem = {
        ...newItem,
        status: 'error',
        error: errorMessage
      };
      setCurrentItem(failedItem);
      const failedHistory = updatedHistory.map(item => 
        item.id === newItem.id ? failedItem : item
      );
      saveHistory(failedHistory);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    executePipeline,
    currentItem,
    history,
    setCurrentItem,
    setHistory: saveHistory,
    setError
  };
};