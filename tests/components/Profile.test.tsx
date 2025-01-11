import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";
import Profile from "../../src/components/Profile";
import React from "react";

// Create a mock factory for different user types
const createMockUser = (isGoogleUser = false) => ({
  currentUser: {
    displayName: "Test User",
    email: "example@email.com",
    providerData: [
      {
        providerId: isGoogleUser ? "google.com" : "password",
      },
    ],
  },
});

// Mock useAuth hook with the ability to switch user types
const mockUseAuth = vi.fn();
vi.mock("../../src/contexts/authContext/AuthProvider", async () => {
  const actual = await vi.importActual(
    "../../src/contexts/authContext/AuthProvider"
  );
  return {
    ...actual,
    useAuth: () => mockUseAuth(),
  };
});

vi.mock("../../src/components/auth/UpdatePasswordForm", () => {
  return {
    default: ({ onClose, onSuccess }) => (
      <div>
        Update Password Form
        <button onClick={onClose}>סגירה</button>
        <button
          onClick={() => onSuccess("Password updated successfully")}
          data-testid="success-button"
        >
          Update Success
        </button>
      </div>
    ),
  };
});

describe("Profile", () => {
  const renderProfile = (isGoogleUser = false) => {
    mockUseAuth.mockReturnValue(createMockUser(isGoogleUser));
    render(
      <Router>
        <Profile />
      </Router>
    );
  };

  it("renders the profile page", () => {
    renderProfile(false);

    expect(screen.getByText(/שם משתמש:/i)).toBeInTheDocument();
    expect(screen.getByText(/דואר אלקטרוני:/i)).toBeInTheDocument();
  });

  it("shows the user's name and email", () => {
    renderProfile(false);

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("example@email.com")).toBeInTheDocument();
  });

  describe("Regular user", () => {
    it("shows the update password button for non-Google users", () => {
      renderProfile(false);
      expect(
        screen.getByRole("button", { name: /שינוי סיסמה/i })
      ).toBeInTheDocument();
    });

    it("opens the update password form and dismiss the button when button is clicked", async () => {
      renderProfile(false);
      fireEvent.click(screen.getByRole("button", { name: /שינוי סיסמה/i }));
      await waitFor(() => {
        expect(screen.getByText("Update Password Form")).toBeInTheDocument();
        expect(
          screen.queryByRole("button", { name: /שינוי סיסמה/i })
        ).not.toBeInTheDocument();
      });
    });

    it("shows success message and reverts to initial state when password update succeeds", async () => {
      renderProfile(false);
      fireEvent.click(screen.getByRole("button", { name: /שינוי סיסמה/i }));

      await waitFor(() => {
        expect(screen.getByText("Update Password Form")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId("success-button"));

      await waitFor(() => {
        expect(
          screen.getByText("Password updated successfully")
        ).toBeInTheDocument();
        expect(
          screen.queryByText("Update Password Form")
        ).not.toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: /שינוי סיסמה/i })
        ).toBeInTheDocument();
      });
    });
  });

  describe("Google user", () => {
    it("does not show the update password button for Google users", () => {
      renderProfile(true);
      expect(
        screen.queryByRole("button", { name: /שינוי סיסמה/i })
      ).not.toBeInTheDocument();
    });

    it("still shows user information for Google users", () => {
      renderProfile(true);
      expect(screen.getByText("Test User")).toBeInTheDocument();
      expect(screen.getByText("example@email.com")).toBeInTheDocument();
    });
  });
});
