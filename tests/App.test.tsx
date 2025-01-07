import React from "react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AppRoutes } from "../src/App/App";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../src/contexts/authContext/AuthProvider";

// Mock all the components
vi.mock("../src/pages/AttendanceReportPage", () => ({
  default: () => <div>Attendance Report Page Test</div>,
}));

vi.mock("../src/pages/SignupPage", () => ({
  default: () => <div>Signup Form Test</div>,
}));

vi.mock("../src/pages/LoginPage", () => ({
  default: () => <div data-testid="login-page">Login Page Test</div>,
}));

vi.mock("../src/pages/NotFoundPage", () => ({
  default: () => <div>404 Not Found Test</div>,
}));

const mockUseAuth = vi.fn();

// Mock the auth context
vi.mock("../src/contexts/authContext/AuthProvider", () => {
  return {
    AuthProvider: ({ children }: { children: React.ReactNode }) => children,
    useAuth: () => mockUseAuth(),
  };
});

// Create a wrapper component that provides routing and auth context
const renderWithRouter = (initialEntry = "/") => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </MemoryRouter>
  );
};

describe("App Routing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Public Routes", () => {
    beforeEach(() => {
      // Mock as logged out
      mockUseAuth.mockImplementation(() => ({
        userLoggedIn: false,
      }));
    });

    it("should render login page for /login when logged out", async () => {
      renderWithRouter("/login");

      await waitFor(() => {
        expect(screen.getByText(/login page test/i)).toBeInTheDocument();
      });
    });

    it("should render signup page for /signup when logged out", async () => {
      renderWithRouter("/signup");

      await waitFor(() => {
        expect(screen.getByText(/signup form test/i)).toBeInTheDocument();
      });
    });

    it("should redirect to login when accessing protected route while logged out", async () => {
      renderWithRouter("/attendance/report");

      await waitFor(() => {
        expect(screen.getByText(/login page test/i)).toBeInTheDocument();
      });
    });
  });

  describe('Protected Routes', () => {
    beforeEach(() => {
      mockUseAuth.mockImplementation(() => ({
        userLoggedIn: true
      }));
    });

    it('should render attendance report page for root path when logged in', async () => {
      renderWithRouter('/');

      await waitFor(() => {
        expect(screen.getByText('Attendance Report Page Test')).toBeInTheDocument();
      }); 
    });

    it('should render attendance report page for /attendance/report when logged in', async () => {
      renderWithRouter('/attendance/report');

      await waitFor(() => {
        expect(screen.getByText('Attendance Report Page Test')).toBeInTheDocument();
      });
    });

    it('should redirect to home when accessing login while logged in', async () => {
      renderWithRouter('/login');

      await waitFor(() => {
        expect(screen.getByText('Attendance Report Page Test')).toBeInTheDocument();
      });

      // Get the current location from the MemoryRouter
      const { pathname } = window.location;
      expect(pathname).toBe('/');
    });
  });

  describe('Not Found Route', () => {
    it('should render 404 page for non-existent routes', () => {
      mockUseAuth.mockImplementation(() => ({
        userLoggedIn: false
      }));
      renderWithRouter('/non-existent-route');

      expect(screen.getByText('404 Not Found Test')).toBeInTheDocument();
    });
  });
});
