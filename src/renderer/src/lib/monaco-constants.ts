export const CPP_LIBRARIES = [
  { name: 'iostream', desc: 'Giriş-çıxış (cin, cout)' },
  { name: 'vector', desc: 'Dinamik massiv' },
  { name: 'algorithm', desc: 'Sıralama və axtarış' },
  { name: 'string', desc: 'Mətn tipi' },
  { name: 'cmath', desc: 'Riyazi funksiyalar' },
  { name: 'map', desc: 'Açar-dəyər cütlüyü' },
  { name: 'set', desc: 'Unikal elementlər' },
  { name: 'queue', desc: 'Növbə (FIFO)' },
  { name: 'stack', desc: 'Yığın (LIFO)' },
  { name: 'iomanip', desc: 'Giriş-çıxış tənzimləmə' },
  { name: 'bitset', desc: 'Bit əməliyyatları' },
  { name: 'numeric', desc: 'Ədədi əməliyyatlar (accumulate)' }
];

export const CPP_SNIPPETS = [
  {
    label: 'main',
    insertText: 'int main() {\n\t${1}\n\treturn 0;\n}',
    desc: 'Əsas funksiya strukturu'
  },
  {
    label: 'using',
    insertText: 'using namespace std;',
    desc: 'Standart ad sahəsi'
  },
  {
    label: 'for',
    insertText: 'for(int i = 0; i < ${1:n}; i++) {\n\t${2}\n}',
    desc: 'Dövr operatoru'
  }
];

export const CATEGORIES = [
  { 
    id: 'lib', 
    icon: '📦', 
    color: 'bg-blue-500', 
    label: 'Kitabxanalar',
    items: CPP_LIBRARIES.map(lib => ({
      label: lib.name,
      snippet: `#include <${lib.name}>`
    }))
  },
  { 
    id: 'logic', 
    icon: '🤔', 
    color: 'bg-orange-500', 
    label: 'Məntiq',
    items: [
      { label: 'Əgər (if)', snippet: 'if (şərt) {\n    \n}' },
      { label: 'Yoxsa (else)', snippet: 'else {\n    \n}' },
      { label: 'Yazı Çıxar (cout)', snippet: 'cout << "Salam!" << endl;' }
    ]
  },
  { 
    id: 'loops', 
    icon: '🔄', 
    color: 'bg-purple-500', 
    label: 'Dövrlər',
    items: [
      { label: 'Sayıcı Dövrü (for)', snippet: 'for (int i = 0; i < 10; i++) {\n    \n}' },
      { label: 'Şərtli Dövr (while)', snippet: 'while (şərt) {\n    \n}' }
    ]
  },
  { 
    id: 'vars', 
    icon: '📥', 
    color: 'bg-yellow-500', 
    label: 'Dəyişənlər',
    items: [
      { label: 'Tam Ədəd (int)', snippet: 'int dəyişən_adı = 0;' },
      { label: 'Mətn (string)', snippet: 'string ad = "User";' },
      { label: 'Həqiqi Ədəd (double)', snippet: 'double qiymət = 0.0;' }
    ]
  },
];