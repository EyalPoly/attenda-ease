import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, beforeEach, expect, vi } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";
import UpdatePasswordForm from "../../src/components/auth/UpdatePasswordForm";
import React from "react";

const mockUpdateUserPassword = vi.fn();
const mockReauthenticateUsingCredential = vi.fn();
const mockGetEmailAuthProvider = vi.fn();
const mockOnClose = vi.fn();
const mockOnSuccess = vi.fn();

// Mock useAuth hook
vi.mock("../../src/contexts/authContext/AuthProvider", () => ({
  useAuth: () => ({
    currentUser: {
      email: "example@email.com",
    },
    updateUserPassword: mockUpdateUserPassword,
    reauthenticateUsingCredential: mockReauthenticateUsingCredential,
    GetEmailAuthProvider: mockGetEmailAuthProvider,
  }),
}));

describe("UpdatePasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetEmailAuthProvider.mockReturnValue({
      credential: vi.fn(),
    });
    mockReauthenticateUsingCredential.mockResolvedValue(undefined);
    mockUpdateUserPassword.mockResolvedValue(undefined);
  });

  const renderForm = () => {
    render(
      <Router>
        <UpdatePasswordForm onClose={mockOnClose} onSuccess={mockOnSuccess} />
      </Router>
    );
  };

  const fillForm = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    await userEvent.type(
      screen.getByLabelText(/^סיסמה נוכחית/i),
      currentPassword
    );
    await userEvent.type(screen.getByLabelText(/^סיסמה חדשה/i), newPassword);
    await userEvent.type(
      screen.getByLabelText(/^אימות סיסמה חדשה/i),
      confirmPassword
    );
  };

  it("renders all form elements correctly", () => {
    renderForm();

    expect(screen.getByLabelText(/^סיסמה נוכחית/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^סיסמה חדשה/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^אימות סיסמה/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^עדכן סיסמה/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^ביטול/i })).toBeInTheDocument();
  });

  it("validates new password requirements", async () => {
    renderForm();

    await fillForm("CurrentPass123", "weak", "weak");
    await userEvent.click(screen.getByRole("button", { name: /עדכן סיסמה/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Password must be 8-30 characters/i)
      ).toBeInTheDocument();
    });
  });

  it("validates password match", async () => {
    renderForm();

    await fillForm("CurrentPass123", "NewPassword123", "DifferentPass123");
    await userEvent.click(screen.getByRole("button", { name: /עדכן סיסמה/i }));

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });

  it("handles current password verification", async () => {
    mockReauthenticateUsingCredential.mockRejectedValueOnce(
      new Error("Invalid password")
    );
    renderForm();

    await fillForm("WrongPass123", "NewPassword123", "NewPassword123");
    await userEvent.click(screen.getByRole("button", { name: /^עדכן סיסמה/i }));

    await waitFor(() => {
      expect(mockReauthenticateUsingCredential).toHaveBeenCalled();
      expect(screen.getByText(/Invalid password/i)).toBeInTheDocument();
    });
  });

  it("successfully updates password", async () => {
    renderForm();

    const currentPassword = "CurrentPass123";
    const newPassword = "NewPassword123";

    await fillForm(currentPassword, newPassword, newPassword);
    await userEvent.click(screen.getByRole("button", { name: /עדכן סיסמה/i }));

    await waitFor(() => {
      expect(mockUpdateUserPassword).toHaveBeenCalledWith(
        currentPassword,
        newPassword
      );
      expect(mockOnSuccess).toHaveBeenCalledWith("!הסיסמה עודכנה בהצלחה");
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
