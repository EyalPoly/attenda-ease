import React from "react";
import { it, expect, describe, beforeEach } from 'vitest'
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { BrowserRouter } from "react-router-dom";
import Header from "../../src/components/Header";
import { pages, settings } from "../../src/components/Header";

describe("Header component", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
  });

  it("should render AttendMe logo and title", () => {
    const logo = screen.getByAltText("AttendMe Icon");
    const title = screen.getByText("AttendMe");

    expect(logo).toBeInTheDocument();
    expect(title).toBeInTheDocument();
  });

  it("should render navigation menu items", () => {
    pages.forEach((page) => {
      const navButton = screen.getByRole("link", { name: page.nameHebrew });
      expect(navButton).toBeInTheDocument();
      expect(navButton).toHaveAttribute("href", page.path);
    });
  });

  it("should open and close the mobile navigation menu", () => {
    const menuButton = screen.getByLabelText("menu");
    fireEvent.click(menuButton);

    const menuItems = screen.getAllByRole("menuitem");
    expect(menuItems).toHaveLength(pages.length);

    fireEvent.click(menuItems[0]);
    expect(screen.queryByRole("menuitem")).not.toBeInTheDocument();
  });

  it("should open and close the user settings menu", () => {
    const avatarButton = screen.getByLabelText("Open settings");
    fireEvent.click(avatarButton);

    const settingsItems = screen.getAllByRole("menuitem");
    expect(settingsItems).toHaveLength(settings.length);

    fireEvent.click(settingsItems[0]);
    expect(screen.queryByRole("menuitem")).not.toBeInTheDocument();
  });
});