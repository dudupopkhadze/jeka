import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./styles/App.css";
import Root from "./screens/root";
import Docs from "./screens/docs";

const router = createBrowserRouter([
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
