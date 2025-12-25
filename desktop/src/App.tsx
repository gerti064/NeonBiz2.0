import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import StatsPage from "./pages/StatsPage";
import Navbar from "./components/Navbar";
import { POSProvider } from "./context/POSContext";
import AIChatWidget from "./components/AIChatWidget";

export default function App() {
  return (
    <POSProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
          <Navbar />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="/products" replace />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/statistics" element={<StatsPage />} />
            </Routes>
          </main>

          <AIChatWidget />
        </div>
      </BrowserRouter>
    </POSProvider>
  );
}
