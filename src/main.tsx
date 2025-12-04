import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// VitePWA handles service worker registration automatically
// import './registerServiceWorker';

createRoot(document.getElementById("root")!).render(<App />);
