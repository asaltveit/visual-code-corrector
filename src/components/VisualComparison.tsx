import React, { useState } from 'react';
import { SandboxedPreview } from './SandboxedPreview';
import { ArrowRight, Play, Maximize2, X, Download } from 'lucide-react';

interface VisualComparisonProps {
  originalCode: string;
  refactoredCode: string | null;
  isLoading: boolean;
  isBackend?: boolean;
  visualBeforeUrl?: string | null;
  visualAfterUrl?: string | null;
}

export const VisualComparison: React.FC<VisualComparisonProps> = ({ 
    originalCode, 
    refactoredCode, 
    isLoading,
    isBackend,
    visualBeforeUrl,
    visualAfterUrl
}) => {
  const [modalImage, setModalImage] = useState<string | null>(null);

  // Initial state
  if (!originalCode && !isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px] bg-slate-50 rounded-lg border border-dashed border-slate-300 text-slate-400">
            <Play size={48} className="mb-4 opacity-20" />
            <p>Submit code to see a visual comparison.</p>
        </div>
      );
  }

  // --- IMAGE PREVIEW COMPONENT (For Backend) ---
  const ImagePreview = ({ url, title }: { url: string | null, title: string }) => {
      if (!url) return (
          <div className="h-full flex items-center justify-center bg-slate-50 text-slate-400 border border-slate-200 rounded-lg">
             {isLoading ? <div className="animate-pulse">Generating Diagram...</div> : "No Diagram Available"}
          </div>
      );

      return (
          <div className="flex flex-col h-full bg-white rounded-lg border border-slate-200 overflow-hidden group">
              <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
                  <button 
                    onClick={() => setModalImage(url)}
                    className="text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                      <Maximize2 size={16} />
                  </button>
              </div>
              <div className="flex-grow flex items-center justify-center p-4 bg-slate-100 relative overflow-hidden">
                  <img 
                    src={url} 
                    alt={title} 
                    className="max-w-full max-h-[350px] object-contain shadow-sm cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setModalImage(url)}
                  />
              </div>
          </div>
      );
  };

  // --- RENDER LOGIC ---

  return (
    <div className="h-full flex flex-col">
       <div className={`p-4 mb-6 rounded-r-md shrink-0 border-l-4 ${isBackend ? 'bg-purple-50 border-purple-500' : 'bg-green-50 border-green-500'}`}>
            <h4 className={`font-bold flex items-center gap-2 ${isBackend ? 'text-purple-900' : 'text-green-900'}`}>
                {isBackend ? <Maximize2 size={18} /> : <Play size={18} />} 
                {isBackend ? 'Logic Flow Visualization' : 'Runtime Verification'}
            </h4>
            <p className={`text-sm mt-1 ${isBackend ? 'text-purple-800' : 'text-green-800'}`}>
                {isBackend 
                    ? 'Visualizing code logic and control flow using Nano Banana Pro (Gemini 3 Image).' 
                    : 'Running live code in a secure browser sandbox.'}
            </p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow min-h-0">
            {/* BEFORE PANEL */}
            <div className="relative h-full min-h-[400px]">
                {isBackend ? (
                    <ImagePreview url={visualBeforeUrl || null} title="Before: Logic Flow" />
                ) : (
                    originalCode && originalCode.trim().length > 0 ? (
                        <SandboxedPreview code={originalCode} title="Before: Original Code" />
                    ) : (
                        <div className="h-full flex items-center justify-center bg-slate-50 text-slate-400 border border-slate-200 rounded-lg">
                            {isLoading ? "Processing..." : "No code available"}
                        </div>
                    )
                )}
            </div>

            {/* AFTER PANEL */}
            <div className="relative h-full min-h-[400px]">
                 {/* Arrow Indicator for Desktop */}
                 <div className="absolute top-1/2 -left-3 transform -translate-y-1/2 z-10 hidden lg:block bg-white rounded-full p-1 shadow-md border border-slate-200 text-indigo-600">
                    <ArrowRight size={20} />
                 </div>
                 
                 {isBackend ? (
                    <ImagePreview url={visualAfterUrl || null} title="After: Logic Flow" />
                 ) : (
                    refactoredCode && refactoredCode.trim().length > 0 ? (
                        <SandboxedPreview code={refactoredCode} title="After: Refactored Code" />
                    ) : (
                        <div className="h-full flex items-center justify-center bg-slate-50 text-slate-400 border border-slate-200 rounded-lg">
                            {isLoading ? "Processing..." : "Waiting for refactor..."}
                        </div>
                    )
                 )}
            </div>
       </div>

       {/* FULLSCREEN MODAL FOR IMAGES */}
       {modalImage && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-7xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center text-white mb-4">
                <h3 className="text-xl font-medium flex items-center gap-2">
                    Visual Detail
                </h3>
                <div className="flex gap-3">
                    <a href={modalImage} download="logic-diagram.png" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium">
                        <Download size={18} /> Download
                    </a>
                    <button 
                        onClick={() => setModalImage(null)}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>
            <div className="flex-grow overflow-auto bg-slate-950 rounded-lg flex items-center justify-center p-8 border border-slate-800">
              <img 
                src={modalImage} 
                alt="Full Visualization" 
                className="max-w-full max-h-full object-contain shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};