import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>404 - Page Not Found</h1>
      <p style={styles.text}>אופס! הדף שחיפשת אינו קיים</p>
      <Link to="/attendance/report" style={styles.link}>
        בחזרה לעמוד הראשי
      </Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center" as const,
    padding: "50px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    fontSize: "36px",
    marginBottom: "20px",
  },
  text: {
    fontSize: "18px",
    marginBottom: "30px",
  },
  link: {
    fontSize: "16px",
    color: "#007bff",
    textDecoration: "none",
  },
};

export default NotFoundPage;
