import React from "react";
import { Board, CodeInput, Header } from "./components";
import { CodeControllerContextProvider } from "./contexts";
import "./styles/App.css";

function App() {
  return (
    <CodeControllerContextProvider>
      <div className="App">
        <Header />
        <div className="App-Container">
          <CodeInput />
          <Board />
        </div>
      </div>
    </CodeControllerContextProvider>
  );
}

export default App;
