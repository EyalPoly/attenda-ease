import { render, screen, fireEvent } from "@testing-library/react";
import Popup from "../../src/components/Popup";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";


describe("Popup Component", () => {
  it("renders the title and children correctly", () => {
    render(
      <Popup title="Test Title" openPopup={true} setOpenPopup={() => {}}>
        <div>Test Children</div>
      </Popup>
    );

    const title = screen.getByText("Test Title");
    const children = screen.getByText("Test Children");
    expect(title).toBeInTheDocument();
    expect(children).toBeInTheDocument(); 
  });

  it("calls setOpenPopup with false when close button is clicked", () => {
    const setOpenPopup = vi.fn();
    render(
      <Popup title="Test Title" openPopup={true} setOpenPopup={setOpenPopup}>
        <div>Test Children</div>
      </Popup>
    );

    fireEvent.click(screen.getByText("X"));
    expect(setOpenPopup).toHaveBeenCalledWith(false);
  });

  it("does not render when openPopup is false", () => {
    render(
      <Popup title="Test Title" openPopup={false} setOpenPopup={() => {}}>
        <div>Test Children</div>
      </Popup>
    );

    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
    expect(screen.queryByText("Test Children")).not.toBeInTheDocument();
  });
});
