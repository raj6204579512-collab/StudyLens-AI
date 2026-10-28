import { useState } from "react";
import "./App.css";
import Register from "./Register";
import StudentDashboard from "./StudentDashboard";

function App() {
  const [page, setPage] = useState(
    localStorage.getItem("studylens_token") ? "dashboard" : "register"
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      if (data.token) {
        localStorage.setItem("studylens_token", data.token);
      }
      if (data.user) {
        localStorage.setItem("studylens_user", JSON.stringify(data.user));
      }

      setMessage("Login successful! Welcome to StudyLens AI.");

      // give the person a beat to see the success message, then go to the dashboard
      setTimeout(() => {
        setPage("dashboard");
      }, 600);
    } catch (error) {
      setMessage(
        error.message === "Failed to fetch"
          ? "Backend is not reachable. Please start the server."
          : error.message
      );
    } finally {
      setLoading(false);
    }
  }

  if (page === "dashboard") {
    return (
      <StudentDashboard
        onLogout={() => {
          localStorage.removeItem("studylens_token");
          localStorage.removeItem("studylens_user");
          setMessage("");
          setPage("login");
        }}
      />
    );
  }

  if (page === "register") {
    return (
      <Register
        onLoginClick={() => {
          setMessage("");
          setPage("login");
        }}
        onRegisterSuccess={() => {
          setMessage("Account created successfully! Please log in.");
          setPage("login");
        }}
      />
    );
  }

  return (
    <main className="register-page">
      <section className="register-card">
        <div className="register-logo">✦</div>

        <h1>Welcome Back!</h1>
        <p className="register-subtitle">
          Log in to continue learning with StudyLens AI.
        </p>

        <form onSubmit={handleLogin}>
          <label htmlFor="login-email">Email Address</label>
          <input
            id="login-email"
            type="email"
            value={loginForm.email}
            onChange={(e) =>
              setLoginForm({ ...loginForm, email: e.target.value })
            }
            placeholder="Enter your email"
            autoComplete="email"
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && (
          <p className="register-message" role="status">
            {message}
          </p>
        )}

        <p className="login-prompt">
          Don't have an account?{" "}
          <button
            type="button"
            className="login-link"
            onClick={() => {
              setMessage("");
              setPage("register");
            }}
          >
            Register
          </button>
        </p>
      </section>
    </main>
  );
}

export default App;