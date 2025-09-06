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
  try {
    const res = await fetch("https://dummyjson.com/products/categories");
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
    console.error("Error fetching categories:", error);
    throw new Error("Не удалось загрузить категории");
  }
}

export async function addProduct(title: string): Promise<DummyJsonProduct> {
  try {
    const res = await fetch("https://dummyjson.com/products/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error("Ошибка при отправке заявки");
  }
}
