import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import StatsPage from "./pages/StatsPage";
import { POSProvider } from "./context/POSContext";
import AIChatWidget from "./components/AIChatWidget";

export default function POSApp() {
  return (
    <POSProvider>
      <BrowserRouter>
        <div className="posShell">
          <Navbar />

          <div className="posContent">
            <Routes>
              <Route path="/" element={<Navigate to="/products" replace />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/statistics" element={<StatsPage />} />
            </Routes>
          </div>

          {/* ✅ Appears on every screen */}
          <AIChatWidget />
        </div>
      </BrowserRouter>
    </POSProvider>
  );
}
