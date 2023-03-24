import {
  Board,
  CodeInput,
  Header,
  DelaySlider,
  Configuration,
} from "./components";
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
            <Configuration />
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
