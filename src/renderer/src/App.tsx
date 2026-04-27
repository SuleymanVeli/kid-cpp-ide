import { useRef, useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CodeEditor } from './components/Editor';
import { Terminal } from './components/Terminal';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [code, setCode] = useState(
    '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Salam, Kiber Qəhrəman!" << endl;\n    return 0;\n}'
  );
  const [terminalOutput, setTerminalOutput] = useState('Sistem hazırdır...');

  const editorRef = useRef<any>(null);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  
  const handleBlockClick = (snippet: string) => {
    // Editor daxilindəki handleAddCode funksiyasını çağırırıq
    if (editorRef.current) {
      editorRef.current.handleAddCode(snippet);
    }
  };

  const handleRunCode = async () => {
    if (window.electronAPI) {

      const result = await window.electronAPI.runCode(code);

      console.log(result)
      setTerminalOutput(result.output);
    }
  };

  // const handleRunCode = async () => {
  //   setTerminalOutput('Hazırlanır... 🛠️');

  //   try {
  //     // @ts-ignore (electronAPI preload-dan gəlir)
  //     const result = await window.electronAPI.runCpp(code);

  //     if (result.success) {
  //       setTerminalOutput(result.output);
  //     } else {
  //       setTerminalOutput(`Xəta baş verdi:\n${result.output}`);
  //     }
  //   } catch (err) {

  //     console.log(err)
  //     setTerminalOutput('Sistem xətası: Compiler tapılmadı (g++ quraşdırılmayıb?)');
  //   }
  // };

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300 overflow-hidden">

      {/* 1. Header - Radius azaldıldı (rounded-none və ya kiçik) */}
      <Header onRun={handleRunCode} isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden">

        {/* 2. Sidebar - Radius: 12px (rounded-xl) */}
        <Sidebar onAddCode={handleBlockClick} />

        {/* 3. Editor - Radius: 12px (rounded-xl) */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col min-h-[300px]">

          <div className="flex-1 relative">
            <CodeEditor
              ref={editorRef} 
              code={code}
              onChange={(val) => setCode(val || '')}
              isDark={isDark}
            />
          </div>
        </div>
      </main>

      {/* 4. Terminal - Radius: 12px (rounded-xl) */}
      <Terminal output={terminalOutput} />
    </div>
  );
}

export default App;