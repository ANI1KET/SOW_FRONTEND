import {
  Route,
  Routes,
  Navigate,
  BrowserRouter as Router,
} from "react-router-dom";

import "./App.css";
import Login from "./pages/Login";
import Terms from "./pages/Terms";
import Pricelist from "./pages/Pricelist";
import PublicRoute from "./PublicRoute";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import { LanguageProvider } from "./LanguageContext";

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route path="/terms" element={<Terms />} />

            <Route
              path="/pricelist"
              element={
                <ProtectedRoute>
                  <Pricelist />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/pricelist" replace />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
