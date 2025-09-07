import { API_ROUTES } from "@/constants";

const API_BASE = import.meta.env.DEV ? "/api" : "https://dummyjson.com";

export interface CategoryOption {
  value: string;
  label: string;
}

interface DummyJsonCategory {
  slug?: string;
  name?: string;
}

interface DummyJsonProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export async function fetchCategories(): Promise<CategoryOption[]> {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(`${API_BASE}${API_ROUTES.products.categories}`, {
        signal: AbortSignal.timeout(10000),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: unknown = await res.json();

      if (Array.isArray(data)) {
        if (data.length === 0 || typeof data[0] === "string") {
          return (data as string[]).map((s) => ({ value: s, label: s }));
        }

        if (typeof data[0] === "object" && data[0] !== null) {
          return (data as DummyJsonCategory[]).map((o) => {
            const value = o.slug ?? o.name ?? "";
            const label = o.name ?? o.slug ?? "";
            return { value, label };
          });
        }
      }

      return [];
    } catch (error) {
      lastError = error as Error;
      console.error(`Error fetching categories (attempt ${attempt}):`, error);

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  throw new Error(
    `Не удалось загрузить категории после ${maxRetries} попыток: ${lastError?.message}`
  );
}

export async function addProduct(title: string): Promise<DummyJsonProduct> {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (!title || typeof title !== "string" || title.trim().length === 0) {
        throw new Error("Название продукта обязательно");
      }

      const res = await fetch(`${API_BASE}${API_ROUTES.products.add}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
        signal: AbortSignal.timeout(15000),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      lastError = error as Error;
      console.error(`Error adding product (attempt ${attempt}):`, error);

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  throw new Error(
    `Ошибка при отправке заявки после ${maxRetries} попыток: ${lastError?.message}`
  );
}
