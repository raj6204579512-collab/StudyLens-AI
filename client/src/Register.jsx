
import { useState } from "react";
import "./Register.css";

function Register({ onLoginClick, onRegisterSuccess }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    examPreference: "JEE",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setMessage("Account created successfully! You can now log in.");

      if (onRegisterSuccess) onRegisterSuccess();
    } catch (error) {
      setMessage(
        error.message === "Failed to fetch"
          ? "Backend is not reachable. Please check that the server is running."
          : error.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="register-page">
      <section className="register-card">
        <div className="register-logo">✦</div>
        <h1>Join StudyLens AI</h1>
        <p className="register-subtitle">
          Create your account and start learning smarter.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 8 characters"
            minLength={8}
            required
          />

          <label htmlFor="examPreference">Prepare for</label>
          <select
            id="examPreference"
            name="examPreference"
            value={form.examPreference}
            onChange={handleChange}
          >
            <option value="JEE">JEE</option>
            <option value="NEET">NEET</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {message && (
          <p className="register-message" role="status">{message}</p>
        )}

        <p className="login-prompt">
          Already have an account?{" "}
          <button type="button" className="login-link" onClick={onLoginClick}>
            Login
          </button>
        </p>
      </section>
    </main>
  );
}

export default Register;
