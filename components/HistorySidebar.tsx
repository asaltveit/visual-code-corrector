import React from 'react';
import { HistoryItem } from '../types';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  selectedId?: string;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelect, selectedId }) => {
  return (
    <div className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 flex items-center gap-2">
        <Clock className="text-indigo-600" size={20} />
        <h2 className="font-semibold text-slate-800">History</h2>
      </div>
      <div className="flex-grow overflow-y-auto">
        {history.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">
            No history yet. Start refactoring!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex flex-col gap-2 ${
                    selectedId === item.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'border-l-4 border-transparent'
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className="text-xs font-mono text-slate-500 truncate w-3/4">
                    {item.id.slice(0, 8)}...
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-sm text-slate-700 font-medium line-clamp-1">
                    {item.originalCode.slice(0, 30).replace(/\n/g, ' ')}...
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                    {item.status === 'success' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 size={10} /> Success
                        </span>
                    ) : item.status === 'error' ? (
                         <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                            <AlertCircle size={10} /> Error
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                            Pending
                        </span>
                    )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
