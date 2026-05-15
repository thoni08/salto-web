import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Robust mock for localStorage/sessionStorage
const createMockStorage = () => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    length: 0,
    key: vi.fn((index) => Object.keys(store)[index] || null),
  };
};

if (typeof window !== "undefined") {
  Object.defineProperty(window, "localStorage", {
    value: createMockStorage(),
    writable: true,
  });
  Object.defineProperty(window, "sessionStorage", {
    value: createMockStorage(),
    writable: true,
  });
}

afterEach(() => {
  cleanup();
});
