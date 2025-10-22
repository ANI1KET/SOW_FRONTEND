import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./Pricelist.css";
import { useAuth } from "../AuthContext";
import { useLanguage } from "../LanguageContext";
import { getTexts, getProducts, updateProduct } from "../api";

const Pricelist = () => {
  const [texts, setTexts] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [editedProducts, setEditedProducts] = useState({});

  const { token, logout } = useAuth();
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
        setTexts(textsData);
        setProducts(productsData);
      } catch (err) {
        if (err instanceof Error) {
          console.error("Failed to fetch data:", err.message);
          if (
            err.message.includes("Unauthorized") ||
            err.message.includes("Invalid token")
          ) {
            logout();
            navigate("/login");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language, token, navigate, logout]);

  const handleLanguageChange = (lang) => changeLanguage(lang);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleFieldChange = (productId, field, value) => {
    setEditedProducts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const updatePromises = Object.entries(editedProducts).map(
        ([productId, updates]) => updateProduct(token, productId, updates)
      );
      await Promise.all(updatePromises);

      const updatedProducts = await getProducts(token);
      setProducts(updatedProducts);
      setEditedProducts({});
      alert("Changes saved successfully!");
    } catch (err) {
      console.log(err);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getProductValue = (product, field) => {
    if (
      editedProducts[product.id] &&
      editedProducts[product.id][field] !== undefined
    ) {
      return editedProducts[product.id][field];
    }
    return product[field];
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
        <div className="logo-container">
          <img
            src="https://storage.123fakturera.se/public/icons/diamond.png"
            alt="Logo"
            className="logo"
          />
        </div>

        <div className="header-actions">
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
          <button className="logout-button" onClick={handleLogout}>
            {texts.logout || "Logout"}
          </button>
        </div>
      </header>

      <main className="pricelist-content">
        <h1>{texts.title || "Price List"}</h1>

        <div className="table-wrapper">
          <table className="pricelist-table">
            <thead>
              <tr>
                <th>{texts.header_name || "Product/Service"}</th>
                <th className="hide-mobile">
                  {texts.header_description || "Description"}
                </th>
                <th>{texts.header_in_price || "In Price"}</th>
                <th>{texts.header_price || "Price"}</th>
                <th className="hide-mobile-tablet">
                  {texts.header_unit || "Unit"}
                </th>
                <th className="hide-mobile-tablet">
                  {texts.header_category || "Category"}
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <input
                      type="text"
                      value={getProductValue(product, "name")}
                      onChange={(e) =>
                        handleFieldChange(product.id, "name", e.target.value)
                      }
                    />
                  </td>
                  <td className="hide-mobile">
                    <input
                      type="text"
                      value={getProductValue(product, "description")}
                      onChange={(e) =>
                        handleFieldChange(
                          product.id,
                          "description",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step={0.01}
                      value={getProductValue(product, "in_price")}
                      onChange={(e) =>
                        handleFieldChange(
                          product.id,
                          "in_price",
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step={0.01}
                      value={getProductValue(product, "price")}
                      onChange={(e) =>
                        handleFieldChange(
                          product.id,
                          "price",
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </td>
                  <td className="hide-mobile-tablet">
                    <input
                      type="text"
                      value={getProductValue(product, "unit")}
                      onChange={(e) =>
                        handleFieldChange(product.id, "unit", e.target.value)
                      }
                    />
                  </td>
                  <td className="hide-mobile-tablet">
                    <input
                      type="text"
                      value={getProductValue(product, "category")}
                      onChange={(e) =>
                        handleFieldChange(
                          product.id,
                          "category",
                          e.target.value
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {Object.keys(editedProducts).length > 0 && (
          <div className="save-button-container">
            <button
              className="save-button"
              onClick={handleSaveChanges}
              disabled={saving}
            >
              {saving ? "Saving..." : texts.save_button || "Save Changes"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Pricelist;
