import * as monaco from 'monaco-editor';
import { CPP_LIBRARIES, CPP_SNIPPETS } from './monaco-constants';

export const registerCppProvider = () => {
  return monaco.languages.registerCompletionItemProvider('cpp', {
    provideCompletionItems: (model, position) => {
      const range = new monaco.Range(position.lineNumber, 1, position.lineNumber, position.column);

      const suggestions: monaco.languages.CompletionItem[] = [
        // Kitabxanalar
        ...CPP_LIBRARIES.map(lib => ({
          label: lib.name,
          kind: monaco.languages.CompletionItemKind.Module,
          insertText: `#include <${lib.name}>`,
          detail: lib.desc,
          range
        })),
        // Hazır kod blokları (Snippets)
        ...CPP_SNIPPETS.map(snip => ({
          label: snip.label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: snip.insertText,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: snip.desc,
          range
        }))
      ];

      return { suggestions };
    }
  });
};