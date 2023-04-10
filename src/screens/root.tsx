import { Link } from "react-router-dom";
import { Board, CodeInput, Header, Configuration } from "../components";
import {
  BoardContextProvider,
  CodeControllerContextProvider,
  EngineContextProvider,
} from "../contexts";

function Root() {
  return (
    <CodeControllerContextProvider>
      <BoardContextProvider>
        <EngineContextProvider>
          <>
            <Header />
            <Configuration />
            <div className="Link-Container">
              <Link className="Link-Container-Anchor" to="/docs">
                Documentation
              </Link>
            </div>

            <div className="App-Container">
              <CodeInput />
              <Board />
            </div>
          </>
        </EngineContextProvider>
      </BoardContextProvider>
    </CodeControllerContextProvider>
  );
}

export default Root;
