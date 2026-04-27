export const Terminal = ({ output }: { output: string }) => {
  return (
    <footer className="h-32 bg-slate-900 dark:bg-black text-white p-4 font-mono rounded-2xl border-2 border-slate-700 dark:border-slate-800 mx-6 mb-6 shadow-inner overflow-y-auto">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-3 h-3 rounded-full bg-red-500"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
        <span className="w-3 h-3 rounded-full bg-green-500"></span>
        <span className="text-xs text-slate-500 ml-2">Terminal</span>
      </div>
      <p className="text-sm dark:text-slate-200"><span className="text-emerald-500 mr-2">❯</span>{output}</p>
    </footer>
  );
};