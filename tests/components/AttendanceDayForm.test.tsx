import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import AttendanceDayForm, {
  AttendanceDayData,
} from "../../src/components/AttendanceDayForm";
import React from "react";
import "@testing-library/jest-dom";

describe("AttendanceDayForm Component", () => {
  const mockAttendanceData = {
    workplace: "Test Workplace",
    isAbsence: false,
    startHour: "09:00",
    endHour: "17:00",
    frontalHours: 5,
    individualHours: 2,
    stayingHours: 1,
    comments: "Test comments",
  };

  it("renders form inputs correctly", () => {
    render(
      <AttendanceDayForm
        attendanceData={null}
        onSubmit={function (data: AttendanceDayData): void {
          console.log("Form submitted with data:", data);
        }}
      />
    );

    expect(screen.getByLabelText("חיסור")).toBeInTheDocument();
    expect(screen.getByLabelText("מקום עבודה")).toBeInTheDocument();
    expect(screen.getByLabelText("הערות")).toBeInTheDocument();
  });

  it("populates form with attendanceData when provided", () => {
    render(
      <AttendanceDayForm
        attendanceData={mockAttendanceData}
        onSubmit={function (data: AttendanceDayData): void {
          console.log("Form submitted with data:", data);
        }}
      />
    );

    const workplaceInput = screen.getByLabelText(
      "מקום עבודה"
    ) as HTMLInputElement;
    expect(workplaceInput.value).toBe("Test Workplace");
  });

  it("conditionally renders hour inputs when isAbsence is false", async () => {
    render(
      <AttendanceDayForm
        attendanceData={null}
        onSubmit={function (data: AttendanceDayData): void {
          console.log("Form submitted with data:", data);
        }}
      />
    );

    const isAbsenceCheckbox = screen.getByLabelText("חיסור");

    // By default, hour inputs should be visible
    expect(screen.getByLabelText("שעת התחלה")).toBeInTheDocument();
    expect(screen.getByLabelText("שעת סיום")).toBeInTheDocument();
    expect(screen.getByLabelText("שעות פרונטליות")).toBeInTheDocument();

    // Check absence checkbox and verify hour inputs disappear
    await userEvent.click(isAbsenceCheckbox);

    expect(screen.queryByLabelText("שעת התחלה")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("שעת סיום")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("שעות פרונטליות")).not.toBeInTheDocument();
  });

  it("validates form inputs with patterns", async () => {
    const onSubmitMock = vi.fn();
    render(<AttendanceDayForm attendanceData={null} onSubmit={onSubmitMock} />);

    const workplaceInput = screen.getByLabelText("מקום עבודה");
    const startHourInput = screen.getByLabelText("שעת התחלה");
    const submitButton = screen.getByText("שמור");

    // Invalid workplace (non-Hebrew)
    await userEvent.type(workplaceInput, "Invalid Workplace");
    await userEvent.type(startHourInput, "09:00");
    await userEvent.click(submitButton);

    // Check that onSubmit was not called due to validation error
    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  it("submits form with correct data", async () => {
    const onSubmitMock = vi.fn();
    render(
      <AttendanceDayForm
        attendanceData={null}
        onSubmit={onSubmitMock}
      />
    );

    await userEvent.type(screen.getByLabelText("מקום עבודה"), "מקום עבודה");
    await userEvent.type(screen.getByLabelText("שעת התחלה"), "09:00");
    await userEvent.type(screen.getByLabelText("שעת סיום"), "17:00");
    await userEvent.type(screen.getByLabelText("שעות פרונטליות"), "5");
    await userEvent.type(screen.getByLabelText("שעות פרטניות"), "2");
    await userEvent.type(screen.getByLabelText("שעות שהייה"), "1");
    await userEvent.type(screen.getByLabelText("הערות"), "Test comments");

    await userEvent.click(screen.getByText("שמור"));

    expect(onSubmitMock).toHaveBeenCalledWith(
      expect.objectContaining({
        workplace: "מקום עבודה",
        startHour: "09:00",
        endHour: "17:00",
      })
    );
  });
});
