import { RouterProvider, createHashRouter } from "react-router-dom";
import "./styles/App.less";
import Root from "./screens/root";
import Docs from "./screens/docs";

const router = createHashRouter([
  { path: "/", element: <Root /> },
  { path: "/docs", element: <Docs /> },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
