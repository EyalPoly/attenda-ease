import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AttendanceFormInput from "../../src/components/AttendanceFormInput";
import React from "react";
import "@testing-library/jest-dom";

describe("AttendanceFormInput", () => {
  const mockRegister = vi.fn();

  it("renders the input field with the correct label", () => {
    render(
      <AttendanceFormInput
        name="testName"
        label="Test Label"
        register={mockRegister}
      />
    );
    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
  });

  it('calls register with correct parameters for required input', () => {
    render(
      <AttendanceFormInput 
        name="testInput" 
        label="Test Label" 
        register={mockRegister} 
        required={true} 
      />
    );

    expect(mockRegister).toHaveBeenCalledWith(
      'testInput', 
      { 
        required: 'שדה Test Label הוא חובה', 
        pattern: undefined 
      }
    );
  });

  it('renders error message when error prop is provided', () => {
    render(
      <AttendanceFormInput 
        name="testInput" 
        label="Test Label" 
        register={mockRegister} 
        error={{ message: 'Error message' }} 
      />
    );

    const errorText = screen.getByText('Error message');
    expect(errorText).toBeInTheDocument();
  });

  it('renders multiline input when multiline prop is true', () => {
    render(
      <AttendanceFormInput 
        name="testInput" 
        label="Test Label" 
        register={mockRegister} 
        multiline={true}
        rows={4} 
      />
    );

    const inputElement = screen.getByLabelText('Test Label');
    expect(inputElement).toHaveAttribute('rows', '4');
  });

  it('renders input with specified type', () => {
    render(
      <AttendanceFormInput 
        name="testInput" 
        label="Test Label" 
        register={mockRegister} 
        type="number" 
      />
    );

    const inputElement = screen.getByLabelText('Test Label');
    expect(inputElement).toHaveAttribute('type', 'number');
  });
});
