import api from "../lib/api";

export interface ProductPayload {
    model: string;
    price: number;
    condition: string;
    imageUrl?: string;
    notify?: boolean;
}

// Add product
export const adminAddProduct = async (payload: ProductPayload) => {
    const res = await api.post("/api/admin/products", payload);
    return res.data;
};

export const adminLoginRequest = async (username: string, password: string) => {
    try {
        const res = await api.post("/api/admin/login", { username, password });
        return res.data // as AdminLoginResponse;   - commented out
    } catch (e: any) {
        const message = e?.response?.data?.message || e?.message || "Login failed - server unreachable";

        throw new Error(message);
    }
};

// getch aggregated wishlist counts for admin dashboard
export const getWishlistSummary = async () => {
    try {
        const res = await api.get("/api/admin/wishlist-summary");
        return res.data;
    } catch (e: any) {
        console.error("getWishlistSummary error:", e);
        throw e;
    }
};

// fetch users who have specific model in their wishlist
export const getWishlistUsers = async (model: string) => {
    try {
        const encoded = encodeURIComponent(model);
        const res = await api.get(`/api/admin/wishlist-users/${encoded}`);
        return res.data;
    } catch (e: any) {
        console.error("getWishlistUsers error:", e);
        throw e;
    }
};
























/*


 */