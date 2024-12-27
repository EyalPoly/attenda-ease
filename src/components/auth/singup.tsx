import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/authContext/AuthProvider";

export const SignupForm = () => {
  const navigate = useNavigate();
  const { userLogedIn, signup } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,30}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    let valid = true;
    const errors = { email: "", password: "", confirmPassword: "" };

    if (!validateEmail(email)) {
      errors.email = "Invalid email format";
      valid = false;
    }
    if (!validatePassword(password)) {
      errors.password =
        "Password must be 8-30 characters, include at least one uppercase letter, one lowercase letter, and one number";
      valid = false;
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setFieldErrors(errors);
    return valid;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSigningUp && validateForm()) {
      setIsSigningUp(true);
      try {
        await signup(email, password);
        navigate("/attendance/report");
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.includes("email-already-in-use")) {
            setError("Email is already in use");
          } else {
            setError(err.message);
          }
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsSigningUp(false);
      }
    }
  };

  return (
    <>
      {userLogedIn && navigate("/attendance/report")}

      <main className="w-full h-screen flex self-center place-content-center place-items-center">
        <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
          <div className="text-center mb-6">
            <div className="mt-2">
              <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">
                Create New Account
              </h3>
            </div>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 font-bold">Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, email: "" })); // Clear error on input change
                }}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
              />
              {fieldErrors.email && (
                <span className="text-red-500 text-sm">
                  {fieldErrors.email}
                </span>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600 font-bold">
                Password
              </label>
              <input
                disabled={isSigningUp}
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, password: "" })); // Clear error on input change
                }}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
              />
              {fieldErrors.password && (
                <span className="text-red-500 text-sm">
                  {fieldErrors.password}
                </span>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-600 font-bold">
                Confirm Password
              </label>
              <input
                disabled={isSigningUp}
                type="password"
                autoComplete="off"
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, confirmPassword: "" })); // Clear error on input change
                }}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
              />
              {fieldErrors.confirmPassword && (
                <span className="text-red-500 text-sm">
                  {fieldErrors.confirmPassword}
                </span>
              )}
            </div>

            {error && <span className="text-red-600 font-bold">{error}</span>}

            <button
              className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                isSigningUp
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300"
              }`}
              type="submit"
              disabled={isSigningUp}
            >
              {isSigningUp ? "Signing up..." : "Sign up"}
            </button>
            <div className="text-sm text-center">
              <span>Already have an account? </span>
              <Link
                to={"/login"}
                className="text-center text-sm hover:underline font-bold"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};
