import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import StatsPage from "./pages/StatsPage";
import Navbar from "./components/Navbar";
import { POSProvider } from "./context/POSContext";
import AIChatWidget from "./components/AIChatWidget";

export default function AppPOS() {
  return (
    <POSProvider>
      <BrowserRouter>
        {/* FULL APP SHELL */}
        <div className="h-screen flex flex-col bg-stone-100 text-stone-900">
          {/* TOP BAR */}
          <Navbar />

          {/* MAIN CONTENT (everything under navbar) */}
          <div className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<Navigate to="/products" replace />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/statistics" element={<StatsPage />} />
            </Routes>
          </div>

          {/* FLOATING ASSISTANT */}
          <AIChatWidget />
        </div>
      </BrowserRouter>
    </POSProvider>
  );
}
