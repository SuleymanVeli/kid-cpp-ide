export const Header = ({ onRun, onToggleTheme, isDark }: any) => (
  <header className="p-4 md:px-8 bg-white dark:bg-slate-900 border-b-4 border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0 transition-colors">
    <div className="text-2xl font-black text-secondary">🚀 Kod Dünyası</div>
    <div className="flex gap-3">
      <button onClick={onToggleTheme} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
        {isDark ? '☀️' : '🌙'}
      </button>
      <button onClick={onRun} className="bg-primary text-white px-8 py-2 rounded-2xl font-bold border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 transition-all">
        Kodu İşlət! ▶
      </button>
    </div>
  </header>
);