import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useApi } from "../useApi";

describe("useApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with correct default state", () => {
    const mockApiFunction = vi.fn();
    const { result } = renderHook(() => useApi(mockApiFunction));

    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle successful API call", async () => {
    const mockData = { id: 1, name: "Test" };
    const mockApiFunction = vi.fn().mockResolvedValue(mockData);
    const { result } = renderHook(() => useApi(mockApiFunction));

    const executePromise = result.current.execute("arg1", "arg2");

    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const data = await executePromise;

    expect(data).toEqual(mockData);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
    expect(mockApiFunction).toHaveBeenCalledWith("arg1", "arg2");
  });

  it("should handle API call error", async () => {
    const mockError = new Error("API Error");
    const mockApiFunction = vi.fn().mockRejectedValue(mockError);
    const { result } = renderHook(() => useApi(mockApiFunction));

    const executePromise = result.current.execute();

    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const data = await executePromise;

    expect(data).toBe(null);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe("API Error");
  });

  it("should handle non-Error objects", async () => {
    const mockApiFunction = vi.fn().mockRejectedValue("String error");
    const { result } = renderHook(() => useApi(mockApiFunction));

    await result.current.execute();

    await waitFor(() => {
      expect(result.current.error).toBe("Произошла ошибка");
    });
  });

  it("should reset state correctly", async () => {
    const mockData = { id: 1, name: "Test" };
    const mockApiFunction = vi.fn().mockResolvedValue(mockData);
    const { result } = renderHook(() => useApi(mockApiFunction));

    // First successful call
    await result.current.execute();
    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
    });

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle multiple calls", async () => {
    const mockApiFunction = vi
      .fn()
      .mockResolvedValueOnce({ id: 1 })
      .mockResolvedValueOnce({ id: 2 });
    const { result } = renderHook(() => useApi(mockApiFunction));

    // First call
    await result.current.execute("first");
    await waitFor(() => {
      expect(result.current.data).toEqual({ id: 1 });
    });

    // Second call
    await result.current.execute("second");
    await waitFor(() => {
      expect(result.current.data).toEqual({ id: 2 });
    });

    expect(mockApiFunction).toHaveBeenCalledTimes(2);
    expect(mockApiFunction).toHaveBeenNthCalledWith(1, "first");
    expect(mockApiFunction).toHaveBeenNthCalledWith(2, "second");
  });
});
