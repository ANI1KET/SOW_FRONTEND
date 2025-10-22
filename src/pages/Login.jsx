import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import "./Login.css";
import { useAuth } from "../AuthContext";
import { login, getTexts } from "../api";
import { useLanguage } from "../LanguageContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [texts, setTexts] = useState({});
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { loginUser } = useAuth();
  const { language, changeLanguage } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTexts = async () => {
      try {
        const data = await getTexts("login", language);
        setTexts(
          data.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
          }, {})
        );
      } catch (err) {
        console.error("Failed to fetch texts:", err);
      }
    };
    fetchTexts();
  }, [language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);
      loginUser(data.token, data.user);
      navigate("/pricelist");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>

      <header className="login-header">
        <div className="logo-container">
          <img
            src="https://storage.123fakturera.se/public/icons/diamond.png"
            alt="Logo"
            className="logo"
          />
        </div>

        <div className="language-flags">
          <img
            src="https://storage.123fakturere.no/public/flags/GB.png"
            alt="English"
            className={`flag ${language === "en" ? "active" : ""}`}
            onClick={() => handleLanguageChange("en")}
          />
          <img
            src="https://storage.123fakturere.no/public/flags/SE.png"
            alt="Swedish"
            className={`flag ${language === "sv" ? "active" : ""}`}
            onClick={() => handleLanguageChange("sv")}
          />
        </div>

        <button
          className="hamburger"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      {menuOpen && (
        <nav className="mobile-menu">
          <a href="/login" onClick={() => setMenuOpen(false)}>
            {texts.menu_login || "Login"}
          </a>
          <a href="/terms" onClick={() => setMenuOpen(false)}>
            {texts.menu_terms || "Terms"}
          </a>
        </nav>
      )}

      <div className="login-content">
        <div className="login-box">
          <h1>{texts.title || "Welcome to 123 Fakturera"}</h1>
          <p className="subtitle">
            {texts.subtitle || "Please log in to continue"}
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{texts.email || "Email"}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>{texts.password || "Password"}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "..." : texts.login_button || "Log In"}
            </button>

            <a href="#" className="forgot-password">
              {texts.forgot_password || "Forgot password?"}
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
