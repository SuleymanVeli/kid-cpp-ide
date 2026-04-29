import Editor, { loader, OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { useImperativeHandle, useRef, useState, useCallback } from 'react';
import { registerCppProvider } from '../lib/monaco-helpers';
import { GridPopup } from './GridPopup';
import { InfoSidebar } from './InfoPanel';

loader.config({ monaco });

// Debounce funksiyasını kənarda saxlayırıq ki, render zamanı yenidən yaranmasın
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const CodeEditor = ({ code, onChange, isDark, ref }: any) => {
  const [popup, setPopup] = useState({ visible: false, top: 0, left: 0, filter: "", context: 'body' });
  const [currentLineText, setCurrentLineText] = useState("");
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const decoCollectionRef = useRef<monaco.editor.IEditorDecorationsCollection | null>(null);

  // 1. Dekorasiyaları tətbiq edən əsas funksiya
  const applyDecorations = useCallback((editor: monaco.editor.IStandaloneCodeEditor) => {
    const model = editor.getModel();
    if (!model) return;

    const text = model.getValue();
    const newDecorations: monaco.editor.IModelDeltaDecoration[] = [];

    // Pattern-lər (Bütün açarları INFO_DATA-dan dinamik çəkə bilərsən və ya sabit saxlaya bilərsən)
    const patterns = [
      { regex: /^#include.*|^using\s+namespace\s+std;/gm, className: 'library-chip' },
      { regex: /\b(int|float|double|string|bool|char)\b/g, className: 'type-chip' },
      { regex: /\b(cin\s*>>|cout\s*<<|<<\s*endl)\b/g, className: 'io-chip' },
      { regex: /main\s*\(\s*\)/g, className: 'main-chip' }
    ];

    patterns.forEach(({ regex, className }) => {
      let match;
      while ((match = regex.exec(text)) !== null) {
        const start = model.getPositionAt(match.index);
        const end = model.getPositionAt(match.index + match[0].length);
        newDecorations.push({
          range: new monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column),
          options: {
            inlineClassName: `unified-chip ${className}`,
            stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
            zIndex: 10
          }
        });
      }
    });

    if (!decoCollectionRef.current) {
      decoCollectionRef.current = editor.createDecorationsCollection(newDecorations);
    } else {
      decoCollectionRef.current.set(newDecorations);
    }
  }, []);

  // 2. Sürətli yazanda kursoru qoruyan debounce
  const debouncedApply = useCallback(debounce((editor: monaco.editor.IStandaloneCodeEditor) => {
    const pos = editor.getPosition(); // Kursorun yerini yadda saxla
    applyDecorations(editor);
    if (pos) editor.setPosition(pos); // Dekorasiyadan sonra kursoru zorla geri qaytar
  }, 50), [applyDecorations]);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    const provider = registerCppProvider();

    editor.updateOptions({ glyphMargin: true });

    // Kursor hərəkətini izlə (Sidebar üçün)
    editor.onDidChangeCursorPosition((e) => {
      const model = editor.getModel();
      if (model) {
        setCurrentLineText(model.getLineContent(e.position.lineNumber));
      }
    });

    // Mətn dəyişəndə (Yazanda)
    editor.onDidChangeModelContent(() => {
      debouncedApply(editor);
    });

    // Klaviatura hadisələri
    editor.onKeyDown((e) => {
      // Ctrl + Space: Popup açılması
      if (e.ctrlKey && e.keyCode === monaco.KeyCode.Space) {
        e.preventDefault();
        const pos = editor.getPosition();
        const contentPos = editor.getScrolledVisiblePosition(pos!);
        const editorDom = editor.getDomNode();
        if (contentPos && editorDom) {
          setPopup({
            visible: true,
            top: contentPos.top < 300 ? contentPos.top : 300,
            left: contentPos.left + 100 < 800 ? contentPos.left + 100 : 800,
            filter: "",
            context: 'body'
          });
        }
      }

      // Backspace: Atomik silmə
      if (e.keyCode === monaco.KeyCode.Backspace) {
        const pos = editor.getPosition();
        if (!pos) return;

        const lineDecos = editor.getLineDecorations(pos.lineNumber) || [];
        const chip = lineDecos.find(d =>
          (d.options.inlineClassName?.includes('unified-chip')) &&
          pos.column > d.range.startColumn && pos.column <= d.range.endColumn
        );

        if (chip) {
          e.preventDefault();
          editor.executeEdits("atomic-delete", [{
            range: chip.range,
            text: "",
            forceMoveMarkers: true
          }]);
          applyDecorations(editor); // Silinəndə dərhal yenilə
        }
      }
    });

    applyDecorations(editor);
    return () => provider.dispose();
  };

  useImperativeHandle(ref, () => ({
    handleAddCode(snippet: string) {
      const editor = editorRef.current;
      if (!editor) return;

      const contribution = editor.getContribution('snippetController2') as any;
      if (contribution) {
        contribution.insert(snippet);
      } else {
        editor.executeEdits("insert", [{
          range: editor.getSelection()!,
          text: snippet,
          forceMoveMarkers: true
        }]);
      }
      editor.focus();
      setPopup(prev => ({ ...prev, visible: false }));
    }
  }));

  return (
    <div className="flex w-full h-full overflow-hidden">
      <div className="relative flex-1 h-full bg-white dark:bg-[#1e1e1e]">
        <Editor
          height="100%"
          defaultLanguage="cpp"
          theme={isDark ? "vs-dark" : "light"}
          value={code}
          onMount={handleEditorDidMount}
          onChange={onChange}
          options={{            
            fontFamily: '"JetBrains Mono", monospace',
            lineHeight: 40,
            fontSize: 20,
            padding: { top: 20 },
            scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
            minimap: { enabled: false },
            quickSuggestions: false,
            folding: false,
            glyphMargin: false,
          }}
        />

        {popup.visible && (
          <GridPopup
            position={{ top: popup.top, left: popup.left }}
            onSelect={(snip) => (ref as any).current.handleAddCode(snip)}
            onClose={() => setPopup(prev => ({ ...prev, visible: false }))}
          />
        )}      
      </div>

      {/* <aside className="w-96 border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0f172a] h-full overflow-y-auto">
        <InfoSidebar currentLineText={currentLineText} />
      </aside> */}
    </div>
  );
};