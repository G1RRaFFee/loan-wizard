import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/App";
import { render as customRender } from "@/test/test-utils";

// Mock API functions
const mockFetchCategories = vi.fn();
const mockAddProduct = vi.fn();

vi.mock("@/api/dummyjson", () => ({
  fetchCategories: mockFetchCategories,
  addProduct: mockAddProduct,
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("App Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchCategories.mockResolvedValue([
      { value: "electronics", label: "Electronics" },
      { value: "clothing", label: "Clothing" },
    ]);
    mockAddProduct.mockResolvedValue({
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
    });
  });

  it("should complete full loan application flow", async () => {
    const user = userEvent.setup();
    customRender(<App />);

    // Should start on personal step
    expect(screen.getByText(/личная информация/i)).toBeInTheDocument();

    // Fill personal information
    await user.type(screen.getByLabelText(/телефон/i), "0123456789");
    await user.type(screen.getByLabelText(/имя/i), "Иван");
    await user.type(screen.getByLabelText(/фамилия/i), "Иванов");
    await user.selectOptions(screen.getByLabelText(/пол/i), "male");

    // Navigate to address step
    await user.click(screen.getByRole("button", { name: /далее/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/address");

    // Wait for categories to load
    await waitFor(() => {
      expect(screen.getByText(/место работы/i)).toBeInTheDocument();
    });

    // Fill address information
    await user.selectOptions(
      screen.getByLabelText(/место работы/i),
      "electronics"
    );
    await user.type(
      screen.getByLabelText(/адрес/i),
      "Москва, ул. Тестовая, д. 1"
    );

    // Navigate to loan step
    await user.click(screen.getByRole("button", { name: /далее/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/loan");

    // Fill loan information
    await waitFor(() => {
      expect(screen.getByText(/сумма займа/i)).toBeInTheDocument();
    });

    const amountSlider = screen.getByLabelText(/сумма займа/i);
    await user.clear(amountSlider);
    await user.type(amountSlider, "500");

    const termSlider = screen.getByLabelText(/срок займа/i);
    await user.clear(termSlider);
    await user.type(termSlider, "15");

    // Submit application
    await user.click(screen.getByRole("button", { name: /подать заявку/i }));

    // Wait for success modal
    await waitFor(() => {
      expect(screen.getByText(/заявка одобрена/i)).toBeInTheDocument();
    });

    expect(mockAddProduct).toHaveBeenCalledWith("Иванов Иван");
  });

  it("should show loading state for categories", async () => {
    // Make fetchCategories take some time
    mockFetchCategories.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    );

    const user = userEvent.setup();
    customRender(<App />);

    // Fill personal information and navigate to address step
    await user.type(screen.getByLabelText(/телефон/i), "0123456789");
    await user.type(screen.getByLabelText(/имя/i), "Иван");
    await user.type(screen.getByLabelText(/фамилия/i), "Иванов");
    await user.selectOptions(screen.getByLabelText(/пол/i), "male");
    await user.click(screen.getByRole("button", { name: /далее/i }));

    // Should show loading state
    expect(screen.getByText(/загрузка категорий/i)).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/загрузка категорий/i)).not.toBeInTheDocument();
    });
  });

  it("should show error state for failed category fetch", async () => {
    mockFetchCategories.mockRejectedValue(new Error("Network error"));

    const user = userEvent.setup();
    customRender(<App />);

    // Fill personal information and navigate to address step
    await user.type(screen.getByLabelText(/телефон/i), "0123456789");
    await user.type(screen.getByLabelText(/имя/i), "Иван");
    await user.type(screen.getByLabelText(/фамилия/i), "Иванов");
    await user.selectOptions(screen.getByLabelText(/пол/i), "male");
    await user.click(screen.getByRole("button", { name: /далее/i }));

    // Should show error state
    await waitFor(() => {
      expect(
        screen.getByText(/ошибка загрузки категорий/i)
      ).toBeInTheDocument();
    });
  });

  it("should show error state for failed application submission", async () => {
    mockAddProduct.mockRejectedValue(new Error("Submission failed"));

    const user = userEvent.setup();
    customRender(<App />);

    // Complete the form up to loan step
    await user.type(screen.getByLabelText(/телефон/i), "0123456789");
    await user.type(screen.getByLabelText(/имя/i), "Иван");
    await user.type(screen.getByLabelText(/фамилия/i), "Иванов");
    await user.selectOptions(screen.getByLabelText(/пол/i), "male");
    await user.click(screen.getByRole("button", { name: /далее/i }));

    await waitFor(() => {
      expect(screen.getByText(/место работы/i)).toBeInTheDocument();
    });

    await user.selectOptions(
      screen.getByLabelText(/место работы/i),
      "electronics"
    );
    await user.type(
      screen.getByLabelText(/адрес/i),
      "Москва, ул. Тестовая, д. 1"
    );
    await user.click(screen.getByRole("button", { name: /далее/i }));

    await waitFor(() => {
      expect(screen.getByText(/сумма займа/i)).toBeInTheDocument();
    });

    // Submit application
    await user.click(screen.getByRole("button", { name: /подать заявку/i }));

    // Should show error state
    await waitFor(() => {
      expect(
        screen.getByText(/ошибка при отправке заявки/i)
      ).toBeInTheDocument();
    });
  });

  it("should validate form fields and prevent navigation", async () => {
    const user = userEvent.setup();
    customRender(<App />);

    // Try to navigate without filling required fields
    await user.click(screen.getByRole("button", { name: /далее/i }));

    // Should not navigate
    expect(mockNavigate).not.toHaveBeenCalled();

    // Should show validation errors
    expect(screen.getByText(/телефон обязателен/i)).toBeInTheDocument();
    expect(screen.getByText(/имя обязательно/i)).toBeInTheDocument();
    expect(screen.getByText(/фамилия обязательна/i)).toBeInTheDocument();
  });

  it("should allow navigation back and forth", async () => {
    const user = userEvent.setup();
    customRender(<App />);

    // Fill personal information and go to address step
    await user.type(screen.getByLabelText(/телефон/i), "0123456789");
    await user.type(screen.getByLabelText(/имя/i), "Иван");
    await user.type(screen.getByLabelText(/фамилия/i), "Иванов");
    await user.selectOptions(screen.getByLabelText(/пол/i), "male");
    await user.click(screen.getByRole("button", { name: /далее/i }));

    await waitFor(() => {
      expect(screen.getByText(/место работы/i)).toBeInTheDocument();
    });

    // Go back to personal step
    await user.click(screen.getByRole("button", { name: /назад/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/personal");

    // Should still have the data
    expect(screen.getByDisplayValue("0123 456 789")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Иван")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Иванов")).toBeInTheDocument();
  });

  it("should show progress bar", () => {
    customRender(<App />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("should handle phone number formatting", async () => {
    const user = userEvent.setup();
    customRender(<App />);

    const phoneInput = screen.getByLabelText(/телефон/i);
    await user.type(phoneInput, "0123456789");

    expect(phoneInput).toHaveValue("0123 456 789");
  });
});
