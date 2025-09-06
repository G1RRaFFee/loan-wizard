import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

Object.defineProperty(import.meta, "env", {
  value: {
    VITE_API_URL: "https://dummyjson.com",
  },
  writable: true,
  configurable: true,
});

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

global.fetch = vi.fn();

Object.defineProperty(AbortSignal, "timeout", {
  value: vi.fn(() => new AbortController().signal),
});
