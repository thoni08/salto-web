import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LiveDiskusiPage from "./pages/LiveDiskusiPage.jsx";
import ThreadDetailPage from "./pages/ThreadDetailPage.jsx";
import { Layout } from "./components/Layout.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/live" element={<LiveDiskusiPage />} />
        <Route path="/live-diskusi" element={<LiveDiskusiPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />
          <Route path="/thread/:threadId" element={<ThreadDetailPage />} />
          <Route path="/thread-detail" element={<ThreadDetailPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
