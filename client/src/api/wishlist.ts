import api from "../lib/api";

// Get wishlist for logged-in user
export const getWishlist = async () => {
    try {
        const res = await api.get("/api/wishlist", { withCredentials: true });
        return res.data;
    } catch (e: any) {
        console.error("getWishlist error:", e);
        return { ok: false, message: "Network error" };
    }
}

// Add model
export const addToWishlist = async (model: string) => {
    try {
        const res = await api.post("/api/wishlist", { model }, { withCredentials: true });
        return res.data;
    } catch (e: any) {
        console.error("addToWishlist error:", e);
        return { ok: false, message: "Network error" };
    }
}

// Remove model
export const removeFromWishlist = async (model: string) => {
    try {
        const encoded = window.encodeURIComponent(model);
        const res = await api.delete(`/api/wishlist/${encoded}`,
            { withCredentials: true }
        );
        return res.data;
    } catch (e: any) {
        console.error("removeFromWishlist error:", e);
        return { ok: false, message: "Network error" };
    }
}