import React from "react";
import { it, expect, describe, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import CheckBox from "../../src/components/CheckBox";

describe("CheckBox component", () => {
  const mockRegister = vi.fn();

  beforeEach(() => {
    render(<CheckBox name="test" register={mockRegister} label="Test Label" />);
  });

  it("renders the checkbox with the correct label", () => {
    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
  });

  it("calls register function with correct arguments", () => {
    expect(mockRegister).toHaveBeenCalledWith("test", { required: false });
  });

  it("displays required message when required prop is true", () => {
    render(
      <CheckBox
        name="test"
        register={mockRegister}
        label="Test Label"
        required
      />
    );
    expect(mockRegister).toHaveBeenCalledWith("test", {
      required: "Test Label הוא חובה",
    }); 
  });

  it("checkbox can be checked and unchecked", () => {
    const checkbox = screen.getByLabelText("Test Label");
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});
