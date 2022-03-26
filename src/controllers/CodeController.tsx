import React, { useContext, useState } from "react";

const INITIAL_SIZE = 15;

class CodeController {
  data: string[];
  constructor() {
    this.data = new Array(INITIAL_SIZE).fill("");

    this.data[2] = "cool dude";
    this.data[0] = "hello ";
  }

  updateData(value: string, index: number) {
    this.data[index] = value;
    return value;
  }

  getData(index: number) {
    return this.data[index];
  }

  grow() {
    console.log("called grow");
    const newArray = new Array(INITIAL_SIZE).fill("");
    this.data = [...this.data, ...newArray];
  }

  length() {
    return this.data.length;
  }
}

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

export const useCodeControllerContext = () => {
  const context = useContext(CodeControllerContext);
  if (!context) throw new Error("CodeControllerContext is not Under Provider");
  return context;
};
