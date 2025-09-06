import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FormField } from "../FormField/FormField";

describe("FormField", () => {
  it("should render label correctly", () => {
    render(
      <FormField label="Test Label">
        <input type="text" />
      </FormField>
    );

    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("should show required asterisk when required", () => {
    render(
      <FormField label="Test Label" required>
        <input type="text" />
      </FormField>
    );

    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.getByLabelText("обязательное поле")).toBeInTheDocument();
  });

  it("should not show required asterisk when not required", () => {
    render(
      <FormField label="Test Label">
        <input type="text" />
      </FormField>
    );

    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("should render help text when provided", () => {
    render(
      <FormField label="Test Label" helpText="This is help text">
        <input type="text" />
      </FormField>
    );

    expect(screen.getByText("This is help text")).toBeInTheDocument();
  });

  it("should render children", () => {
    render(
      <FormField label="Test Label">
        <input type="text" data-testid="test-input" />
      </FormField>
    );

    expect(screen.getByTestId("test-input")).toBeInTheDocument();
  });

  it("should use provided id", () => {
    render(
      <FormField label="Test Label" id="custom-id">
        <input type="text" />
      </FormField>
    );

    const label = screen.getByText("Test Label");
    expect(label).toHaveAttribute("for", "custom-id");
  });

  it("should generate id when not provided", () => {
    render(
      <FormField label="Test Label">
        <input type="text" />
      </FormField>
    );

    const label = screen.getByText("Test Label");
    expect(label).toHaveAttribute("for");
    expect(label.getAttribute("for")).toMatch(/^:/);
  });

  it("should handle error display", () => {
    const mockError = { message: "Test error" };
    render(
      <FormField label="Test Label" error={mockError}>
        <input type="text" />
      </FormField>
    );

    expect(screen.getByText("Test error")).toBeInTheDocument();
  });

  it("should associate help text with field", () => {
    render(
      <FormField label="Test Label" helpText="Help text" id="test-field">
        <input type="text" id="test-field" />
      </FormField>
    );

    const helpText = screen.getByText("Help text");
    expect(helpText).toHaveAttribute("id", "test-field-help");
  });

  it("should associate error with field", () => {
    const mockError = { message: "Test error" };
    render(
      <FormField label="Test Label" error={mockError} id="test-field">
        <input type="text" id="test-field" />
      </FormField>
    );

    const errorText = screen.getByText("Test error");
    expect(errorText).toHaveAttribute("id", "test-field-error");
  });
});
