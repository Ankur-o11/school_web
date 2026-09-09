import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../Style/login.css";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password.trim()) {
      setError("Please enter both email/username and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      await login(identifier, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to log in. Please check credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background-decor"></div>

      {/* PUBLIC ACCESS BANNER FOR ONLINE ADMISSION */}
      <div className="login-top-banner">
        <div className="login-top-info">
          <span className="banner-badge">NEW SESSION 2026-2027</span>
          <span className="banner-text">Online Admissions are open for new students!</span>
        </div>
        <button
          type="button"
          className="login-top-cta"
          onClick={() => navigate("/online-admission")}
        >
          🎓 Online Admission →
        </button>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">M</div>
          <h1>MPSA School ERP</h1>
          <p>Maharana Pratap Science Academy Inter College</p>
        </div>

        {error && (
          <div className="login-error-alert">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email or Username</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                className="form-input"
                placeholder="Enter email or username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                className="form-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In to ERP"}
          </button>
        </form>

        {/* ONLINE ADMISSION PUBLIC OPTION FOR PARENTS */}
        <div className="login-online-admission-box">
          <p className="online-adm-label">New Student / Parent Registration?</p>
          <button
            type="button"
            className="login-online-btn"
            onClick={() => navigate("/online-admission")}
          >
            <span>🎓</span>
            <span>Apply for Admission Online</span>
          </button>
          <small className="online-adm-sub">
            Parents do NOT need to log in to apply for admission.
          </small>
        </div>

        <div className="login-footer">
          <p>© 2026 MPSA School Management System. Secure Access.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
