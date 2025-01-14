import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import AttendanceReportPage from "../../src/pages/AttendanceReportPage";
import dayjs from "dayjs";
import { BrowserRouter } from "react-router-dom";

// Mock the images
vi.mock("../assets/icons/AttendMeIcon.png", () => "mocked-icon-path");

describe("AttendanceReportPage", () => {
  const renderAttendanceReportPage = () => {
    return render(
      <BrowserRouter>
        <AttendanceReportPage />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders specific page header", () => {
    renderAttendanceReportPage();

    // Ensure the title is found specifically as a heading
    const pageTitle = screen.getByRole("heading", {
      name: /^דו״ח נוכחות חודשי$/,
      level: 6, // Match the Typography variant used (`h6` in PageTitleStyled)
    });
    expect(pageTitle).toBeInTheDocument();

    // Ensure the subtitle is found uniquely
    const pageSubtitle = screen.getByText(
      ".יש למלא את הנוכחות החודשית שלך, ובסוף החודש להגיש את הדו״ח"
    );
    expect(pageSubtitle).toBeInTheDocument();
  });

  it("renders calendar component", () => {
    renderAttendanceReportPage();

    const currentMonthYear = dayjs().format("MMMM YYYY");
    expect(screen.getByText(currentMonthYear)).toBeInTheDocument();
  });
});
