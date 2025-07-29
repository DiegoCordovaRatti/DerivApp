import React from "react";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/routes";
import './style.scss'

const App = () => {
  return (
    <div className="App">
      <RouterProvider router={routes}/>
    </div>
  );
}

export default App;