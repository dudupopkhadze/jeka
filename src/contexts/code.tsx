import { javascript } from "@codemirror/lang-javascript";
import { EditorState } from "@codemirror/state";
import { basicSetup, EditorView } from "codemirror";
import React, { useCallback, useEffect, useState } from "react";

export const CodeControllerContext = React.createContext<
  { codeInputRef: (node: HTMLElement | null) => void } | undefined
>(undefined);

export const CodeControllerContextProvider: React.FC = ({ children }) => {
  const [element, setElement] = useState<HTMLElement>();

  const codeInputRef = useCallback((node: HTMLElement | null) => {
    if (!node) return;

    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const state = EditorState.create({
      extensions: [
        basicSetup,
        javascript(),
        EditorView.updateListener.of(function (e) {
          console.log(e.state.doc.toString());
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: element,
    });

    return () => view?.destroy();
  }, [element]);

  return (
    <CodeControllerContext.Provider value={{ codeInputRef }}>
      {children}
    </CodeControllerContext.Provider>
  );
};
