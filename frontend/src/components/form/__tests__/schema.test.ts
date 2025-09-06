import { describe, expect, it } from "vitest";

import { GENDERS, defaultValues, formSchema } from "../schema";

describe("formSchema", () => {
  it("should validate correct phone number", () => {
    const validData = {
      phone: "0123 456 789",
      firstName: "Иван",
      lastName: "Иванов",
      gender: "male" as const,
      workPlace: "IT",
      address: "Москва, ул. Тестовая, д. 1",
      amount: 500,
      termDays: 15,
    };

    const result = formSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject invalid phone format", () => {
    const invalidData = {
      phone: "123456789",
      firstName: "Иван",
      lastName: "Иванов",
      gender: "male" as const,
      workPlace: "IT",
      address: "Москва, ул. Тестовая, д. 1",
      amount: 500,
      termDays: 15,
    };

    const result = formSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Формат: 0XXX XXX XXX");
    }
  });

  it("should reject short first name", () => {
    const invalidData = {
      phone: "0123 456 789",
      firstName: "А",
      lastName: "Иванов",
      gender: "male" as const,
      workPlace: "IT",
      address: "Москва, ул. Тестовая, д. 1",
      amount: 500,
      termDays: 15,
    };

    const result = formSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Имя должно содержать минимум 2 символа"
      );
    }
  });

  it("should reject first name with invalid characters", () => {
    const invalidData = {
      phone: "0123 456 789",
      firstName: "Иван123",
      lastName: "Иванов",
      gender: "male" as const,
      workPlace: "IT",
      address: "Москва, ул. Тестовая, д. 1",
      amount: 500,
      termDays: 15,
    };

    const result = formSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Имя может содержать только буквы, пробелы и дефисы"
      );
    }
  });

  it("should accept valid first name with hyphen", () => {
    const validData = {
      phone: "0123 456 789",
      firstName: "Анна-Мария",
      lastName: "Иванов",
      gender: "female" as const,
      workPlace: "IT",
      address: "Москва, ул. Тестовая, д. 1",
      amount: 500,
      termDays: 15,
    };

    const result = formSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject invalid gender", () => {
    const invalidData = {
      phone: "0123 456 789",
      firstName: "Иван",
      lastName: "Иванов",
      gender: "other" as any,
      workPlace: "IT",
      address: "Москва, ул. Тестовая, д. 1",
      amount: 500,
      termDays: 15,
    };

    const result = formSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("Invalid enum value");
    }
  });

  it("should reject amount below minimum", () => {
    const invalidData = {
      phone: "0123 456 789",
      firstName: "Иван",
      lastName: "Иванов",
      gender: "male" as const,
      workPlace: "IT",
      address: "Москва, ул. Тестовая, д. 1",
      amount: 100,
      termDays: 15,
    };

    const result = formSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Минимальная сумма: $200");
    }
  });

  it("should reject amount above maximum", () => {
    const invalidData = {
      phone: "0123 456 789",
      firstName: "Иван",
      lastName: "Иванов",
      gender: "male" as const,
      workPlace: "IT",
      address: "Москва, ул. Тестовая, д. 1",
      amount: 1500,
      termDays: 15,
    };

    const result = formSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Максимальная сумма: $1000");
    }
  });

  it("should reject term days below minimum", () => {
    const invalidData = {
      phone: "0123 456 789",
      firstName: "Иван",
      lastName: "Иванов",
      gender: "male" as const,
      workPlace: "IT",
      address: "Москва, ул. Тестовая, д. 1",
      amount: 500,
      termDays: 5,
    };

    const result = formSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Минимальный срок: 10 дней");
    }
  });

  it("should reject term days above maximum", () => {
    const invalidData = {
      phone: "0123 456 789",
      firstName: "Иван",
      lastName: "Иванов",
      gender: "male" as const,
      workPlace: "IT",
      address: "Москва, ул. Тестовая, д. 1",
      amount: 500,
      termDays: 35,
    };

    const result = formSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Максимальный срок: 30 дней");
    }
  });

  it("should reject short address", () => {
    const invalidData = {
      phone: "0123 456 789",
      firstName: "Иван",
      lastName: "Иванов",
      gender: "male" as const,
      workPlace: "IT",
      address: "Москва",
      amount: 500,
      termDays: 15,
    };

    const result = formSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      // Find the address error
      const addressError = result.error.issues.find((issue) =>
        issue.path.includes("address")
      );
      expect(addressError?.message).toBe(
        "Адрес должен содержать минимум 5 символов"
      );
    }
  });

  it("should reject long address", () => {
    const invalidData = {
      phone: "0123 456 789",
      firstName: "Иван",
      lastName: "Иванов",
      gender: "male" as const,
      workPlace: "IT",
      address: "Очень длинный адрес ".repeat(20), // More than 200 characters
      amount: 500,
      termDays: 15,
    };

    const result = formSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Адрес не должен превышать 200 символов"
      );
    }
  });

  it("should trim whitespace from names", () => {
    const dataWithWhitespace = {
      phone: "0123 456 789",
      firstName: "  Иван  ",
      lastName: "  Иванов  ",
      gender: "male" as const,
      workPlace: "IT",
      address: "Москва, ул. Тестовая, д. 1",
      amount: 500,
      termDays: 15,
    };

    const result = formSchema.safeParse(dataWithWhitespace);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.firstName).toBe("Иван");
      expect(result.data.lastName).toBe("Иванов");
    }
  });
});

describe("GENDERS", () => {
  it("should have correct gender options", () => {
    expect(GENDERS).toEqual([
      { value: "male", label: "Мужской" },
      { value: "female", label: "Женский" },
    ]);
  });
});

describe("defaultValues", () => {
  it("should have correct default values", () => {
    expect(defaultValues).toEqual({
      phone: "",
      firstName: "",
      lastName: "",
      gender: "male",
      workPlace: "",
      address: "",
      amount: 200,
      termDays: 10,
    });
  });

  it("should be valid according to schema", () => {
    const result = formSchema.safeParse(defaultValues);
    expect(result.success).toBe(false); // Should fail because required fields are empty
  });
});
