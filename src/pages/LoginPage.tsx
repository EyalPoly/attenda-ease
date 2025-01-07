import { LoginForm } from "../components/auth/LoginForm";
import Header from "../components/Header";

export default function LoginPage() {
  return (
    <div>
      <Header />
      <div style={{ marginTop: "150px" }}>
        <LoginForm />
      </div>
    </div>
  );
}
