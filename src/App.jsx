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
import { AuthProvider } from "./AuthContext";
import { LanguageProvider } from "./LanguageContext";

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/pricelist" element={<Pricelist />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
