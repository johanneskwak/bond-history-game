import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/pretendard/400.css";
import "@fontsource/pretendard/700.css";
import "@fontsource/pretendard/900.css";
import "./index.css";
import BondHistoryGame from "./BondHistoryGame.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BondHistoryGame />
  </StrictMode>
);
