import { POPUP_SECTIONS } from '../lib/popup-config';

export const GridPopup = ({ position, onSelect, onClose, context, existingCode }: any) => {
  
  const filteredSections = POPUP_SECTIONS.map(section => {
    if (context === 'top') {
      if (section.title !== "Kitabxanalar") return null;
      const newItems = section.items.filter(item => !existingCode.includes(item.snippet));
      return { ...section, items: newItems };
    }
    if (section.title === "Kitabxanalar") return null;
    return section;
  }).filter(Boolean);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div 
        className="absolute z-50 bg-white/98 dark:bg-slate-900/98 backdrop-blur-3xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-4 w-[380px] animate-in zoom-in-95 duration-150"
        style={{ top: position.top, left: position.left }}
      >
        <div className="flex flex-col gap-4">
          {filteredSections.map((section: any) => (
            <div key={section.title} className="flex flex-col gap-2">
              {/* Bölmə Başlığı */}
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter border-b border-slate-100 dark:border-slate-800 pb-1">
                {section.title}
              </div>
              
              {/* Kiçik Butonlar Grid-i */}
              <div className="flex flex-wrap gap-2">
                {section.items.map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => onSelect(item.snippet)}
                    className={`
                      px-3 py-1.5 rounded-lg text-[13px] font-mono font-bold
                      transition-all duration-100 active:scale-90
                      hover:brightness-95 dark:hover:brightness-125
                      ${item.color || 'bg-slate-100 text-slate-600'}
                    `}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};