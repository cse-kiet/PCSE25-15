import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthContextProvider } from "./context/AuthContext";
// import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      {/* <Toaster position="top-center" reverseOrder={false} /> */}
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);
