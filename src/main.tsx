import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AOS from "aos";
import "aos/dist/aos.css";
import App from "./App.tsx";

AOS.init({
  duration: 700,
  easing: "ease-out-cubic",
  once: false,
  offset: 30,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
