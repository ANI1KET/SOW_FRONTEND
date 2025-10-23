import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./Pricelist.css";
import { useAuth } from "../AuthContext";
import { getTexts, getProducts, updateProduct } from "../api";
import { useLanguage } from "../LanguageContext";

const Pricelist = () => {
  const [texts, setTexts] = useState({});
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchArticle, setSearchArticle] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { token, logout, user } = useAuth();
  const { language, changeLanguage } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [textsData, productsData] = await Promise.all([
          getTexts("pricelist", language),
          getProducts(token),
        ]);
        setTexts(
          textsData.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
          }, {})
        );
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        if (
          err.message.includes("Unauthorized") ||
          err.message.includes("Invalid token")
        ) {
          logout();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language, token, navigate, logout]);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesArticle = product.id
        .toLowerCase()
        .includes(searchArticle.toLowerCase());
      const matchesProduct = product.name
        .toLowerCase()
        .includes(searchProduct.toLowerCase());
      return matchesArticle && matchesProduct;
    });
    setFilteredProducts(filtered);
  }, [searchArticle, searchProduct, products]);

  const handleFieldUpdate = async (productId, fieldName, newValue, e) => {
    const trimmedValue = newValue?.toString().trim();

    const numericFields = ["price", "in_price", "unit", "in_stock"];

    const oldProduct = products.find((p) => p.id === productId);
    if (!oldProduct) return;

    if (!trimmedValue) {
      console.log(`⚠️ Skipped update: empty value for ${fieldName}`);
      if (e) e.target.value = oldProduct[fieldName];
      return;
    }

    if (numericFields.includes(fieldName) && isNaN(Number(newValue))) {
      console.log(`⚠️ Skipped update: ${fieldName} must be a number`);
      if (e) e.target.value = oldProduct[fieldName];
      return;
    }

    if (oldProduct[fieldName]?.toString() === trimmedValue) {
      console.log(`⚠️ Skipped update: no change in ${fieldName}`);
      return;
    }

    console.log(`Updating product ${productId}: {${fieldName}: ${newValue}}`);
    try {
      await updateProduct(token, productId, { [fieldName]: newValue });
      console.log(`✅ Updated ${fieldName} for ${productId}`);

      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === productId ? { ...p, [fieldName]: newValue } : p
        )
      );
    } catch (error) {
      console.error("❌ Update failed:", error);
      if (e) e.target.value = oldProduct[fieldName];
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
  };

  if (loading) {
    return (
      <div className="pricelist-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="pricelist-container">
      <header className="pricelist-header">
        <button
          className="hamburger-menu"
          onClick={() => setHamburgerOpen(!hamburgerOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="language-drop">
          <div className="sidebar">
            <div className="user-info">
              <div className="user-avatar"></div>
              <div className="user-details">
                <div className="user-name">{user?.email || "User"}</div>
                <div className="user-company">Company AS</div>
              </div>
            </div>
          </div>

          <button className="language" onClick={() => setMenuOpen(!menuOpen)}>
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

      {hamburgerOpen && (
        <div className="mobile-sidebar">
          <div className="sidebar-header">
            <div className="user-info">
              <div className="user-avatar"></div>
              <div className="user-details">
                <div className="user-name">{user?.email || "User"}</div>
                <div className="user-company">Company AS</div>
              </div>
            </div>
            <button
              className="close-sidebar"
              onClick={() => setHamburgerOpen(false)}
            >
              ✕
            </button>
          </div>

          <nav className="mobile-nav">
            <a href="/invoices">Invoices</a>
            <a href="/customers">Customers</a>
            <a href="/business">My Business</a>
            <a href="/journal">Invoice Journal</a>
            <a href="/pricelist" className="active">
              Price List
            </a>
            <a href="/multiple">Multiple Invoicing</a>
            <a href="/unpaid">Unpaid Invoices</a>
            <a href="/offer">Offer</a>
            <a href="/inventory">Inventory Control</a>
            <a href="/member">Member Invoicing</a>
            <a href="/import">Import/Export</a>
            <a href="/" onClick={handleLogout}>
              Log out
            </a>
          </nav>
        </div>
      )}

      <div className="pricelist-wrapper">
        <aside className="desktop-sidebar">
          <nav className="mobile-nav">
            <a href="/invoices">Invoices</a>
            <a href="/customers">Customers</a>
            <a href="/business">My Business</a>
            <a href="/journal">Invoice Journal</a>
            <a href="/pricelist" className="active">
              Price List
            </a>
            <a href="/multiple">Multiple Invoicing</a>
            <a href="/unpaid">Unpaid Invoices</a>
            <a href="/offer">Offer</a>
            <a href="/inventory">Inventory Control</a>
            <a href="/member">Member Invoicing</a>
            <a href="/import">Import/Export</a>
            <a href="/" onClick={handleLogout}>
              Log out
            </a>
          </nav>
        </aside>

        <main className="pricelist-content">
          <div className="search-section">
            <div className="search-box">
              <input
                type="text"
                placeholder={texts.search_article || "Search Article No ..."}
                value={searchArticle}
                onChange={(e) => setSearchArticle(e.target.value)}
              />
              <button className="search-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    stroke="#00d4ff"
                    strokeWidth="2"
                  />
                  <path
                    d="M16 16L20 20"
                    stroke="#00d4ff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="search-box">
              <input
                type="text"
                placeholder={texts.search_product || "Search Product ..."}
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
              />
              <button className="search-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    stroke="#00d4ff"
                    strokeWidth="2"
                  />
                  <path
                    d="M16 16L20 20"
                    stroke="#00d4ff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="action-buttons">
            <button className="action-btn add-btn">
              <span className="btn-icon">+</span>
            </button>
            <button className="action-btn print-btn">
              <span className="btn-icon">🖨</span>
            </button>
            <button className="action-btn settings-btn">
              <span className="btn-icon">⚙</span>
            </button>
          </div>

          <div className="products-list">
            <div className="products-header desktop-header">
              <div className="header-col">
                {texts.header_article || "Article No."}
              </div>
              <div className="header-col">
                {texts.header_product || "Product/Service"}
              </div>
              <div className="header-col">
                {texts.header_in_price || "In Price"}
              </div>
              <div className="header-col">{texts.header_price || "Price"}</div>
              <div className="header-col">{texts.header_unit || "Unit"}</div>
              <div className="header-col">
                {texts.header_in_stock || "In Stock"}
              </div>
              <div className="header-col">
                {texts.header_description || "Description"}
              </div>
            </div>

            <div className="products-body">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-row">
                  <div className="product-cell desktop-cell">
                    <input
                      type="text"
                      value={product.id.substring(0, 10)}
                      readOnly
                      className="product-input"
                    />
                  </div>

                  <div className="product-cell desktop-cell">
                    <input
                      type="text"
                      defaultValue={product.name}
                      className="product-input"
                      onBlur={(e) =>
                        handleFieldUpdate(product.id, "name", e.target.value, e)
                      }
                    />
                  </div>

                  <div className="product-cell desktop-cell">
                    <input
                      type="text"
                      defaultValue={product.in_price}
                      className="product-input"
                      onBlur={(e) =>
                        handleFieldUpdate(
                          product.id,
                          "in_price",
                          e.target.value,
                          e
                        )
                      }
                    />
                  </div>

                  <div className="product-cell desktop-cell">
                    <input
                      type="text"
                      defaultValue={product.price}
                      className="product-input"
                      onBlur={(e) =>
                        handleFieldUpdate(
                          product.id,
                          "price",
                          e.target.value,
                          e
                        )
                      }
                    />
                  </div>

                  <div className="product-cell desktop-cell">
                    <input
                      type="text"
                      defaultValue={product.unit}
                      className="product-input"
                      onBlur={(e) =>
                        handleFieldUpdate(product.id, "unit", e.target.value, e)
                      }
                    />
                  </div>

                  <div className="product-cell desktop-cell">
                    <input
                      type="text"
                      defaultValue={product.in_stock}
                      className="product-input"
                      onBlur={(e) =>
                        handleFieldUpdate(
                          product.id,
                          "in_stock",
                          e.target.value,
                          e
                        )
                      }
                    />
                  </div>

                  <div className="product-cell desktop-cell description-cell">
                    <input
                      type="text"
                      defaultValue={product.description}
                      className="product-input"
                      onBlur={(e) =>
                        handleFieldUpdate(
                          product.id,
                          "description",
                          e.target.value,
                          e
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Pricelist;
