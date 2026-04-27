export const INFO_DATA: Record<string, any> = {
  // --- FUNDAMENTALS ---
  '#include': {
    title: 'Kitabxana Qoşulması',
    subtitle: 'Pre-processor Directive',
    description: 'Xarici kitabxanaları proqrama daxil edir. Məsələn, <iostream> daxil etmədən cout və cin işləmir.',
    example: '#include <iostream>',
    color: 'border-indigo-500',
    glow: 'shadow-indigo-500/20',
    tags: ['Setup', 'Library'],
    icon: '📚'
  },
  'iostream': {
    title: 'Giriş-Çıxış Axını',
    subtitle: 'Standard Library',
    description: 'C++ proqramlarında təməl giriş-çıxış (input-output) əməliyyatlarını təmin edən ana kitabxanadır.',
    example: 'using namespace std;',
    color: 'border-blue-400',
    glow: 'shadow-blue-400/20',
    tags: ['I/O', 'Essential'],
    icon: '📥'
  },
  'int main': {
    title: 'Giriş Nöqtəsi',
    subtitle: 'Main Function',
    description: 'Proqramın icrasının başladığı yerdir. Hər bir C++ proqramında mütləq bir main funksiyası olmalıdır.',
    example: 'int main() {\n  return 0;\n}',
    color: 'border-emerald-500',
    glow: 'shadow-emerald-500/20',
    tags: ['Entry', 'Core'],
    icon: '🚀'
  },

  // --- LOGIC & LOOPS ---
  'if': {
    title: 'Şərt Strukturu (if)',
    description: 'Proqramın "qərar vermə" mexanizmidir. Mötərizə daxilindəki şərt DOĞRU (true) olarsa, blok daxilindəki kodlar işləyir.',
    example: 'if (yas > 18) { ... }',
    color: 'border-orange-500',
    glow: 'shadow-orange-500/20',
    tags: ['Logic', 'Decision'],
    icon: '🤔'
  },
  'else': {
    title: 'Alternativ Şərt',
    description: 'if şərti ödənmədikdə (false olduqda) işə düşən blokdur.',
    example: 'if (x > 5) { ... } else { ... }',
    color: 'border-orange-600',
    glow: 'shadow-orange-600/20',
    tags: ['Logic', 'Flow'],
    icon: '🛤️'
  },
  'for': {
    title: 'Dövr Operatoru (for)',
    description: 'Müəyyən bir işi təkrar-təkrar görmək üçün istifadə olunur. Başlanğıc, şərt və artım hissələrindən ibarətdir.',
    example: 'for(int i=0; i<10; i++)',
    color: 'border-purple-500',
    glow: 'shadow-purple-500/20',
    tags: ['Loop', 'Iteration'],
    icon: '🔁'
  },
  'while': {
    title: 'Şərtli Dövr',
    description: 'Şərt doğru olduğu müddətcə təkrar edir. Dövr sayının öncədən bilinmədiyi hallarda idealdır.',
    example: 'while(say < 100) { ... }',
    color: 'border-cyan-500',
    glow: 'shadow-cyan-500/20',
    tags: ['Loop', 'Condition'],
    icon: '♻️'
  },

  // --- DATA TYPES ---
  'int': {
    title: 'Tam Ədəd Tipi',
    subtitle: 'Integer',
    description: 'Kəsr hissəsi olmayan tam ədədləri saxlamaq üçündür. Adətən 4 byte yer tutur.',
    example: 'int x = 10;',
    color: 'border-blue-500',
    glow: 'shadow-blue-500/20',
    tags: ['Data', 'Numeric'],
    icon: '🔢'
  },
  'double': {
    title: 'Kəsr Ədəd Tipi',
    subtitle: 'Floating Point',
    description: 'Yüksək dəqiqlikli kəsr (onluq) ədədləri saxlamaq üçün istifadə olunur.',
    example: 'double pi = 3.14;',
    color: 'border-sky-400',
    glow: 'shadow-sky-400/20',
    tags: ['Data', 'Math'],
    icon: '📉'
  },
  'string': {
    title: 'Mətn Tipi',
    subtitle: 'Text Data',
    description: 'Simvollar silsiləsini (cümlə, söz) saxlamaq üçün istifadə olunur.',
    example: 'string ad = "Ali";',
    color: 'border-teal-400',
    glow: 'shadow-teal-400/20',
    tags: ['Text', 'STL'],
    icon: '📝'
  },

  // --- I/O ---
  'cout': {
    title: 'Çıxış Əmri (cout)',
    description: 'Ekrana məlumat yazdırmaq üçün istifadə olunur. "Console Out" sözünün qısaltmasıdır.',
    example: 'cout << "Salam";',
    color: 'border-pink-500',
    glow: 'shadow-pink-500/20',
    tags: ['Output', 'Stream'],
    icon: '📤'
  },
  'cin': {
    title: 'Giriş Əmri (cin)',
    description: 'İstifadəçidən məlumat almaq üçün istifadə olunur. "Console In" sözünün qısaltmasıdır.',
    example: 'cin >> yas;',
    color: 'border-rose-500',
    glow: 'shadow-rose-500/20',
    tags: ['Input', 'User'],
    icon: '📥'
  },
  'endl': {
    title: 'Sətir Sonu',
    description: 'Çıxış zamanı kursoru yeni sətrə keçirir və buferi təmizləyir.',
    example: 'cout << endl;',
    color: 'border-slate-400',
    glow: 'shadow-slate-400/20',
    tags: ['Formatting'],
    icon: '⏎'
  },

  // --- OTHERS ---
  'return': {
    title: 'Geri Qaytarma',
    description: 'Funksiyanın işini sonlandırır və lazım gələrsə bir dəyər qaytarır.',
    example: 'return 0;',
    color: 'border-red-500',
    glow: 'shadow-red-500/20',
    tags: ['Core', 'Function'],
    icon: '↩️'
  },
  'vector': {
    title: 'Dinamik Massiv',
    subtitle: 'std::vector',
    description: 'Ölçüsü avtomatik böyüyə bilən massiv tipidir. STL konteyneridir.',
    example: 'vector<int> v;',
    color: 'border-yellow-500',
    glow: 'shadow-yellow-500/20',
    tags: ['Container', 'STL'],
    icon: '📦'
  }
};