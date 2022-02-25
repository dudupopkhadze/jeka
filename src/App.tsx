import React from "react";
import { Board } from "./components/Board";
import { CodeInput } from "./components/CodeInput";
import "./styles/App.css";

function App() {
  return (
    <div className="App">
      <div className="App-Container">
        <CodeInput />
        <Board />
      </div>
    </div>
  );
}

export default App;
