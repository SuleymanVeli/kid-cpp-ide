import Editor, { loader, OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { useImperativeHandle, useRef, useState } from 'react';

import { registerCppProvider } from '../lib/monaco-helpers';
import { GridPopup } from './GridPopup';
import { InfoSidebar } from './InfoPanel';

const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

loader.config({ monaco });
export const CodeEditor = ({ code, onChange, isDark, ref }: any) => {
  const [popup, setPopup] = useState({ visible: false, top: 0, left: 0, filter: "" });

  const [currentLineText, setCurrentLineText] = useState("");

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const decoCollectionRef = useRef<monaco.editor.IEditorDecorationsCollection | null>(null);


  const getMainLineNumber = (model: monaco.editor.ITextModel) => {
    const lines = model.getLinesContent();
    return lines.findIndex(line => line.includes('int main')) + 1;
  };

  useImperativeHandle(ref, () => ({
    handleAddCode(snippet: string) {
      const editor = editorRef.current;
      if (!editor) return;

      // 1. Kitabxanadırsa (#include)
      if (snippet.startsWith('#include')) {
        const model = editor.getModel();
        const currentContent = model?.getValue() || "";
        if (currentContent.includes(snippet)) return; // Təkrar əlavə etmə

        const lines = currentContent.split('\n');
        let lastIncludeIndex = -1;
        lines.forEach((line, index) => {
          if (line.trim().startsWith('#include')) lastIncludeIndex = index;
        });

        if (lastIncludeIndex !== -1) {
          const lineNum = lastIncludeIndex + 2;
          editor.executeEdits("insert-lib", [{
            range: new monaco.Range(lineNum, 1, lineNum, 1),
            text: `${snippet}\n`,
            forceMoveMarkers: true
          }]);
        } else {
          editor.executeEdits("insert-lib-top", [{
            range: new monaco.Range(1, 1, 1, 1),
            text: `${snippet}\n`,
            forceMoveMarkers: true
          }]);
        }
      }
      // 2. Digər kodlar (Cursor olan yerə)
      else {

        const contribution = editor.getContribution('snippetController2') as any;

        if (contribution) {
          // Bu metod ${1:condition} sintaksisini başa düşür və emal edir
          contribution.insert(snippet);
        } else {
          // Əgər nəsə səhv getsə, köhnə metoduna qayıdır (ehtiyat variant)
          editor.executeEdits("insert-snippet", [{
            range: editor.getSelection()!,
            text: snippet,
            forceMoveMarkers: true
          }]);
        }
        editor.focus();
      }

      setPopup(prev => ({ ...prev, visible: false }));
    }
  }));

  const applyDecorations = (editor: monaco.editor.IStandaloneCodeEditor) => {
    const model = editor.getModel();
    if (!model) return;

    const newDecorations: monaco.editor.IModelDeltaDecoration[] = [];
    const text = model.getValue();



    // 1. Kitabxanalar və Tam Sətir Blokları
    const fullLinePattern = /^#include.*|^using\s+namespace\s+std;/gm;
    let match;

    while ((match = fullLinePattern.exec(text)) !== null) {
      const startPos = model.getPositionAt(match.index);
      const endPos = model.getPositionAt(match.index + match[0].length);

      newDecorations.push({
        range: new monaco.Range(startPos.lineNumber, 1, startPos.lineNumber, model.getLineMaxColumn(startPos.lineNumber)),
        options: {
          isWholeLine: false, // Sətirin hamısını yox, yalnız mətni bürüsün
          inlineClassName: 'unified-chip library-chip',
          stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
          zIndex: 10
        }
      });
    }

    const ioPattern = /\b(cin\s*>>|cout\s*<<|<<\s*endl)/g;
    while ((match = ioPattern.exec(text)) !== null) {
      const start = model.getPositionAt(match.index);
      const end = model.getPositionAt(match.index + match[0].length);

      newDecorations.push({
        range: new monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column),
        options: {
          inlineClassName: 'unified-chip io-chip',
          zIndex: 11
        }
      });
    }

    const mainPattern = /main\s*\(\s*\)/g;
    while ((match = mainPattern.exec(text)) !== null) {
      const start = model.getPositionAt(match.index);
      const end = model.getPositionAt(match.index + match[0].length);

      newDecorations.push({
        range: new monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column),
        options: {
          inlineClassName: 'unified-chip main-chip',
          zIndex: 15
        }
      });
    }

    const endlPattern = /<<\s*endl\s*;/g;
    while ((match = endlPattern.exec(text)) !== null) {
      const start = model.getPositionAt(match.index);
      const end = model.getPositionAt(match.index + match[0].length);

      newDecorations.push({
        range: new monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column),
        options: {
          inlineClassName: 'unified-chip endl-chip',
          zIndex: 12
        }
      });
    }

    // 2. Tiplər (int, float və s.) - Bunlar qısa olduğu üçün fərqli davranır
    const typePattern = /\b(int|float|double|string|bool|char)\b/g;
    typePattern.lastIndex = 0;
    while ((match = typePattern.exec(text)) !== null) {
      const start = model.getPositionAt(match.index);
      const end = model.getPositionAt(match.index + match[0].length);

      newDecorations.push({
        range: new monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column),
        options: {
          inlineClassName: 'unified-chip type-chip',
          zIndex: 11
        }
      });
    }

    if (!decoCollectionRef.current) {
      decoCollectionRef.current = editor.createDecorationsCollection(newDecorations);
    } else {
      decoCollectionRef.current.set(newDecorations);
    }
  };

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;

    // SEÇİM MENYUSU (Autocomplete) YARATMAQ
    const provider = registerCppProvider();


    // 1. Kursorun vizual koordinatlarını tapmaq üçün köməkçi funksiya
    const updatePopupPosition = () => {
      const position = editor.getPosition();
      if (!position) return;

      // Kursorun ekrandakı piksellərlə yerini alırıq
      const contentPos = editor.getScrolledVisiblePosition(position);
      const editorEl = editor.getDomNode();
      if (contentPos && editorEl) {
        const rect = editorEl.getBoundingClientRect();
        setPopup(prev => ({
          ...prev,
          top: contentPos.top + rect.top + 35, // Bir az aşağıda
          left: contentPos.left + rect.left
        }));
      }
    };

    editor.onDidChangeCursorPosition((e) => {
      const model = editor.getModel();
      if (model) {
        const lineContent = model.getLineContent(e.position.lineNumber);
        setCurrentLineText(lineContent); // Sətir mətnini state-ə yazırıq
      }
    });

    // Atomik silmə (Backspace basanda bütün bloku silir)
    editor.onKeyDown((e) => {


      if (e.ctrlKey && e.keyCode === monaco.KeyCode.Space) {
        e.preventDefault();

        const position = editor.getPosition();

        console.log("position", position)

        if (!position) return;

        // Kursorun editor daxilindəki dəqiq koordinatları
        const contentPos = editor.getScrolledVisiblePosition(position);
        const editorDom = editor.getDomNode();
        const model = editor.getModel();

        console.log("contentPos", contentPos)
        if (contentPos && editorDom) {
          const rect = editorDom.getBoundingClientRect();

          const mainLine = getMainLineNumber(model);
          const isAboveMain = position.lineNumber < mainLine;
          const currentCode = model?.getValue();


          setPopup({
            visible: true,
            // Ekrana görə mütləq mövqe:
            // rect.top (editorun yuxarı sərhədi) + contentPos.top (kursorun sətir hündürlüyü)
            top: contentPos.top < 300 ? contentPos.top : 300,
            left: contentPos.left + 100 < 800 ? contentPos.left + 100 : 800,
            filter: "",
            context: isAboveMain ? 'top' : 'body',
            existingCode: currentCode
          });
        }
      }

      // Esc basanda popup bağlansın
      if (e.keyCode === monaco.KeyCode.Escape) {
        setPopup(prev => ({ ...prev, visible: false }));
      }

      if (e.keyCode === monaco.KeyCode.Backspace) {
        const position = editor.getPosition();
        if (!position) return;

        const model = editor.getModel();
        if (!model) return;

        // Kursorun olduğu sətirdəki bütün dekorasiyaları götürürük
        const lineDecorations = editor.getLineDecorations(position.lineNumber) || [];

        // Chip-i tapmaq üçün daha dəqiq yoxlama
        const chip = lineDecorations.find(d => {
          const className = d.options.inlineClassName || "";
          const isOurChip = className.includes('unified-chip') ||
            className.includes('library-chip') ||
            className.includes('type-chip');

          if (!isOurChip) return false;

          const range = d.range;
          // Kursor chip-in içindədirsə və ya düz sağındadırsa (silməyə başlayanda)
          return position.column > range.startColumn && position.column <= range.endColumn;
        });

        if (chip) {
          // Standart silməni dayandırırıq
          e.preventDefault();
          e.stopPropagation();

          // Diapazonu model-dən birbaşa alırıq ki, kursor sürüşməsi olmasın
          const rangeToDelete = new monaco.Range(
            chip.range.startLineNumber,
            chip.range.startColumn,
            chip.range.endLineNumber,
            chip.range.endColumn
          );

          // Atomik silmə əməliyyatı
          editor.executeEdits("atomic-delete", [
            {
              range: rangeToDelete,
              text: "",
              forceMoveMarkers: true // Kursoru silinmiş hissənin yerinə çəkir
            }
          ]);

          // Silmədən sonra dekorasiyaları dərhal yenilə ki, qalıq qalmasın
          setTimeout(() => applyDecorations(editor), 10);
        }
      }
    });

    // const debouncedApplyDecorations = debounce((editor: monaco.editor.IStandaloneCodeEditor) => {
    //   applyDecorations(editor);
    // }, 1000);

    editor.onDidChangeModelContent(() => {
      // Dərhal çağırmırıq, debounce-a ötürürük
        applyDecorations(editor);
    });

    // İlk açılışda dərhal göstərmək üçün (yalnız bir dəfə)
    applyDecorations(editor);

    return () => provider.dispose();
  };

  return (
    <div className="w-full h-full">
      <Editor
        height="100%"
        defaultLanguage="cpp"
        theme={isDark ? "vs-dark" : "light"}
        value={code}
        onMount={handleEditorDidMount}
        onChange={onChange}
        options={{
          fontFamily: '"JetBrains Mono", monospace',
          lineHeight: 40, // Burada rəqəm olaraq veririk
          fontSize: 20,   // Font ölçüsünə uyğun tənzimləyərsən
          padding: { top: 10 },


          parameterHints: { enabled: false },
          quickSuggestions: false,
          suggestOnTriggerCharacters: false,
          acceptSuggestionOnEnter: "off", // Enter basanda təsadüfən bir şey seçməsin
          tabCompletion: "off",           // Tab ilə tamamlama işləməsin
          wordBasedSuggestions: "off",   // Yazdığın sözlərə əsasən təklif verməsin
          suggest: {
            showMethods: false,
            showFunctions: false,
            showConstructors: false,
            showFields: false,
            showVariables: false,
            showClasses: false,
            showStructs: false,
            showInterfaces: false,
            showModules: false,
            showProperties: false,
            showEvents: false,
            showOperators: false,
            showUnits: false,
            showValues: false,
            showConstants: false,
            showEnums: false,
            showEnumMembers: false,
            showKeywords: false,
            showSnippets: false,
            showColors: false,
            showFiles: false,
            showReferences: false,
            showFolders: false,
            showTypeParameters: false
          }
        }}
      />

      {popup.visible && (
        <GridPopup
          position={{ top: popup.top, left: popup.left }}
          onSelect={(snip) => (ref as any).current.handleAddCode(snip)}
          onClose={() => setPopup(prev => ({ ...prev, visible: false }))}
        />
      )}

      <aside className="p-4 bg-slate-50 dark:bg-black/50 border-l border-slate-200 dark:border-slate-800 h-full overflow-y-auto">
        <InfoSidebar currentLineText={currentLineText} />
      </aside>
    </div>
  );
};