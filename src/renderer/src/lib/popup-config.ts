export const POPUP_SECTIONS = [
  {
    title: "Kitabxanalar",
    color: "emerald",
    items: [
      { id: 'inc_io', label: '#include <iostream>', snippet: '#include <iostream>\n', color: 'bg-emerald-500/10 text-emerald-600' },
      { id: 'inc_bits', label: '#include <bits/stdc++.h>', snippet: '#include <bits/stdc++.h>\n', color: 'bg-emerald-600/20 text-emerald-700' },
      { id: 'inc_vector', label: '#include <vector>', snippet: '#include <vector>\n', color: 'bg-emerald-500/10 text-emerald-600' },
      { id: 'inc_algo', label: '#include <algorithm>', snippet: '#include <algorithm>\n', color: 'bg-emerald-500/10 text-emerald-600' },
      { id: 'inc_string', label: '#include <string>', snippet: '#include <string>\n', color: 'bg-emerald-500/10 text-emerald-600' },
      { id: 'inc_math', label: '#include <cmath>', snippet: '#include <cmath>\n', color: 'bg-emerald-500/10 text-emerald-600' },
      { id: 'using_std', label: 'using namespace std;', snippet: 'using namespace std;\n', color: 'bg-slate-600/10 text-slate-700' },
    ]
  },
  {
    title: "Funksiyalar",
    color: "amber",
    items: [
      { id: 'main', label: 'int main()', snippet: 'int main() {\n\t${0}\n\treturn 0;\n}', color: 'bg-amber-600/20 text-amber-700' },
      { id: 'void_fn', label: 'void fn()', snippet: 'void ${1:funcName}(${2}) {\n\t${0}\n}', color: 'bg-amber-500/10 text-amber-600' },
      { id: 'int_fn', label: 'int fn()', snippet: 'int ${1:funcName}(${2}) {\n\t${0}\n\treturn ${3:0};\n}', color: 'bg-amber-500/10 text-amber-600' },
      { id: 'bool_fn', label: 'bool fn()', snippet: 'bool ${1:funcName}(${2}) {\n\t${0}\n\treturn ${3:true};\n}', color: 'bg-amber-500/10 text-amber-600' },
      { id: 'return', label: 'return', snippet: 'return ${1};', color: 'bg-slate-500/10 text-slate-600' },
    ]
  },
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