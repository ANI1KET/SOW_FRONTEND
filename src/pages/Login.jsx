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

        <nav className="nav-menu">
          <a href="/">{texts.menu_home || "Home"}</a>
          <a href="/order">{texts.menu_order || "Order"}</a>
          <a href="/customers">{texts.menu_customers || "Our Customers"}</a>
          <a href="/about">{texts.menu_about || "About us"}</a>
          <a href="/contact">{texts.menu_contact || "Contact Us"}</a>
        </nav>

        <div className="language-dropdown">
          <button
            className="language-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span>{language === "sv" ? "Svenska" : "English"}</span>
            <img
              src={
                language === "sv"
                  ? "https://storage.123fakturere.no/public/flags/SE.png"
                  : "https://storage.123fakturere.no/public/flags/GB.png"
              }
              alt="Flag"
              className="flag-icon"
            />
          </button>
          {menuOpen && (
            <div className="language-menu">
              <button
                onClick={() => {
                  handleLanguageChange("sv");
                  setMenuOpen(false);
                }}
              >
                <span>Svenska</span>
                <img
                  src="https://storage.123fakturere.no/public/flags/SE.png"
                  alt="Swedish"
                  className="flag-icon"
                />
              </button>
              <button
                onClick={() => {
                  handleLanguageChange("en");
                  setMenuOpen(false);
                }}
              >
                <span>English</span>
                <img
                  src="https://storage.123fakturere.no/public/flags/GB.png"
                  alt="English"
                  className="flag-icon"
                />
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="login-content">
        <div className="login-box">
          <h1>{texts.title || "Log in"}</h1>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{texts.email_label || "Enter your email address"}</label>
              <input
                type="email"
                placeholder={texts.email_placeholder || "Email address"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>{texts.password_label || "Enter your password"}</label>
              <input
                type="password"
                placeholder={texts.password_placeholder || "Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "..." : texts.login_button || "Log in"}
            </button>

            <div className="login-links">
              <a href="#" className="register-link">
                {texts.register || "Register"}
              </a>
              <a href="#" className="forgot-password">
                {texts.forgot_password || "Forgotten password?"}
              </a>
            </div>
          </form>
        </div>
      </div>

      <footer className="login-footer">
        <div className="footer-content">
          <div className="footer-brand">123 Fakturera</div>
          <div className="footer-links">
            <a href="/">{texts.footer_home || "Home"}</a>
            <a href="/order">{texts.footer_order || "Order"}</a>
            <a href="/contact">{texts.footer_contact || "Contact us"}</a>
          </div>
          <div className="footer-copyright">
            {texts.footer_copyright ||
              "© Lättfaktura, CRO no. 638537, 2025. All rights reserved."}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
