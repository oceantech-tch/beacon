// import axios from "axios";
import api from "../lib/api";

export interface GoogleAuthResponse {
    ok: boolean;
    token: string;
    user: {
        _id: string;
        email: string;
        name: string;
        picture?: string;
        wishlist: string[];
    };
}

const googleLogin = async (credential: string): Promise<GoogleAuthResponse> => {
    if (!credential) {
        throw new Error("googleLogin: credential is required");
    }
    const res = await api.post("/api/auth/google", { credential });
    return res.data;
};

//  Admin login
export interface AdminLoginResponse {
    ok: boolean;
    token?: string;
}

export default googleLogin;