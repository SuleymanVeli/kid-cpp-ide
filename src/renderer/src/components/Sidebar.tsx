import { useState } from 'react';

import { CATEGORIES } from '../lib/monaco-constants'

export const Sidebar = ({ onAddCode }: { onAddCode: (snippet: string) => void }) => {
  const [activeCatId, setActiveCatId] = useState('lib');

  // Aktiv kateqoriya obyektini tapırıq
  const activeCategory = CATEGORIES.find(cat => cat.id === activeCatId) || CATEGORIES[0];

  return (
    <aside className="w-full md:w-72 bg-white dark:bg-slate-900 rounded-xl flex border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors duration-300">
      
      {/* 1. Sol İkon Paneli */}
      <div className="w-16 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700 flex flex-col py-4 items-center gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            title={cat.label}
            onClick={() => setActiveCatId(cat.id)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all duration-200 ${
              activeCatId === cat.id 
                ? `${cat.color} text-white shadow-md scale-105` 
                : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat.icon}
          </button>
        ))}
      </div>

      {/* 2. Bloklar Siyahısı */}
      <div className="flex-1 p-4 overflow-y-auto">
        <header className="mb-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {activeCategory.label}
          </h3>
        </header>

        <div className="space-y-2">
          {activeCategory.items.map((item, index) => (
            <div 
              key={index}
              onClick={() => onAddCode(item.snippet)}
              className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg 
                         text-sm font-semibold cursor-pointer transition-all active:scale-95
                         hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm
                         text-slate-700 dark:text-slate-200 flex items-center gap-2"
            >
              <span className="opacity-50 text-[10px]">●</span>
              {item.label}
            </div>
          ))}
          
          {activeCategory.items.length === 0 && (
            <p className="text-xs text-slate-400 italic">Bu bölmədə hələ blok yoxdur.</p>
          )}
        </div>
      </div>
    </aside>
  );
};