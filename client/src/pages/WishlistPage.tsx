import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Autocomplete from "../components/AutoComplete";
import { gshockModels } from "../data/gshockModels";
import { getWishlist, addToWishlist, removeFromWishlist } from "../api/wishlist";
import { SyncLoader } from "react-spinners";
import PageContainer from "../components/ui/PageContainer";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import toast from "react-hot-toast";
import Header from "../components/Header";
import "./admin/ui/wishlist.css";
import { useNavigate } from "react-router";

const WishlistPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedModel, setSelectedModel] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [adding, setAdding] = useState(false);

  // ------------------------------
  // Load wishlist from backend
  // ------------------------------
  useEffect(() => {
    (async () => {
      try {
        const res = await getWishlist();
        setWishlist(res.wishlist || []);
      } catch (err) {
        console.error("Failed to load wishlist:", err);
        toast.error("Unable to load wishlist.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ------------------------------
  // Add item
  // ------------------------------
  const addItem = async () => {
    const target = manualInput.trim() || selectedModel;

    if (!target) {
      toast.error("Please enter a model.");
      return;
    }

    try {
      setAdding(true);
      const res = await addToWishlist(target);
      setWishlist(res.wishlist || []);
      setSelectedModel("");
      setManualInput("");
      toast.success("Model added!");
    } catch (err) {
      console.error(err);
      toast.error("Could not add model.");
    } finally {
      setAdding(false);
    }
  };

  // ------------------------------
  // Remove item
  // ------------------------------
  const removeItem = async (model: string) => {
    try {
      const res = await removeFromWishlist(model);
      setWishlist(res.wishlist || []);
      toast.success("Removed");
    } catch (err) {
      console.error(err);
      toast.error("Unable to remove.");
    }
  };

  // ------------------------------
  // Logout handler
  // ------------------------------
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // ------------------------------
  // Loading UI
  // ------------------------------
  if (loading)
    return (
      <>
        <Header onLogout={handleLogout} />
        <PageContainer>
          <div className="wish-loading">
            <SyncLoader size={14} color="#000" />
          </div>
        </PageContainer>
      </>
    );

  // ------------------------------
  // Render UI
  // ------------------------------
  return (
    <>
      <Header onLogout={handleLogout} />

      <PageContainer>
        <h1 className="wish-title">Welcome, {user?.name}</h1>
        <p className="wish-sub">
          Add models you love — we’ll notify you when they appear.
        </p>

        {/* Autocomplete */}
        <Autocomplete
          options={gshockModels}
          onSelect={(m: string) => {
            setSelectedModel(m);
            setManualInput(m); // populate input for confirmation
          }}
        />

        <Input
          placeholder="Or type model manually"
          value={manualInput}
          onChange={(e) => {
            setManualInput(e.target.value);
            setSelectedModel("");
          }}
          style={{ marginTop: "1rem" }}
        />

        <Button
          style={{ marginTop: "1rem" }}
          disabled={adding}
          onClick={addItem}
        >
          {adding ? "Adding…" : "Add to Wishlist"}
        </Button>

        <h2 className="wish-section">Your Wishlist</h2>

        {wishlist.length === 0 && (
          <p className="wish-empty">You haven't added anything yet.</p>
        )}

        <div className="wish-list">
          {wishlist.map((model) => (
            <Card key={model} className="wish-card">
              <div className="wish-row">
                <span className="wish-model">{model}</span>

                <div className="wish-actions">
                  <Button
                    full={false}
                    variant="outline"
                    onClick={() =>
                      navigate(`/products/search?model=${encodeURIComponent(model)}`)
                    }
                  >
                    View
                  </Button>

                  <Button
                    full={false}
                    variant="danger"
                    onClick={() => removeItem(model)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </PageContainer>
    </>
  );
};

export default WishlistPage;