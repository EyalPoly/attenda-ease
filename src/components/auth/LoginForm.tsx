import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/authContext/AuthProvider";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { userLoggedIn, loginEmailAndPassword, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggingIn) {
      setIsLoggingIn(true);
      try {
        await loginEmailAndPassword(email, password);
        navigate("/attendance/report");
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoggingIn(false);
      }
    }
  };

  const onGoogleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggingIn) {
      setIsLoggingIn(true);
      try {
        await loginWithGoogle();
        navigate("/attendance/report");
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoggingIn(false);
      }
    }
  };

  useEffect(() => {
    if (userLoggedIn) {
      navigate("/attendance/report");
    }
  }, [userLoggedIn, navigate]);

  return (
    <div>
      <main className="w-full h-auto flex justify-center items-start mt-5">
        <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
          <div className="text-center">
            <div className="mt-2">
              <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">
                !ברוכים הבאים
              </h3>
              <h4 className="text-gray-500 text-sm">אנא התחברו למערכת</h4>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-gray-600 font-bold text-right"
              >
                דואר אלקטרוני
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm text-gray-600 font-bold text-right"
              >
                סיסמה
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
              />
            </div>

            {error && <span className="block text-red-600 font-bold text-right">{error}</span>}

            <button
              type="submit"
              disabled={isLoggingIn}
              data-testid="email-login-button"
              className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                isLoggingIn
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300"
              }`}
            >
              {isLoggingIn ? "מתחבר..." : "התחברות"}
            </button>
          </form>
          <p className="text-center text-sm">
            אין לך חשבון?{" "}
            <Link to={"/signup"} className="hover:underline font-bold">
              ליצירת חשבון חדש
            </Link>
          </p>
          <button
            disabled={isLoggingIn}
            data-testid="google-login-button"
            onClick={(e) => {
              onGoogleLogin(e);
            }}
            className={`w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg text-sm font-medium  ${
              isLoggingIn
                ? "cursor-not-allowed"
                : "hover:bg-gray-100 transition duration-300 active:bg-gray-100"
            }`}
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_17_40)">
                <path
                  d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
                  fill="#4285F4"
                />
                <path
                  d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z"
                  fill="#34A853"
                />
                <path
                  d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z"
                  fill="#FBBC04"
                />
                <path
                  d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
                  fill="#EA4335"
                />
              </g>
              <defs>
                <clipPath id="clip0_17_40">
                  <rect width="48" height="48" fill="white" />
                </clipPath>
              </defs>
            </svg>
            {isLoggingIn ? "מתחבר..." : "להתחברות עם גוגל"}
          </button>
        </div>
      </main>
    </div>
  );
};
