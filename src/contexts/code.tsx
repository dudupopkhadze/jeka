import React from "react";
import { CodeController } from "../controllers";

const codeController = new CodeController();

export const CodeControllerContext = React.createContext<
  { codeController: CodeController } | undefined
>(undefined);

export const CodeControllerContextProvider: React.FC = ({ children }) => {
  return (
    <CodeControllerContext.Provider value={{ codeController }}>
      {children}
    </CodeControllerContext.Provider>
  );
};
