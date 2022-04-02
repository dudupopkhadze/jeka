import React from "react";
import { Board, CodeInput, Header } from "./components";
import {
  BoardControllerContextProvider,
  CodeControllerContextProvider,
} from "./contexts";
import "./styles/App.css";

function App() {
  return (
    <CodeControllerContextProvider>
      <BoardControllerContextProvider>
        <div className="App">
          <Header />
          <div className="App-Container">
            <CodeInput />
            <Board />
          </div>
        </div>
      </BoardControllerContextProvider>
    </CodeControllerContextProvider>
  );
}

export default App;
