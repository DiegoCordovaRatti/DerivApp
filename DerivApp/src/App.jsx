import React from "react";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { routes } from "./routes/routes";
import './style.scss'

const App = () => {
  return (
    <AuthProvider>
      <div className="App">
        <RouterProvider router={routes}/>
      </div>
    </AuthProvider>
  );
}

export default App;