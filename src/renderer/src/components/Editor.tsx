import Editor, { loader, OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { useImperativeHandle, useRef, useState, useCallback } from 'react';
// import { registerCppProvider } from '../lib/monaco-helpers'; // Lazım olsa açarsan
import { GridPopup } from './GridPopup';
// import { InfoSidebar } from './InfoPanel'; // Lazım olsa açarsan

loader.config({ monaco });

const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const CodeEditor = ({ code, onChange, isDark, ref }: any) => {
  const [popup, setPopup] = useState({ visible: false, top: 0, left: 0, filter: "", context: 'body' });
  // currentLineText-i saxlayırıq, bəlkə Sidebar üçün lazım olar
  const [currentLineText, setCurrentLineText] = useState("");
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const decoCollectionRef = useRef<monaco.editor.IEditorDecorationsCollection | null>(null);

  // Yazı yazma taymeri üçün ref
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Funksiyalar (Dəyişməyib) ---
  const getEditorContext = useCallback((editor: monaco.editor.IStandaloneCodeEditor) => {
    const pos = editor.getPosition();
    if (!pos) return 'body';
    const model = editor.getModel();
    const lineText = model?.getLineContent(pos.lineNumber) || "";
    const isIncludeArea = lineText.includes("#include") || pos.lineNumber === 1;
    let onlyIncludesAbove = true;
    for (let i = 1; i < pos.lineNumber; i++) {
      const text = model?.getLineContent(i).trim();
      if (text !== "" && !text?.startsWith("#include") && !text?.startsWith("using")) {
        onlyIncludesAbove = false;
        break;
      }
    }
    return (isIncludeArea || onlyIncludesAbove) ? 'top' : 'body';
  }, []);

  const openPopupAtCursor = useCallback((editor: monaco.editor.IStandaloneCodeEditor) => {
    const pos = editor.getPosition();
    if (!pos) return;

    const context = getEditorContext(editor);
    const contentPos = editor.getScrolledVisiblePosition(pos);

    if (contentPos) {
      setPopup({
        visible: true,
        top: contentPos.top + 20, // Bir az aşağı
        left: contentPos.left + 30, // Bir az sağa
        filter: "",
        context: context
      });
    }
  }, [getEditorContext]);

  // --- Dekorasiyalar (Dəyişməyib) ---
  const applyDecorations = useCallback((editor: monaco.editor.IStandaloneCodeEditor) => {
    const model = editor.getModel();
    if (!model) return;
    const text = model.getValue();
    const newDecorations: monaco.editor.IModelDeltaDecoration[] = [];
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

  const debouncedApply = useCallback(debounce((editor: monaco.editor.IStandaloneCodeEditor) => {
    applyDecorations(editor);
  }, 50), [applyDecorations]);

  // --- ON MOUNT ---
  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    // const provider = registerCppProvider(); // Lazım olsa açarsan

    editor.updateOptions({ glyphMargin: true });

    // --- STRICKER WIDGET MƏNTİQİ ---

    const triggerSticker = () => {
      // Stikeri dərhal gizlət
      stickerDomNode.style.opacity = "0";
      stickerDomNode.style.pointerEvents = "none";

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        // Kursorun yeni yerinə görə mövqeyi hesabla
        editor.layoutContentWidget(stickerWidget);

        // Animasiya ilə göstər
        stickerDomNode.style.opacity = "1";
        stickerDomNode.style.pointerEvents = "auto";

        // Dekorasiyaları da bu arada yeniləyə bilərsən
        debouncedApply(editor);
      }, 800); // 800ms kursor sabit qaldıqda görünür
    };

    // 1. DOM Elementini yarat
    const stickerDomNode = document.createElement('div');
    stickerDomNode.className = 'cursor-plus-sticker';
    stickerDomNode.style.opacity = "0"; // Əvvəlcə gizli

    // 2. Klik hadisəsini birbaşa DOM-a bağla
    stickerDomNode.onclick = (e) => {
      e.stopPropagation(); // Editorun öz klik hadisələrini dayandır
      e.preventDefault();
      openPopupAtCursor(editor);
    };

    // 3. Monaco ContentWidget obyektini təriflə
    const stickerWidget: monaco.editor.IContentWidget = {
      getId: () => 'cursor.plus.sticker',
      getDomNode: () => stickerDomNode,
      getPosition: () => ({
        // Bu funksiya hər dəfə layoutContentWidget çağırılanda işləyir
        position: editor.getPosition(),
        // EXACT mövqe, CSS transform ilə tənzimlənəcək
        preference: [monaco.editor.ContentWidgetPositionPreference.EXACT]
      })
    };

    // 4. Widget-i editora əlavə et
    editor.addContentWidget(stickerWidget);

    // --- HADİSƏLƏR (EVENTS) ---

    // A. Kursor hərəkət edəndə (Yanıb-sönən xətt yerini dəyişəndə)
    editor.onDidChangeCursorPosition((e) => {
      const model = editor.getModel();
      if (model) {
        setCurrentLineText(model.getLineContent(e.position.lineNumber));
      }

      // Kursor hərəkət edən kimi stikerin də yerini yenilə (izləsin)
      // Əgər yazmırsa, dərhal görünsün
      triggerSticker();
    });

    // B. Mətn dəyişəndə (Yazanda)
    editor.onDidChangeModelContent(() => {

      triggerSticker();
      // Yazmağa başlayanda dərhal gizlət
      
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

     
    });

    // C. Klaviatura (Dəyişməyib)
    editor.onKeyDown((e) => {
      if (e.ctrlKey && e.keyCode === monaco.KeyCode.Space) {
        e.preventDefault();
        openPopupAtCursor(editor);
      }

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
          applyDecorations(editor);
        }
      }
    });

    // İlk dekorasiyaları vur
    applyDecorations(editor);

    // Clean-up
    return () => {
      // provider.dispose();
      editor.removeContentWidget(stickerWidget);
    };
  };

 useImperativeHandle(ref, () => ({
  handleAddCode(snippet: string) {
    const editor = editorRef.current;
    if (!editor) return;

    const model = editor.getModel();
    const pos = editor.getPosition();
    
    if (model && pos) {
      // Kursorun olduğu sətrin mətnini alırıq
      const lineContent = model.getLineContent(pos.lineNumber).trim();
      
      // Yoxlayırıq: Sətirdə ;, { və ya } varmı?
      const shouldAddNewLine = /[;{}]/.test(lineContent);
      
      // Əgər varsa, snippet-in başına yeni sətir əlavə et
      const finalSnippet = shouldAddNewLine ? `\n${snippet}` : snippet;

      const contribution = editor.getContribution('snippetController2') as any;
      if (contribution) {
        contribution.insert(finalSnippet);
      } else {
        editor.executeEdits("insert", [{
          range: editor.getSelection()!,
          text: finalSnippet,
          forceMoveMarkers: true
        }]);
      }
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
            // Kursorun animasiyasını daha hamar edək
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
          }}
        />

        {popup.visible && (
          <GridPopup
            position={{ top: popup.top, left: popup.left }}
            context={popup.context}
            existingCode={code} // Ümumi kodu göndəririk
            onSelect={(snip) => (ref as any).current.handleAddCode(snip)}
            onClose={() => setPopup(prev => ({ ...prev, visible: false }))}
          />
        )}
      </div>
    </div>
  );
};