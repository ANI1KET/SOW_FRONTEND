import { useState, useEffect } from "react";

import "./Terms.css";
import { getTexts } from "../api";
import { useLanguage } from "../LanguageContext";

const Terms = () => {
  const [texts, setTexts] = useState({});
  const { language, changeLanguage } = useLanguage();

  useEffect(() => {
    const fetchTexts = async () => {
      try {
        const data = await getTexts("terms", language);
        setTexts(data);
      } catch (err) {
        console.error("Failed to fetch texts");
      }
    };
    fetchTexts();
  }, [language]);

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
  };

  return (
    <div className="terms-container">
      <header className="terms-header">
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
      </header>

      <main className="terms-content">
        <h1>{texts.title}</h1>

        <p className="intro">{texts.intro}</p>

        <section className="terms-section">
          <h2>{texts.section1_title}</h2>
          <p>{texts.section1_content}</p>
        </section>

        <section className="terms-section">
          <h2>{texts.section2_title}</h2>
          <p>{texts.section2_content}</p>
        </section>

        <section className="terms-section">
          <h2>{texts.section3_title}</h2>
          <p>{texts.section3_content}</p>
        </section>

        <section className="terms-section">
          <h2>{texts.section4_title}</h2>
          <p>{texts.section4_content}</p>
        </section>

        <div className="back-link">
          <a href="/login">← Back to Login</a>
        </div>
      </main>
      {/* <main className="terms-content">
        <h1>{texts.title || "Terms and Conditions"}</h1>

        <p className="intro">
          {texts.intro ||
            "Welcome to 123 Fakturera. By using our service, you agree to these terms."}
        </p>

        <section className="terms-section">
          <h2>{texts.section1_title || "1. Service Description"}</h2>
          <p>
            {texts.section1_content ||
              "Our service provides invoicing and accounting solutions for small and medium businesses."}
          </p>
        </section>

        <section className="terms-section">
          <h2>{texts.section2_title || "2. User Responsibilities"}</h2>
          <p>
            {texts.section2_content ||
              "Users are responsible for maintaining the confidentiality of their account credentials."}
          </p>
        </section>

        <section className="terms-section">
          <h2>{texts.section3_title || "3. Payment Terms"}</h2>
          <p>
            {texts.section3_content ||
              "Payment for services is due according to the selected subscription plan."}
          </p>
        </section>

        <section className="terms-section">
          <h2>{texts.section4_title || "4. Privacy Policy"}</h2>
          <p>
            {texts.section4_content ||
              "We respect your privacy and protect your data according to GDPR regulations."}
          </p>
        </section>

        <div className="back-link">
          <a href="/login">← Back to Login</a>
        </div>
      </main> */}
    </div>
  );
};

export default Terms;
