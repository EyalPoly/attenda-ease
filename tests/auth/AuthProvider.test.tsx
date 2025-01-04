import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  AuthProvider,
  useAuth,
} from "../../src/contexts/authContext/AuthProvider";
import * as firebaseAuth from "firebase/auth";
import "@testing-library/jest-dom";
import { useEffect } from "react";

vi.mock("../../src/firebase/firebase", () => ({
  auth: vi.fn(),
}));

// Mock Firebase auth
vi.mock("firebase/auth", async () => {
  const actual = await vi.importActual("firebase/auth");
  return {
    ...actual,
    getAuth: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    signInWithPopup: vi.fn(),
    signOut: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
    updatePassword: vi.fn(),
    onAuthStateChanged: vi.fn(),
    GoogleAuthProvider: vi.fn(() => ({
      setCustomParameters: vi.fn(),
    })),
    EmailAuthProvider: {
      credential: vi.fn(),
    },
    reauthenticateWithCredential: vi.fn(),
  };
});

const mockUser = {
  email: "test@test.com",
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  refreshToken: "",
  tenantId: "",
  uid: "mock-uid",
  displayName: null,
  phoneNumber: null,
  photoURL: null,
  delete: vi.fn(),
  providerId: "firebase",
  getIdToken: vi.fn(),
  getIdTokenResult: vi.fn(),
  reload: vi.fn(),
  toJSON: vi.fn(),
};

// Test component to expose auth context
const TestComponent = () => {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="user-status">
        {auth.userLoggedIn ? "logged-in" : "logged-out"}
      </div>
      <button onClick={() => auth.signup("test@test.com", "password")}>
        Sign Up
      </button>
      <button
        onClick={() => auth.loginEmailAndPassword("test@test.com", "password")}
      >
        Login
      </button>
      <button onClick={auth.loginWithGoogle}>Google Login</button>
      <button onClick={auth.logout}>Logout</button>
      <button onClick={() => auth.resetPassword("test@test.com")}>
        Reset Password
      </button>
      <button onClick={() => auth.updateUserPassword("oldpass", "newpass")}>
        Update Password
      </button>
    </div>
  );
};

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default to logged out state
    (firebaseAuth.onAuthStateChanged as any).mockImplementation(
      (_: any, callback: (user: firebaseAuth.User | null) => void) => {
        callback(null);
        return vi.fn();
      }
    );
  });

  it("renders children when auth is initialized", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("user-status")).toHaveTextContent("logged-out");
  });

  it("handles signup successfully", async () => {
    const user = userEvent.setup();
    (firebaseAuth.createUserWithEmailAndPassword as any).mockResolvedValueOnce({
      user: { email: "test@test.com" },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await user.click(screen.getByText("Sign Up"));

    expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      "test@test.com",
      "password"
    );
    expect(firebaseAuth.signOut).toHaveBeenCalled();
  });

  it("handles email/password login successfully", async () => {
    const user = userEvent.setup();
    const mockUser = { email: "test@test.com" };
    (firebaseAuth.signInWithEmailAndPassword as any).mockResolvedValueOnce({
      user: mockUser,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await user.click(screen.getByText("Login"));

    expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      "test@test.com",
      "password"
    );

    await waitFor(() => {
      expect(screen.getByTestId("user-status")).toHaveTextContent("logged-in");
    });
  });

  it("handles Google login successfully", async () => {
    const user = userEvent.setup();
    const mockUser = { email: "test@test.com" };
    (firebaseAuth.signInWithPopup as any).mockResolvedValueOnce({
      user: mockUser,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await user.click(screen.getByText("Google Login"));

    expect(firebaseAuth.signInWithPopup).toHaveBeenCalled();
    expect(firebaseAuth.GoogleAuthProvider).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByTestId("user-status")).toHaveTextContent("logged-in");
    });
  });

  it("handles logout successfully", async () => {
    const user = userEvent.setup();
    (firebaseAuth.signOut as any).mockResolvedValueOnce();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await user.click(screen.getByText("Logout"));

    expect(firebaseAuth.signOut).toHaveBeenCalled();
  });

  it("handles password reset successfully", async () => {
    const user = userEvent.setup();
    (firebaseAuth.sendPasswordResetEmail as any).mockResolvedValueOnce();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await user.click(screen.getByText("Reset Password"));

    expect(firebaseAuth.sendPasswordResetEmail).toHaveBeenCalledWith(
      expect.anything(),
      "test@test.com"
    );
  });

  it("handles password update successfully", async () => {
    const user = userEvent.setup();

    // Mock auth state to be logged in
    (firebaseAuth.onAuthStateChanged as any).mockImplementation(
      (_: any, callback: (user: firebaseAuth.User | null) => void) => {
        callback(mockUser);
        return vi.fn();
      }
    );

    (firebaseAuth.EmailAuthProvider.credential as any).mockReturnValueOnce(
      "mock-credential"
    );
    (firebaseAuth.reauthenticateWithCredential as any).mockResolvedValueOnce();
    (firebaseAuth.updatePassword as any).mockResolvedValueOnce();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await user.click(screen.getByText("Update Password"));

    expect(firebaseAuth.EmailAuthProvider.credential).toHaveBeenCalledWith(
      "test@test.com",
      "oldpass"
    );
    expect(firebaseAuth.reauthenticateWithCredential).toHaveBeenCalled();
    expect(firebaseAuth.updatePassword).toHaveBeenCalledWith(
      mockUser,
      "newpass"
    );
  });

  it("handles errors appropriately", async () => {
    const user = userEvent.setup();
    const mockError = new Error("Auth error");
    (firebaseAuth.signInWithEmailAndPassword as any).mockRejectedValueOnce(
      mockError
    );

    const consoleSpy = vi.spyOn(console, "log");

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await user.click(screen.getByText("Login"));

    expect(consoleSpy).toHaveBeenCalledWith("Error signing in:", mockError);

    // You can also add type assertion for better TypeScript support
    const statusElement = screen.getByTestId("user-status");
    expect(statusElement).toHaveTextContent("logged-out");
  });

  describe("Password Update Error Cases", () => {
    // Create a wrapper component that exposes the auth functions
    const TestWrapper = ({ onError }: { onError: (error: Error) => void }) => {
      const auth = useAuth();

      useEffect(() => {
        const testAuth = async () => {
          try {
            await auth.updateUserPassword("oldpass", "newpass");
          } catch (error) {
            onError(error as Error);
          }
        };
        testAuth();
      }, [auth, onError]);

      return null;
    };

    beforeEach(() => {
      // Mock auth state to be logged in
      (firebaseAuth.onAuthStateChanged as any).mockImplementation(
        (_: any, callback: (user: firebaseAuth.User | null) => void) => {
          callback(mockUser);
          return vi.fn();
        }
      );
    });

    it("handles no user logged in error", async () => {
      // Override to logged out state
      (firebaseAuth.onAuthStateChanged as any).mockImplementation(
        (_: any, callback: (user: firebaseAuth.User | null) => void) => {
          callback(null);
          return vi.fn();
        }
      );

      const errorPromise = new Promise<Error>((resolve) => {
        render(
          <AuthProvider>
            <TestWrapper onError={resolve} />
          </AuthProvider>
        );
      });

      const error = await errorPromise;
      expect(error.message).toBe("No user logged in");
      expect(firebaseAuth.updatePassword).not.toHaveBeenCalled();
    });

    it("handles null email error", async () => {
      // Create a mock user with null email
      const userWithNullEmail = {
        ...mockUser,
        email: null,
      };

      // Mock logged in user state with null email
      (firebaseAuth.onAuthStateChanged as any).mockImplementation(
        (_: any, callback: (user: firebaseAuth.User | null) => void) => {
          callback(userWithNullEmail);
          return vi.fn();
        }
      );

      const resultPromise = new Promise<Error>((resolve) => {
        render(
          <AuthProvider>
            <TestWrapper onError={resolve} />
          </AuthProvider>
        );
      });

      const result = await resultPromise;
      expect(result.message).toBe("User email is null");
      expect(firebaseAuth.EmailAuthProvider.credential).not.toHaveBeenCalled();
      expect(firebaseAuth.reauthenticateWithCredential).not.toHaveBeenCalled();
      expect(firebaseAuth.updatePassword).not.toHaveBeenCalled();
    });

    it("handles reauthentication failure", async () => {
      const mockError = new Error("Reauthentication failed");
      (firebaseAuth.reauthenticateWithCredential as any).mockRejectedValueOnce(
        mockError
      );

      const resultPromise = new Promise<Error>((resolve) => {
        render(
          <AuthProvider>
            <TestWrapper onError={resolve} />
          </AuthProvider>
        );
      });

      const result = await resultPromise;
      expect(result.message).toBe("Reauthentication failed");
      expect(firebaseAuth.updatePassword).not.toHaveBeenCalled();
    });

    it.only("handles password update failure", async () => {
      const mockError = new Error("Password update failed");
      (
        firebaseAuth.reauthenticateWithCredential as any
      ).mockResolvedValueOnce();
      (firebaseAuth.updatePassword as any).mockRejectedValueOnce(mockError);

      const resultPromise = new Promise<Error>((resolve) => {
        render(
          <AuthProvider>
            <TestWrapper onError={resolve} />
          </AuthProvider>
        );
      });

      const result = await resultPromise;
      expect(result.message).toBe("Password update failed");
      expect(firebaseAuth.updatePassword).toHaveBeenCalled();
    });
  });
});
