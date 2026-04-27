import { INFO_DATA } from '@renderer/lib/info-data';
import { motion, AnimatePresence } from 'framer-motion';

export const InfoSidebar = ({ currentLineText }: { currentLineText: string }) => {
  // Ən uzun açar sözü tapmaq üçün (məs: "int main" "int"-dən əvvəl yoxlanılsın)
  const activeKey = Object.keys(INFO_DATA)
    .sort((a, b) => b.length - a.length)
    .find(key => currentLineText.toLowerCase().includes(key.toLowerCase()));
    
  const info = activeKey ? INFO_DATA[activeKey] : null;

  return (
    // Genişlik w-72-dən w-96-ya qaldırıldı
    <div className="fixed right-8 top-24 w-96 z-30">
      <AnimatePresence mode="wait">
        {info ? (
          <motion.div
            key={activeKey}
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            // p-6-dan p-8-ə qaldırıldı, daha yumşaq künclər (rounded-3xl)
            className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-l-[6px] ${info.color} p-8 rounded-[2rem] shadow-2xl shadow-black/10 dark:shadow-black/40`}
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="text-5xl drop-shadow-md">{info.icon}</div>
              <div>
                <h3 className="font-black text-slate-800 dark:text-slate-100 text-xl leading-tight">
                  {info.title}
                </h3>
                {info.subtitle && (
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    {info.subtitle}
                  </span>
                )}
              </div>
            </div>

            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-6 font-medium">
              {info.description}
            </p>

            {/* Kod nümunəsi sahəsi böyüdü və daha professional dizayn edildi */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700 opacity-20 rounded-xl blur"></div>
              <div className="relative bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl font-mono text-sm text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700/50 overflow-x-auto whitespace-pre">
                <div className="flex gap-1.5 mb-2 opacity-30">
                   <div className="w-2 h-2 rounded-full bg-red-500" />
                   <div className="w-2 h-2 rounded-full bg-amber-500" />
                   <div className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                {info.example}
              </div>
            </div>

            {/* Əgər datanda tag-lar varsa, onları da burada göstərək */}
            {info.tags && (
              <div className="flex flex-wrap gap-2 mt-6">
                {info.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 rounded-full border border-slate-200 dark:border-slate-700">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] text-center bg-slate-50/30 dark:bg-slate-900/10 backdrop-blur-sm"
          >
            <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 border-t-blue-500 rounded-full animate-spin mx-auto mb-6 opacity-20" />
            <p className="text-sm text-slate-400 uppercase tracking-[0.3em] font-black italic">
              Köməkçi Panel
            </p>
            <p className="text-xs text-slate-400 mt-3 font-medium">Məlumat almaq üçün kursoru kodun üzərinə gətir.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};