import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, it, expect, vi, Mock } from "vitest";
import "@testing-library/jest-dom";
import { SignupForm } from "../../src/components/auth/SignupForm";
import {
  AuthProvider,
  useAuth,
} from "../../src/contexts/authContext/AuthProvider";

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

const mockSignup = vi.fn();

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

  it("renders the signup form", () => {
    renderSignupForm();

    expect(screen.getByLabelText(/דואר אלקטרוני/i)).toBeInTheDocument();
    expect(screen.getAllByText(/סיסמה/i)).toHaveLength(2);
    expect(screen.getByLabelText(/אימות סיסמה/i)).toBeInTheDocument();
  });

  it("shows error messages for invalid email and password", async () => {
    renderSignupForm();

    fireEvent.change(screen.getByLabelText(/דואר אלקטרוני/i), {
      target: { value: "invalid-email" },
    });
    const passwordInput = document.getElementById("password");
    if (passwordInput) {
      fireEvent.change(passwordInput, {
        target: { value: "short" },
      });
    }
    fireEvent.change(screen.getByLabelText(/אימות סיסמה/i), {
      target: { value: "short" },
    });

    fireEvent.click(screen.getByRole("button", { name: /התחברות/i }));

    expect(await screen.findByText("Invalid email format")).toBeInTheDocument();
    expect(
      await screen.findByText(
        /Password must be 8-30 characters, include at least one uppercase letter, one lowercase letter, and one number/i
      )
    ).toBeInTheDocument();
  });

  it("shows error message when passwords do not match", async () => {
    renderSignupForm();

    fireEvent.change(screen.getByLabelText(/דואר אלקטרוני/i), {
      target: { value: "email.@gmail.com" },
    });
    const passwordInput = document.getElementById("password");
    if (passwordInput) {
      fireEvent.change(passwordInput, {
        target: { value: "Password123" },
      });
    }
    fireEvent.change(screen.getByLabelText(/אימות סיסמה/i), {
      target: { value: "Password124" },
    });

    fireEvent.click(screen.getByRole("button", { name: /התחברות/i }));

    expect(
      await screen.findByText(/Passwords do not match/i)
    ).toBeInTheDocument();
  });

  it("calls signup function with correct data", async () => {
    renderSignupForm();

    fireEvent.change(screen.getByLabelText(/דואר אלקטרוני/i), {
      target: { value: "test@example.com" },
    });
    const passwordInput = document.getElementById("password");
    if (passwordInput) {
      fireEvent.change(passwordInput, {
        target: { value: "Password123" },
      });
    }
    fireEvent.change(screen.getByLabelText(/אימות סיסמה/i), {
      target: { value: "Password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /התחברות/i }));

    expect(mockSignup).toHaveBeenCalledWith("test@example.com", "Password123");
  });

  it("displays error message when signup fails", async () => {
    mockSignup.mockRejectedValueOnce(new Error("Signup failed"));

    renderSignupForm();

    fireEvent.change(screen.getByLabelText(/דואר אלקטרוני/i), {
      target: { value: "test@example.com" },
    });
    const passwordInput = document.getElementById("password");
    if (passwordInput) {
      fireEvent.change(passwordInput, {
        target: { value: "Password123" },
      });
    }
    fireEvent.change(screen.getByLabelText(/אימות סיסמה/i), {
      target: { value: "Password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /התחברות/i }));

    expect(await screen.findByText(/Signup failed/i)).toBeInTheDocument();
  });
});
