import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AOS from "aos";
import "aos/dist/aos.css";
import App from "./App.tsx";

AOS.init({
  duration: 700,
  easing: "ease-out-cubic",
  /** Avoid re-trigger / mirror quirks that can leave sections invisible on mobile. */
  once: true,
  /** Trigger slightly earlier so tall sections register while still on screen. */
  offset: 100,
  anchorPlacement: "top-bottom",
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
