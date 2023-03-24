import {
  Board,
  CodeInput,
  Header,
  DelaySlider,
  Configuration,
} from "./components";
import {
  BoardContextProvider,
  CodeControllerContextProvider,
  EngineContextProvider,
} from "./contexts";
import "./styles/App.css";

function App() {
  return (
    <CodeControllerContextProvider>
      <BoardContextProvider>
        <EngineContextProvider>
          <div className="App">
            <Header />
            <Configuration />
            <div className="App-Container">
              <CodeInput />
              <Board />
            </div>
          </div>
        </EngineContextProvider>
      </BoardContextProvider>
    </CodeControllerContextProvider>
  );
}

export default App;
