// src/pages/admin/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import PageContainer from "../../components/ui/PageContainer";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { SyncLoader } from "react-spinners";
import api from "../../lib/api";
import "./ui/adminDashboard.css";

interface ProductRow {
  _id: string;
  model: string;
  price: number;
  condition: string;
  imageUrl?: string;
  notified?: boolean;
  disabled?: boolean;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { adminName, logout, loading } = useAuth();

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [products, setProducts] = useState<ProductRow[]>([]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await api.get("/api/admin/products");
      setProducts(res.data.products || []);
    } catch (e) {
      console.error("Failed to load products:", e);
    } finally {
      setLoadingProducts(false);
    }
  };

  const disableProduct = async (id: string) => {
    try {
      await api.patch(`/api/admin/product/${id}/disable`);
      await loadProducts();
    } catch (e) {
      console.error("Disable failed:", e);
    }
  };

  // Wait for auth restore before loading products
  useEffect(() => {
    if (loading) return; // do not run while restoring
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <>
      <div className="admin-header">
        <span className="admin-logo">G-Shock Admin</span>
        <button
          className="admin-logout"
          onClick={() => {
            logout();
            navigate("/admin/login", { replace: true });
          }}
        >
          Logout
        </button>
      </div>

      <PageContainer>
        <h1 className="admin-title">
          Welcome, <span>{adminName ?? "Admin"}</span>
        </h1>

        <div className="admin-actions">
          <Button onClick={() => navigate("/admin/add-product")}>
            List Product
          </Button>

          <Button
            full={false}
            variant="outline"
            onClick={() => navigate("/admin/wishlist-insights")}
          >
            Wishlist Insights
          </Button>
        </div>

        <h2 className="admin-section">Uploaded Products</h2>

        {loadingProducts ? (
          <div className="admin-loading">
            <SyncLoader size={12} color="#000" />
          </div>
        ) : (
          <div className="admin-product-list">
            {products.map((p) => (
              <Card
                key={p._id}
                className={`admin-product-card ${
                  p.disabled ? "admin-product-disabled" : ""
                }`}
              >
                <div className="admin-product-row">
                  <div className="admin-product-info">
                    <strong>{p.model}</strong>
                    <div className="admin-product-meta">
                      <span>${p.price}</span>
                      <span>{p.condition}</span>

                      {p.notified && (
                        <span className="admin-tag-success">Notified ✔</span>
                      )}

                      {p.disabled && (
                        <span className="admin-tag-disabled">Disabled</span>
                      )}
                    </div>
                  </div>

                  {!p.disabled && (
                    <Button
                      full={false}
                      variant="danger"
                      onClick={() => disableProduct(p._id)}
                    >
                      Disable
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </PageContainer>
    </>
  );
};

export default AdminDashboard;






















// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router";
// import { useAuth } from "../../contexts/AuthContext";
// import PageContainer from "../../components/ui/PageContainer";
// import Button from "../../components/ui/Button";
// import Card from "../../components/ui/Card";
// import { SyncLoader } from "react-spinners";
// import api from "../../lib/api";
// import "./ui/adminDashboard.css";

// interface ProductRow {
//   _id: string;
//   model: string;
//   price: number;
//   condition: string;
//   imageUrl?: string;
//   notified: boolean;
//   disabled: boolean;
// }

// const AdminDashboard: React.FC = () => {
//   const navigate = useNavigate();
//   const { adminName, logout } = useAuth();

//   const [loading, setLoading] = useState(true);
//   const [products, setProducts] = useState<ProductRow[]>([]);

//   const loadProducts = async () => {
//     try {
//       const res = await api.get("/api/admin/products");
//       setProducts(res.data.products || []);
//     } catch (e) {
//       console.error("Failed to load products:", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const disableProduct = async (id: string) => {
//     try {
//       await api.patch(`/api/admin/product/${id}/disable`);
//       loadProducts();
//     } catch (e) {
//       console.error("Disable failed:", e);
//     }
//   };

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   return (
//     <>
//       <div className="admin-header">
//         <span className="admin-logo">G-Shock Admin</span>
//         <button
//           className="admin-logout"
//           onClick={() => {
//             logout();
//             navigate("/admin/login", { replace: true });
//           }}
//         >
//           Logout
//         </button>
//       </div>

//       <PageContainer>
//         <h1 className="admin-title">
//           Welcome, <span>{adminName ?? "Admin"}</span>
//         </h1>

//         <div className="admin-actions">
//           <Button onClick={() => navigate("/admin/add-product")}>
//             List Product
//           </Button>

//           <Button
//             full={false}
//             variant="outline"
//             onClick={() => navigate("/admin/wishlist-insights")}
//           >
//             Wishlist Insights
//           </Button>
//         </div>

//         <h2 className="admin-section">Uploaded Products</h2>

//         {loading ? (
//           <div className="admin-loading">
//             <SyncLoader size={12} color="#000" />
//           </div>
//         ) : (
//           <div className="admin-product-list">
//             {products.map((p) => (
//               <Card
//                 key={p._id}
//                 className={`admin-product-card ${
//                   p.disabled ? "admin-product-disabled" : ""
//                 }`}
//               >
//                 <div className="admin-product-row">
//                   <div className="admin-product-info">
//                     <strong>{p.model}</strong>
//                     <div className="admin-product-meta">
//                       <span>${p.price}</span>
//                       <span>{p.condition}</span>

//                       {p.notified && (
//                         <span className="admin-tag-success">Notified ✔</span>
//                       )}

//                       {p.disabled && (
//                         <span className="admin-tag-disabled">Disabled</span>
//                       )}
//                     </div>
//                   </div>

//                   {!p.disabled && (
//                     <Button
//                       full={false}
//                       variant="danger"
//                       onClick={() => disableProduct(p._id)}
//                     >
//                       Disable
//                     </Button>
//                   )}
//                 </div>
//               </Card>
//             ))}
//           </div>
//         )}
//       </PageContainer>
//     </>
//   );
// };

// export default AdminDashboard;