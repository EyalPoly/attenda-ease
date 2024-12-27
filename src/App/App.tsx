import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AttendanceReportPage from "../pages/AttendanceReportPage";
import { SignupForm } from "../components/auth/singup";
import { AuthProvider } from "../contexts/authContext/AuthProvider";
import NotFoundPage from "../pages/NotFoundPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<AttendanceReportPage />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/profile" element={<AttendanceReportPage />} />
          <Route path="/attendance/report" element={<AttendanceReportPage />} />
          <Route path="/attendance/submit" element={<AttendanceReportPage />} />
          <Route
            path="/attendance/working-days"
            element={<AttendanceReportPage />}
          />
          <Route
            path="/attendance/history"
            element={<AttendanceReportPage />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
