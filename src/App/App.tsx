import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AttendanceReportPage from "../pages/AttendanceReportPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AttendanceReportPage />} />
        <Route path="/login" element={<AttendanceReportPage />} />
        <Route path="/profile" element={<AttendanceReportPage />} />
        <Route path="/attendance/report" element={<AttendanceReportPage />} />
        <Route path="/attendance/submit" element={<AttendanceReportPage />} />
        <Route
          path="/attendance/working-days"
          element={<AttendanceReportPage />}
        />
        <Route path="/attendance/history" element={<AttendanceReportPage />} />
      </Routes>
    </Router>
  );
}

export default App;
