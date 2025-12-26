import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Toaster } from "react-hot-toast";
import ProtectedRoutes from "./components/ProtectedRoutes";
import LandingPage from "./pages/LandingPage"; 
import LoginPage from "./pages/LoginPage";
import WishlistPage from "./pages/WishlistPage";
import AdminProtectedRoutes from "./components/AdminProtectedRoutes";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAddProduct from "./pages/admin/AdminAddProduct";
import WishlistInsights from "./pages/admin/WishlistInsights";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/wishlist" element={<WishlistPage />} />
          </Route>
          
          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route element={<AdminProtectedRoutes />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/add-product" element={<AdminAddProduct />} />
            <Route path="/admin/wishlist-insights" element={<WishlistInsights />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster position="top-center" />
    </>
  );
};

export default App;