import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import { AppErrorBoundary } from "./components/AppErrorBoundary.jsx";
import { Layout } from "./components/Layout.jsx";
import { ScrollToTop } from "./components/ScrollToTop.jsx";
import "./index.css";
import CreateThreadPage from "./pages/CreateThreadPage.jsx";
import LiveDiskusiPage from "./pages/LiveDiskusiPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProfileEditPage from "./pages/ProfileEditPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ThreadDetailPage from "./pages/ThreadDetailPage.jsx";
import ThreadPage from "./pages/ThreadPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import CookiesPage from "./pages/CookiesPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import AccessibilityPage from "./pages/AccessibilityPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* /users page removed — followers/following handled in-profile modal */}
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/live" element={<LiveDiskusiPage />} />
          <Route path="/live-diskusi" element={<LiveDiskusiPage />} />
          <Route element={<Layout />}>
            <Route path="/" element={<App />} />
            <Route path="/thread" element={<ThreadPage />} />
            <Route path="/thread/create" element={<CreateThreadPage />} />
            <Route path="/thread/:threadId" element={<ThreadDetailPage />} />
            <Route path="/thread-detail" element={<ThreadDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<ProfileEditPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AppErrorBoundary>
  </StrictMode>,
);
