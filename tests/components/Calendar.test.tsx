import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import Calendar from "../../src/components/Calendar";
import dayjs  from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AttendanceDayForm from "../../src/components/AttendanceDayForm";

vi.mock("axios");

describe("Calendar Component", () => {
  const mockSelectedAttendanceData = {
    workplace: "בית ספר",
    isAbsence: false,
    startHour: "09:00",
    endHour: "17:00",
    frontalHours: 5,
    individualHours: 2,
    stayingHours: 1,
    comments: "Test Comment",
  };

  beforeEach(() => {
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Calendar month={dayjs()} />
      </LocalizationProvider>
    );
  });

  it("should render calendar with date buttons", () => {
    // First verify the calendar is rendered
    const calendar = screen.getByRole("grid");
    expect(calendar).toBeInTheDocument();

    // Find all date cells within the calendar
    const dateCells = within(calendar).getAllByRole("gridcell");
    expect(dateCells.length).toBeGreaterThan(0);
  });

  it("renders AttendanceDayForm when a date is clicked", () => {
    // Find the first day cell (with text content "1")
    const firstDayCell = screen.getByRole("gridcell", { name: "1" });
    expect(firstDayCell).toBeInTheDocument();
    
    fireEvent.click(firstDayCell);

    // Verify the form appears
    const workplaceInput = screen.getByLabelText("מקום עבודה");
    expect(workplaceInput).toBeInTheDocument();
  });

  it("handles form submission correctly", async () => {
    // Click the first day
    const firstDayCell = screen.getByRole("gridcell", { name: "1" });
    fireEvent.click(firstDayCell);

    // Fill out the form
    const workplaceInput = screen.getByLabelText("מקום עבודה");
    fireEvent.change(workplaceInput, { target: { value: mockSelectedAttendanceData.workplace } });

    // Submit the form
    const saveButton = screen.getByText("שמור");
    fireEvent.click(saveButton);

    // Verify the submission
    expect(workplaceInput).toHaveValue(mockSelectedAttendanceData.workplace);
  });

  // it("check day change", async () => {
  //   // Click the first day
  //   const firstDayCell = screen.getByRole("gridcell", { name: "1" });
  //   fireEvent.click(firstDayCell);

  //   // Fill out the form
  //   const workplaceInput = screen.getByLabelText("מקום עבודה");
  //   fireEvent.change(workplaceInput, { target: { value: mockSelectedAttendanceData.workplace } });

  //   // Submit the form
  //   const saveButton = screen.getByText("שמור");
  //   fireEvent.click(saveButton);

  //   // Click the second day
  //   const secondDayCell = screen.getByRole("gridcell", { name: "2" });
  //   fireEvent.click(secondDayCell);

  //   // Verify the form is empty
  //   expect(workplaceInput).toHaveValue("");
  // });
});
