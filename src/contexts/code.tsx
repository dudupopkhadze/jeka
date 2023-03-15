import { javascript } from "@codemirror/lang-javascript";
import { EditorState } from "@codemirror/state";
import { basicSetup, EditorView } from "codemirror";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface ICodeControllerContext {
  codeInputRef: (node: HTMLElement | null) => void;
  value: React.MutableRefObject<string>;
}

export const CodeControllerContext = React.createContext<
  ICodeControllerContext | undefined
>(undefined);

export const CodeControllerContextProvider: React.FC = ({ children }) => {
  const [element, setElement] = useState<HTMLElement>();
  const curDocValue = useRef<string>("");

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
          curDocValue.current = e.state.doc.toString();
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
    <CodeControllerContext.Provider
      value={{ codeInputRef, value: curDocValue }}
    >
      {children}
    </CodeControllerContext.Provider>
  );
};
