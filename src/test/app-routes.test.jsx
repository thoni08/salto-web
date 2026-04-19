import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "../App";
import LoginPage from "../pages/LoginPage";
import ThreadPage from "../pages/ThreadPage";
import ThreadDetailPage from "../pages/ThreadDetailPage";

function renderRoutes(initialEntries = ["/login"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<App />} />
        <Route path="/thread" element={<ThreadPage />} />
        <Route path="/thread/:threadId" element={<ThreadDetailPage />} />
        <Route path="/thread-detail" element={<ThreadDetailPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("app route flow", () => {
  it("navigates from login to home and then to thread detail", async () => {
    renderRoutes(["/login"]);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(
      screen.getByLabelText(/^Password(?:\s*\*)?$/i, { selector: "input" }),
      {
        target: { value: "password123" },
      },
    );

    fireEvent.click(screen.getByRole("button", { name: "Masuk" }));

    expect(
      await screen.findByRole("heading", {
        name: /Tanya Jawab Mahasiwa & Alumni/i,
      }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: /Jelajahi Forum/i }));

    expect(
      await screen.findByRole("heading", { name: /Diskusi Terbaru/i }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("link", {
        name: /Bagaimana cara persiapan technical interview/i,
      }),
    );

    expect(
      await screen.findByRole("heading", {
        name: /Bagaimana cara persiapan technical interview/i,
      }),
    ).toBeInTheDocument();
  });

  it("redirects unknown routes to login page", async () => {
    renderRoutes(["/path-yang-tidak-ada"]);

    expect(
      await screen.findByRole("heading", { name: /Selamat Datang/i }),
    ).toBeInTheDocument();
  });
});
