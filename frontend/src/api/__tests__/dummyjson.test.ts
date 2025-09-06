import { beforeEach, describe, expect, it, vi } from "vitest";

import { addProduct, fetchCategories } from "../dummyjson";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("fetchCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock environment variable
    Object.defineProperty(import.meta, "env", {
      value: { VITE_API_URL: "https://dummyjson.com" },
      writable: true,
      configurable: true,
    });
  });

  it("should fetch categories successfully with string array", async () => {
    const mockCategories = ["electronics", "clothing", "books"];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockCategories),
    });

    const result = await fetchCategories();

    expect(result).toEqual([
      { value: "electronics", label: "electronics" },
      { value: "clothing", label: "clothing" },
      { value: "books", label: "books" },
    ]);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://dummyjson.com/products/categories",
      { signal: expect.any(Object) }
    );
  });

  it("should fetch categories successfully with object array", async () => {
    const mockCategories = [
      { slug: "electronics", name: "Electronics" },
      { slug: "clothing", name: "Clothing" },
    ];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockCategories),
    });

    const result = await fetchCategories();

    expect(result).toEqual([
      { value: "electronics", label: "Electronics" },
      { value: "clothing", label: "Clothing" },
    ]);
  });

  it("should handle empty array", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    const result = await fetchCategories();

    expect(result).toEqual([]);
  });

  it("should handle non-array response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const result = await fetchCategories();

    expect(result).toEqual([]);
  });

  it("should throw error when VITE_API_URL is not set", async () => {
    Object.defineProperty(import.meta, "env", {
      value: { VITE_API_URL: undefined },
      writable: true,
      configurable: true,
    });

    await expect(fetchCategories()).rejects.toThrow("VITE_API_URL не настроен");
  });

  it("should retry on failure", async () => {
    mockFetch
      .mockRejectedValueOnce(new Error("Network error"))
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(["electronics"]),
      });

    const result = await fetchCategories();

    expect(result).toEqual([{ value: "electronics", label: "electronics" }]);
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it("should throw error after max retries", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    await expect(fetchCategories()).rejects.toThrow(
      "Не удалось загрузить категории после 3 попыток"
    );
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it("should handle HTTP error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(fetchCategories()).rejects.toThrow("HTTP error! status: 500");
  });
});

describe("addProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(import.meta, "env", {
      value: { VITE_API_URL: "https://dummyjson.com" },
      writable: true,
      configurable: true,
    });
  });

  it("should add product successfully", async () => {
    const mockProduct = {
      id: 1,
      title: "Test Product",
      description: "Test Description",
      price: 100,
      discountPercentage: 10,
      rating: 4.5,
      stock: 50,
      brand: "Test Brand",
      category: "electronics",
      thumbnail: "test.jpg",
      images: ["test1.jpg", "test2.jpg"],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProduct),
    });

    const result = await addProduct("Test Product");

    expect(result).toEqual(mockProduct);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://dummyjson.com/products/add",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Test Product" }),
        signal: expect.any(Object),
      }
    );
  });

  it("should trim title", async () => {
    const mockProduct = { id: 1, title: "Test Product" };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProduct),
    });

    await addProduct("  Test Product  ");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://dummyjson.com/products/add",
      expect.objectContaining({
        body: JSON.stringify({ title: "Test Product" }),
      })
    );
  });

  it("should throw error for empty title", async () => {
    await expect(addProduct("")).rejects.toThrow(
      "Название продукта обязательно"
    );
    await expect(addProduct("   ")).rejects.toThrow(
      "Название продукта обязательно"
    );
  });

  it("should throw error for non-string title", async () => {
    await expect(addProduct(null as any)).rejects.toThrow(
      "Название продукта обязательно"
    );
    await expect(addProduct(undefined as any)).rejects.toThrow(
      "Название продукта обязательно"
    );
  });

  it("should throw error when VITE_API_URL is not set", async () => {
    Object.defineProperty(import.meta, "env", {
      value: { VITE_API_URL: undefined },
      writable: true,
      configurable: true,
    });

    await expect(addProduct("Test")).rejects.toThrow(
      "VITE_API_URL не настроен"
    );
  });

  it("should retry on failure", async () => {
    const mockProduct = { id: 1, title: "Test Product" };
    mockFetch
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProduct),
      });

    const result = await addProduct("Test Product");

    expect(result).toEqual(mockProduct);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("should throw error after max retries", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    await expect(addProduct("Test Product")).rejects.toThrow(
      "Ошибка при отправке заявки после 3 попыток"
    );
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });
});
