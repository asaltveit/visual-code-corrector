import React, { useState } from 'react';
import { Maximize2, X, Download } from 'lucide-react';

interface VisualDiffProps {
  imageUrl: string | null;
  isLoading: boolean;
}

export const VisualDiff: React.FC<VisualDiffProps> = ({ imageUrl, isLoading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] bg-slate-50 rounded-lg border border-dashed border-slate-300">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-indigo-100 rounded-full mb-4"></div>
          <p className="text-slate-500 font-medium">Generating visual diagram...</p>
          <p className="text-slate-400 text-sm mt-2">Using Nano Banana Pro</p>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] bg-slate-50 rounded-lg border border-dashed border-slate-300 text-slate-400">
        <p>No visualization generated yet.</p>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="bg-slate-50 p-3 border-b border-slate-200 flex justify-between items-center">
             <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Logic Flowchart</span>
             <button 
                onClick={() => setIsModalOpen(true)}
                className="text-slate-500 hover:text-indigo-600 transition-colors"
                title="View Fullscreen"
             >
                 <Maximize2 size={16} />
             </button>
        </div>
        <div className="p-4 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-slate-50">
            <img 
                src={imageUrl} 
                alt="Code Logic Visualization" 
                className="max-h-[500px] object-contain shadow-lg rounded-md cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => setIsModalOpen(true)}
            />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-6xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center text-white mb-2">
                <h3 className="text-lg font-medium">Visual Verification</h3>
                <div className="flex gap-2">
                    <a href={imageUrl} download="diagram.png" className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <Download size={24} />
                    </a>
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>
            <div className="flex-grow overflow-auto bg-slate-900 rounded-lg flex items-center justify-center p-4">
              <img 
                src={imageUrl} 
                alt="Full Visualization" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
