import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import Calendar from "../../src/components/Calendar";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

vi.mock("axios");

describe("Calendar Component", () => {
  const mockDate = dayjs("2024-03-01");
  const mockAttendanceData = {
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
    vi.clearAllMocks();
    // Mock console.error and console.log to prevent noise in test output
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderCalendar = () => {
    return render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Calendar initialDate={mockDate} />
      </LocalizationProvider>
    );
  };

  describe("Calendar Rendering", () => {
    it("should render calendar with correct month heading", () => {
      renderCalendar();

      const monthHeading = screen.getByText("March 2024", { exact: false });
      expect(monthHeading).toBeInTheDocument();
    });
  });

  describe("Date Selection and Popup Behavior", () => {
    it("should open popup when clicking a date", async () => {
      renderCalendar();

      const dayCell = screen.getByRole("gridcell", {
        name: mockDate.date().toString(),
      });
      await userEvent.click(dayCell);

      expect(screen.getByText(/פרטי נוכחות/)).toBeInTheDocument();
      expect(
        screen.getByLabelText(new RegExp(mockDate.format("DD/MM/YYYY")))
      ).toBeInTheDocument();
    });

    it("render popup open and close correctly", async () => {
      renderCalendar();
      const dayCell = screen.getByRole("gridcell", {
        name: mockDate.date().toString(),
      });

      // First open
      await userEvent.click(dayCell);
      const firstTitle = screen.getByText(
        new RegExp(mockDate.format("DD/MM/YYYY"))
      );
      expect(firstTitle).toBeInTheDocument();

      // Close
      await userEvent.click(screen.getByText("X"));
      await waitFor(() => {
        expect(
          screen.queryByText(new RegExp(mockDate.format("DD/MM/YYYY")))
        ).not.toBeInTheDocument();
      });

      // Reopen
      await userEvent.click(dayCell);
      expect(
        screen.getByText(new RegExp(mockDate.format("DD/MM/YYYY")))
      ).toBeInTheDocument();
    });

    it("render popup close after save click", async () => {
      renderCalendar();
      const dayCell = screen.getByRole("gridcell", {
        name: mockDate.date().toString(),
      });

      // First open
      await userEvent.click(dayCell);
      const firstTitle = screen.getByText(
        new RegExp(mockDate.format("DD/MM/YYYY"))
      );
      expect(firstTitle).toBeInTheDocument();

      // Fill out the form
      const workplaceInput = screen.getByLabelText("מקום עבודה");
      fireEvent.change(workplaceInput, {
        target: { value: mockAttendanceData.workplace },
      });
      const beginHourInput = screen.getByLabelText("שעת התחלה");
      fireEvent.change(beginHourInput, {
        target: { value: mockAttendanceData.startHour },
      });
      const endHourInput = screen.getByLabelText("שעת סיום");
      fireEvent.change(endHourInput, {
        target: { value: mockAttendanceData.endHour },
      });

      // Submit the form
      const saveButton = screen.getByText("שמור");
      await userEvent.click(saveButton);

      // Verify popup closed
      await waitFor(() => {
        expect(screen.queryByText(/פרטי נוכחות/)).not.toBeInTheDocument();
      });
    });

    it("renders AttendanceDayForm when a date is clicked", async () => {
      renderCalendar();

      const firstDayCell = screen.getByRole("gridcell", {
        name: mockDate.date().toString(),
      });
      expect(firstDayCell).toBeInTheDocument();

      await userEvent.click(firstDayCell);

      // Verify the form appears
      const workplaceInput = screen.getByLabelText("מקום עבודה");
      expect(workplaceInput).toBeInTheDocument();
    });

    it("handles form submission correctly", async () => {
      renderCalendar();

      // Click the first day
      const firstDayCell = screen.getByRole("gridcell", {
        name: mockDate.date().toString(),
      });
      await userEvent.click(firstDayCell);

      // Fill out the form
      const workplaceInput = screen.getByLabelText("מקום עבודה");
      fireEvent.change(workplaceInput, {
        target: { value: mockAttendanceData.workplace },
      });
      const beginHourInput = screen.getByLabelText("שעת התחלה");
      fireEvent.change(beginHourInput, {
        target: { value: mockAttendanceData.startHour },
      });
      const endHourInput = screen.getByLabelText("שעת סיום");
      fireEvent.change(endHourInput, {
        target: { value: mockAttendanceData.endHour },
      });

      // Submit the form
      const saveButton = screen.getByText("שמור");
      await userEvent.click(saveButton);

      // Verify popup closed
      await waitFor(() => {
        expect(screen.queryByText(/פרטי נוכחות/)).not.toBeInTheDocument();
      });

      // Verify the submission
      await userEvent.click(firstDayCell);
      const workplaceInputNew = screen.getByLabelText("מקום עבודה");
      expect(workplaceInputNew).toHaveValue(mockAttendanceData.workplace);
    });

    it("check day change", async () => {
      renderCalendar();

      // Click the first day
      const firstDayCell = screen.getByRole("gridcell", {
        name: mockDate.date().toString(),
      });
      await userEvent.click(firstDayCell);

      // Fill out the form
      const workplaceInput = screen.getByLabelText("מקום עבודה");
      fireEvent.change(workplaceInput, {
        target: { value: mockAttendanceData.workplace },
      });
      const beginHourInput = screen.getByLabelText("שעת התחלה");
      fireEvent.change(beginHourInput, {
        target: { value: mockAttendanceData.startHour },
      });
      const endHourInput = screen.getByLabelText("שעת סיום");
      fireEvent.change(endHourInput, {
        target: { value: mockAttendanceData.endHour },
      });

      // Submit the form
      const saveButton = screen.getByText("שמור");
      await userEvent.click(saveButton);

      // Verify popup closed
      await waitFor(() => {
        expect(screen.queryByText(/פרטי נוכחות/)).not.toBeInTheDocument();
      });

      // Click the second day
      const secondDayCell = screen.getByRole("gridcell", {
        name: (mockDate.date() + 1).toString(),
      });
      await userEvent.click(secondDayCell);

      // Verify the form is empty
      const workplaceInputSecond = screen.getByLabelText("מקום עבודה");
      await waitFor(() => {
        expect(workplaceInputSecond).toHaveValue("");
      });
    });
  });
});
