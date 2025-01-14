import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, it, expect, vi, Mock } from "vitest";
import "@testing-library/jest-dom";
import { SignupForm } from "../../src/components/auth/SignupForm";
import { useAuth } from "../../src/contexts/authContext/AuthProvider";

const mockSignup = vi.fn();

// Mock useAuth hook
vi.mock("../../src/contexts/authContext/AuthProvider", async () => {
  const actual = await vi.importActual(
    "../../src/contexts/authContext/AuthProvider"
  );
  return {
    ...actual,
    useAuth: vi.fn(() => ({
      userLoggedIn: false,
      signup: mockSignup,
    })),
  };
});

describe("SignupForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as Mock).mockReturnValue({
      userLoggedIn: false,
      signup: mockSignup,
    });
  });

  const renderSignupForm = () => {
    render(
      <Router>
        <SignupForm />
      </Router>
    );
  };

  const fillForm = async (
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    await userEvent.type(screen.getByLabelText(/^דואר אלקטרוני/i), email);
    await userEvent.type(screen.getByLabelText(/^סיסמה/i), password);
    await userEvent.type(
      screen.getByLabelText(/^אימות סיסמה/i),
      confirmPassword
    );
  };

  it("renders the signup form", () => {
    renderSignupForm();

    expect(screen.getByLabelText(/דואר אלקטרוני/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^סיסמה$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^אימות סיסמה$/i)).toBeInTheDocument();
  });

  it("shows error messages for invalid email and password", async () => {
    renderSignupForm();

    await fillForm("invalid-email", "short", "short");

    await userEvent.click(screen.getByRole("button", { name: /הרשמה/i }));

    expect(await screen.findByText("Invalid email format")).toBeInTheDocument();
    expect(
      await screen.findByText(
        /Password must be 8-30 characters, include at least one uppercase letter, one lowercase letter, and one number/i
      )
    ).toBeInTheDocument();
    expect(mockSignup).not.toHaveBeenCalled();
  });

  it("shows error message when passwords do not match", async () => {
    renderSignupForm();

    await fillForm("email@gmail.com", "Password123", "Password124");

    await userEvent.click(screen.getByRole("button", { name: /הרשמה/i }));

    expect(
      await screen.findByText(/Passwords do not match/i)
    ).toBeInTheDocument();
  });

  it("calls signup function with correct data", async () => {
    renderSignupForm();

    await fillForm("test@example.com", "Password123", "Password123");

    await userEvent.click(screen.getByRole("button", { name: /הרשמה/i }));

    expect(mockSignup).toHaveBeenCalledWith("test@example.com", "Password123");
  });

  it("displays error message when signup fails", async () => {
    mockSignup.mockRejectedValueOnce(new Error("Signup failed"));

    renderSignupForm();

    await fillForm("test@example.com", "Password123", "Password123");

    await userEvent.click(screen.getByRole("button", { name: /הרשמה/i }));

    expect(await screen.findByText(/Signup failed/i)).toBeInTheDocument();
  });
});
