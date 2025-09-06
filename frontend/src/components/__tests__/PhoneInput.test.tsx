import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithForm } from "@/test/test-utils";

import { PhoneInput } from "../PhoneInput/PhoneInput";

describe("PhoneInput", () => {
  it("should render phone input with correct attributes", () => {
    renderWithForm(<PhoneInput data-testid="phone-input" />);

    const input = screen.getByTestId("phone-input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("inputMode", "numeric");
    expect(input).toHaveAttribute("placeholder", "0XXX XXX XXX");
    expect(input).toHaveAttribute("autoComplete", "tel");
    expect(input).toHaveClass("form-control");
  });

  it("should format phone number on input", async () => {
    const user = userEvent.setup();
    renderWithForm(<PhoneInput data-testid="phone-input" />);

    const input = screen.getByTestId("phone-input");
    await user.type(input, "0123456789");

    expect(input).toHaveValue("0123 456 789");
  });

  it("should handle partial phone numbers", async () => {
    const user = userEvent.setup();
    renderWithForm(<PhoneInput data-testid="phone-input" />);

    const input = screen.getByTestId("phone-input");
    await user.type(input, "012345");

    expect(input).toHaveValue("0123 45");
  });

  it("should remove non-digit characters", async () => {
    const user = userEvent.setup();
    renderWithForm(<PhoneInput data-testid="phone-input" />);

    const input = screen.getByTestId("phone-input");
    await user.type(input, "0-123-456-789");

    expect(input).toHaveValue("0123 456 789");
  });

  it("should limit to 10 digits", async () => {
    const user = userEvent.setup();
    renderWithForm(<PhoneInput data-testid="phone-input" />);

    const input = screen.getByTestId("phone-input");
    await user.type(input, "01234567890123");

    expect(input).toHaveValue("0123 456 789");
  });

  it("should handle backspace", async () => {
    const user = userEvent.setup();
    renderWithForm(<PhoneInput data-testid="phone-input" />);

    const input = screen.getByTestId("phone-input");
    await user.type(input, "0123456789");
    await user.keyboard("{Backspace}");

    expect(input).toHaveValue("0123 456 78");
  });

  it("should handle paste", async () => {
    const user = userEvent.setup();
    renderWithForm(<PhoneInput data-testid="phone-input" />);

    const input = screen.getByTestId("phone-input");
    await user.click(input);
    await user.paste("0123456789");

    expect(input).toHaveValue("0123 456 789");
  });

  it("should accept additional props", () => {
    renderWithForm(
      <PhoneInput data-testid="phone-input" className="custom-class" disabled />
    );

    const input = screen.getByTestId("phone-input");
    expect(input).toHaveClass("form-control", "custom-class");
    expect(input).toBeDisabled();
  });

  it("should handle empty value", async () => {
    const user = userEvent.setup();
    renderWithForm(<PhoneInput data-testid="phone-input" />);

    const input = screen.getByTestId("phone-input");
    await user.clear(input);

    expect(input).toHaveValue("");
  });

  it("should handle clearing and retyping", async () => {
    const user = userEvent.setup();
    renderWithForm(<PhoneInput data-testid="phone-input" />);

    const input = screen.getByTestId("phone-input");

    // Type first number
    await user.type(input, "0123456789");
    expect(input).toHaveValue("0123 456 789");

    // Clear and type new number
    await user.clear(input);
    await user.type(input, "0987654321");
    expect(input).toHaveValue("0987 654 321");
  });
});
