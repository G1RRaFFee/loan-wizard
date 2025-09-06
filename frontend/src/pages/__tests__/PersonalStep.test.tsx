import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithForm } from "@/test/test-utils";

import { PersonalStep } from "../PersonalStep";

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("PersonalStep", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render all form fields", () => {
    renderWithForm(<PersonalStep />);

    expect(screen.getByLabelText(/телефон/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/имя/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/фамилия/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/пол/i)).toBeInTheDocument();
  });

  it("should show required asterisks for all fields", () => {
    renderWithForm(<PersonalStep />);

    const requiredFields = screen.getAllByText("*");
    expect(requiredFields).toHaveLength(4);
  });

  it("should have correct gender options", () => {
    renderWithForm(<PersonalStep />);

    const genderSelect = screen.getByLabelText(/пол/i);
    expect(genderSelect).toBeInTheDocument();

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(3); // 2 gender options + empty option

    expect(screen.getByRole("option", { name: "Мужской" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Женский" })).toBeInTheDocument();
  });

  it("should have correct placeholders", () => {
    renderWithForm(<PersonalStep />);

    expect(screen.getByPlaceholderText("0XXX XXX XXX")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Иван")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Иванов")).toBeInTheDocument();
  });

  it("should navigate to next step when form is valid", async () => {
    const user = userEvent.setup();
    renderWithForm(<PersonalStep />);

    // Fill in valid data
    await user.type(screen.getByLabelText(/телефон/i), "0123456789");
    await user.type(screen.getByLabelText(/имя/i), "Иван");
    await user.type(screen.getByLabelText(/фамилия/i), "Иванов");
    await user.selectOptions(screen.getByLabelText(/пол/i), "male");

    // Click next button
    const nextButton = screen.getByRole("button", { name: /далее/i });
    await user.click(nextButton);

    expect(mockNavigate).toHaveBeenCalledWith("/address");
  });

  it("should not navigate when form is invalid", async () => {
    const user = userEvent.setup();
    renderWithForm(<PersonalStep />);

    // Leave form empty and try to proceed
    const nextButton = screen.getByRole("button", { name: /далее/i });
    await user.click(nextButton);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should show validation errors for invalid input", async () => {
    const user = userEvent.setup();
    renderWithForm(<PersonalStep />);

    // Enter invalid phone number
    await user.type(screen.getByLabelText(/телефон/i), "123");
    await user.tab(); // Trigger validation

    expect(screen.getByText(/формат: 0xxx xxx xxx/i)).toBeInTheDocument();
  });

  it("should show validation error for short name", async () => {
    const user = userEvent.setup();
    renderWithForm(<PersonalStep />);

    // Enter short name
    await user.type(screen.getByLabelText(/имя/i), "А");
    await user.tab(); // Trigger validation

    expect(
      screen.getByText(/имя должно содержать минимум 2 символа/i)
    ).toBeInTheDocument();
  });

  it("should show validation error for invalid characters in name", async () => {
    const user = userEvent.setup();
    renderWithForm(<PersonalStep />);

    // Enter name with invalid characters
    await user.type(screen.getByLabelText(/имя/i), "Иван123");
    await user.tab(); // Trigger validation

    expect(
      screen.getByText(/имя может содержать только буквы/i)
    ).toBeInTheDocument();
  });

  it("should not show previous button", () => {
    renderWithForm(<PersonalStep />);

    expect(
      screen.queryByRole("button", { name: /назад/i })
    ).not.toBeInTheDocument();
  });

  it("should have correct ARIA attributes", () => {
    renderWithForm(<PersonalStep />);

    const section = screen.getByRole("region", { hidden: true });
    expect(section).toHaveAttribute("aria-labelledby", "step1-title");

    const heading = screen.getByText("Личная информация");
    expect(heading).toHaveAttribute("id", "step1-title");
    expect(heading).toHaveClass("visually-hidden");
  });

  it("should format phone number as user types", async () => {
    const user = userEvent.setup();
    renderWithForm(<PersonalStep />);

    const phoneInput = screen.getByLabelText(/телефон/i);
    await user.type(phoneInput, "0123456789");

    expect(phoneInput).toHaveValue("0123 456 789");
  });

  it("should handle form submission with Enter key", async () => {
    const user = userEvent.setup();
    renderWithForm(<PersonalStep />);

    // Fill in valid data
    await user.type(screen.getByLabelText(/телефон/i), "0123456789");
    await user.type(screen.getByLabelText(/имя/i), "Иван");
    await user.type(screen.getByLabelText(/фамилия/i), "Иванов");
    await user.selectOptions(screen.getByLabelText(/пол/i), "male");

    // Press Enter on the last field
    await user.keyboard("{Enter}");

    expect(mockNavigate).toHaveBeenCalledWith("/address");
  });
});
