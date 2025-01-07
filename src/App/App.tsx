// App.tsx
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import { useAuth } from "../contexts/authContext/AuthProvider";
import AttendanceReportPage from "../pages/AttendanceReportPage";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import { AuthProvider } from "../contexts/authContext/AuthProvider";
import NotFoundPage from "../pages/NotFoundPage";

// Component to protect authenticated routes
const PrivateRoute = () => {
  const { userLoggedIn } = useAuth();
  const location = useLocation();

  if (!userLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

// Component to protect auth routes (login/signup)
const PublicOnlyRoute = () => {
  const { userLoggedIn } = useAuth();

  if (userLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

// Extract routes into a separate component
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public only routes */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<AttendanceReportPage />} />
        <Route path="/profile" element={<AttendanceReportPage />} />
        <Route path="/attendance/report" element={<AttendanceReportPage />} />
        <Route path="/attendance/submit" element={<AttendanceReportPage />} />
        <Route
          path="/attendance/working-days"
          element={<AttendanceReportPage />}
        />
        <Route path="/attendance/history" element={<AttendanceReportPage />} />
      </Route>

      {/* Not found route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
