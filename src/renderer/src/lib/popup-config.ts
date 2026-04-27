export const POPUP_SECTIONS = [
  {
    title: "Giriş / Çıxış",
    color: "pink",
    items: [
      { id: 'cout', label: 'cout <<', snippet: 'cout << "${1}";', color: 'bg-pink-500/10 text-pink-600' },
      { id: 'cin', label: 'cin >>', snippet: 'cin >> ${1};', color: 'bg-pink-500/10 text-pink-600' },
      { id: 'endl', label: '<< endl;', snippet: ' << endl;', color: 'bg-slate-500/10 text-slate-600' },
    ]
  },
  {
    title: "Məntiq",
    color: "orange",
    items: [
      { id: 'if', label: 'if', snippet: 'if (${1}) {\n\t${0}\n}', color: 'bg-orange-500/10 text-orange-600' },
      { id: 'ifelse', label: 'if else', snippet: 'if (${1}) {\n\t${2}\n} else {\n\t${0}\n}', color: 'bg-orange-500/10 text-orange-600' },
      { id: 'elif', label: 'else if', snippet: 'else if (${1}) {\n\t${0}\n}', color: 'bg-orange-500/10 text-orange-600' },
    ]
  },
  {
    title: "Dövrlər",
    color: "purple",
    items: [
      { id: 'fori', label: 'for (i)', snippet: 'for (int i = 0; i < ${1:n}; i++) {\n\t${0}\n}', color: 'bg-purple-500/10 text-purple-600' },
      { id: 'foreach', label: 'for (:)', snippet: 'for (auto &${1:x} : ${2:container}) {\n\t${0}\n}', color: 'bg-purple-500/10 text-purple-600' },
      { id: 'while', label: 'while', snippet: 'while (${1}) {\n\t${0}\n}', color: 'bg-indigo-500/10 text-indigo-600' },
    ]
  },
  {
    title: "Tiplər & Strukturlar",
    color: "blue",
    items: [
      { id: 'int', label: 'int', snippet: 'int ', color: 'bg-blue-500/10 text-blue-600' },
      { id: 'double', label: 'double', snippet: 'double ', color: 'bg-blue-500/10 text-blue-600' },
      { id: 'string', label: 'string', snippet: 'string ', color: 'bg-blue-500/10 text-blue-600' },
      { id: 'char', label: 'char', snippet: 'char ', color: 'bg-blue-500/10 text-blue-600' },
      { id: 'long', label: 'long long', snippet: 'long long ', color: 'bg-blue-500/10 text-blue-600' },
      { id: 'vector', label: 'vector', snippet: 'vector<${1:int}> ${2:v};', color: 'bg-cyan-500/10 text-cyan-600' },
      { id: 'set', label: 'set', snippet: 'set<${1:int}> ${2:s};', color: 'bg-cyan-500/10 text-cyan-600' },
      { id: 'array', label: 'array', snippet: '${1:int} ${2:arr}[${3:100}];', color: 'bg-cyan-500/10 text-cyan-600' },
    ]
  }
];