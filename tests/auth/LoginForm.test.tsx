import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { LoginForm } from "../../src/components/auth/LoginForm";
import { useAuth } from "../../src/contexts/authContext/AuthProvider";
import React from "react";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useAuth hook
vi.mock("../../src/contexts/authContext/AuthProvider", async () => {
  const actual = await vi.importActual(
    "../../src/contexts/authContext/AuthProvider"
  );
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

const mockLoginEmailAndPassword = vi.fn();
const mockLoginWithGoogle = vi.fn();

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as Mock).mockReturnValue({
      userLoggedIn: false,
      loginEmailAndPassword: mockLoginEmailAndPassword,
      loginWithGoogle: mockLoginWithGoogle,
    });
  });

  const renderLoginForm = () => {
    render(
      <Router>
        <LoginForm />
      </Router>
    );
  };

  it("renders the login form", () => {
    renderLoginForm();

    expect(screen.getByLabelText(/דואר אלקטרוני/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/סיסמה/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^התחברות$/ })).toHaveTextContent(
      /^התחברות$/
    );
    expect(screen.getByText(/^להתחברות עם גוגל$/)).toBeInTheDocument();
    expect(screen.getByText(/אין לך חשבון\?/i)).toBeInTheDocument();
  });

  it("calls loginEmailAndPassword with correct data and navigates on success", async () => {
    renderLoginForm();

    fireEvent.change(screen.getByLabelText(/דואר אלקטרוני/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^סיסמה$/i), {
      target: { value: "Password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^התחברות$/i }));

    expect(mockLoginEmailAndPassword).toHaveBeenCalledWith(
      "test@example.com",
      "Password123"
    );
    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/attendance/report");
    });
  });

  it("displays error message when login fails", async () => {
    mockLoginEmailAndPassword.mockRejectedValueOnce(
      new Error("Invalid credentials")
    );
    renderLoginForm();

    fireEvent.change(screen.getByLabelText(/דואר אלקטרוני/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^סיסמה$/i), {
      target: { value: "WrongPassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^התחברות$/i }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });

  it("handles Google login and navigates on success", async () => {
    renderLoginForm();

    fireEvent.click(screen.getByRole("button", { name: /להתחברות עם גוגל/i }));

    expect(mockLoginWithGoogle).toHaveBeenCalled();
    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/attendance/report");
    });
  });

  it("displays error message when Google login fails", async () => {
    mockLoginWithGoogle.mockRejectedValueOnce(new Error("Google login failed"));
    renderLoginForm();

    fireEvent.click(screen.getByRole("button", { name: /להתחברות עם גוגל/i }));

    expect(await screen.findByText("Google login failed")).toBeInTheDocument();
  });

  it("redirects to attendance report when user is already logged in", () => {
    (useAuth as Mock).mockReturnValue({
      userLoggedIn: true,
      loginEmailAndPassword: mockLoginEmailAndPassword,
      loginWithGoogle: mockLoginWithGoogle,
    });

    renderLoginForm();

    expect(mockNavigate).toHaveBeenCalledWith("/attendance/report");
  });

  it("disables buttons while logging in", async () => {
    mockLoginEmailAndPassword.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    renderLoginForm();

    fireEvent.change(screen.getByLabelText(/דואר אלקטרוני/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^סיסמה$/i), {
      target: { value: "Password123" },
    });

    fireEvent.click(screen.getByTestId("email-login-button"));

    const emailLoginButton = screen.getByTestId("email-login-button");
    const googleLoginButton = screen.getByTestId("google-login-button");

    expect(emailLoginButton).toBeDisabled();
    expect(emailLoginButton).toHaveTextContent(/מתחבר\.\.\./i);
    expect(googleLoginButton).toBeDisabled();
    expect(googleLoginButton).toHaveTextContent(/מתחבר\.\.\./i);
  });
});
