import { useState, useEffect } from "react";

import "./Terms.css";
import { getTexts } from "../api";
import { useLanguage } from "../LanguageContext";

const Terms = () => {
  const [texts, setTexts] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, changeLanguage } = useLanguage();

  useEffect(() => {
    const fetchTexts = async () => {
      try {
        const data = await getTexts("terms", language);
        setTexts(
          data.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
          }, {})
        );
      } catch (err) {
        console.error("Failed to fetch texts", err);
      }
    };
    fetchTexts();
  }, [language]);

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
  };

  return (
    <div className="terms-container">
      <div className="login-background"></div>

      <header className="login-header">
        <div className="logo-container">
          <img
            src="https://storage.123fakturera.se/public/icons/diamond.png"
            alt="Logo"
            className="logo"
          />
        </div>

        <div className="terms-flex">
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
        </div>
      </header>

      <div className="terms-page">
        <h1 className="terms-title">{texts.title}</h1>
        <button className="back-btn top-btn">Close and Go Back</button>

        <div className="terms-box-plain">
          <p>
            {texts.intro} {texts.section1_title} {texts.section1_content}{" "}
            {texts.section2_title} {texts.section2_content}{" "}
            {texts.section3_title} {texts.section3_content}{" "}
            {texts.section4_title} {texts.section4_content}
          </p>
        </div>

        <button className="back-btn bottom-btn">Close and Go Back</button>
      </div>
    </div>
  );
};

export default Terms;
