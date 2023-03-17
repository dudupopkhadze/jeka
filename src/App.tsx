import React from "react";
import { Board, CodeInput, Header } from "./components";
import {
  BoardControllerContextProvider,
  CodeControllerContextProvider,
  EngineContextProvider,
} from "./contexts";
import "./styles/App.css";

function App() {
  return (
    <CodeControllerContextProvider>
      <BoardControllerContextProvider>
        <EngineContextProvider>
          <div className="App">
            <Header />
            <div className="App-Container">
              <CodeInput />
              <Board />
            </div>
          </div>
        </EngineContextProvider>
      </BoardControllerContextProvider>
    </CodeControllerContextProvider>
  );
}

export default App;
