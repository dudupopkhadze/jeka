import { Link } from "react-router-dom";
import { Board, CodeInput, Header, Configuration } from "../components";
import {
  BoardContextProvider,
  CodeControllerContextProvider,
  EngineContextProvider,
} from "../contexts";
import { ReactComponent as DocsIcon } from "../svgs/docs.svg";

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
                <DocsIcon className="Link-Container-Anchor-Icon" />
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
