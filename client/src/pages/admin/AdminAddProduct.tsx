import React, { useState } from "react";
import { adminAddProduct } from "../../api/admin";
import { useNavigate } from "react-router";
import PageContainer from "../../components/ui/PageContainer";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import "./ui/adminAddProduct.css";
import { useAuth } from "../../contexts/AuthContext";

const AdminAddProduct: React.FC = ()  => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [model, setModel] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [condition, setCondition] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [notify, setNotify] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminAddProduct({
        model,
        price: Number(price),
        condition,
        imageUrl,
        notify,
      });

      toast.success("Product added!");

      setModel("");
      setPrice("");
      setCondition("");
      setImageUrl("");
      setNotify(false);

      navigate("/admin/dashboard");
    } catch {
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
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
        <h1 className="admin-add-title">Add New Product</h1>
        <p className="admin-add-sub">Enter product details below.</p>

        <form className="admin-form" onSubmit={submit}>
          <Input
            placeholder="Model (e.g. GA-2100)"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />

          <Input
            type="number"
            placeholder="Price (USD)"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />

          <Input
            placeholder="Condition (New, Used…)"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          />

          <Input
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <label className="notify-row">
            <input
              type="checkbox"
              checked={notify}
              onChange={(e) => setNotify(e.target.checked)}
            />
            Notify wishlist users
          </label>

          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Submit"}
          </Button>
        </form>

        <Button
          variant="outline"
          full={false}
          style={{ marginTop: "2rem" }}
          onClick={() => navigate("/admin/dashboard")}
        >
          Back
        </Button>
      </PageContainer>
    </>
  );
};

export default AdminAddProduct;