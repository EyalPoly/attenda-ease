import React from "react";
import { it, expect, describe, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { BrowserRouter } from "react-router-dom";
import Header from "../../src/components/Header";
import { pages, settings } from "../../src/components/Header";
import { AuthProvider } from "../../src/contexts/authContext/AuthProvider";

// Mock the auth context
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Mock auth context values
const mockAuthContext = {
  userLoggedIn: true,
  logout: vi.fn()
};

vi.mock("../../src/contexts/authContext/AuthProvider", () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }) => <div>{children}</div>
}));

describe("Header component", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
      <AuthProvider>
        <Header />
      </AuthProvider>
      </BrowserRouter>
    );
    vi.clearAllMocks();
  });

  it("should render AttendMe logo and title", () => {
    const logo = screen.getByAltText("AttendMe Icon");
    const title = screen.getByText("AttendMe");

    expect(logo).toBeInTheDocument();
    expect(title).toBeInTheDocument();
  });

  it("should render navigation menu items when user is logged in", () => {
    pages.forEach((page) => {
      const navButton = screen.getByRole("link", { name: page.nameHebrew });
      expect(navButton).toBeInTheDocument();
      expect(navButton).toHaveAttribute("href", page.path);
    });
  });

  it("should open and close the mobile navigation menu", () => {
    const menuButton = screen.getByLabelText("menu");
    fireEvent.click(menuButton);

    pages.forEach((page) => {
      const menuItem = screen.getByRole("menuitem", { name: page.nameHebrew });
      expect(menuItem).toBeInTheDocument();
    });

    // Click first menu item to close
    fireEvent.click(screen.getByRole("menuitem", { name: pages[0].nameHebrew }));
    expect(screen.queryByRole("menuitem", { name: pages[0].nameHebrew })).not.toBeInTheDocument();
  });

  it("should open and close the user settings menu", () => {
    const settingsButton = screen.getByLabelText("הגדרות");
    fireEvent.click(settingsButton);

    settings.forEach((setting) => {
      const menuItem = screen.getByRole("menuitem", { name: setting.nameHebrew });
      expect(menuItem).toBeInTheDocument();
    });

    // Click first setting to close
    fireEvent.click(screen.getByRole("menuitem", { name: settings[0].nameHebrew }));
    expect(screen.queryByRole("menuitem", { name: settings[0].nameHebrew })).not.toBeInTheDocument();
  });

  it("should logout the user when Logout is clicked", async () => {
    const settingsButton = screen.getByLabelText("הגדרות");
    fireEvent.click(settingsButton);

    const logoutButton = screen.getByRole("menuitem", { name: "התנתק" });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockAuthContext.logout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
    });
  });

  it("should not render navigation items when user is not logged in", () => {
    // Re-render with userLoggedIn set to false
    vi.mocked(mockAuthContext).userLoggedIn = false;
    
    render(
      <BrowserRouter>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </BrowserRouter>
    );

    pages.forEach((page) => {
      const navButton = screen.queryByRole("button", { name: page.nameHebrew });
      expect(navButton).not.toBeInTheDocument();
    });
  });
});