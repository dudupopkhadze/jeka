import React from "react";
import { Board } from "./components/Board";
import { CodeInput } from "./components/CodeInput";
import { CodeControllerContextProvider } from "./controllers";
import "./styles/App.css";

function App() {
  return (
    <CodeControllerContextProvider>
      <div className="App">
        <div className="App-Container">
          <CodeInput />
          <Board />
        </div>
      </div>
    </CodeControllerContextProvider>
  );
}

export default App;
