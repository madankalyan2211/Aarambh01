import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Failed to find root element');
} else {  
  createRoot(rootElement).render(<App />);
  console.log('App mounted successfully');
}
  