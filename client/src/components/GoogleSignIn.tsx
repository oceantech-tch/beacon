import React, { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import googleLogin from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "./fontIcons/Spinner";

// Define interface
interface GoogleUser {
    email: string;
    name: string;
    picture?: string;
}

const GoogleSignIn: React.FC = ()=> {
    const auth = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Run when login is successfull 
    const handleSuccess = async (credentialResponse: CredentialResponse | null)=> {
        if (!credentialResponse?.credential) {
            toast.error("Google returned no credential.");
            return;
        };
        
        const credential: string = credentialResponse.credential;
        setLoading(true);

        try {
            // Decode
            const decoded = jwtDecode<GoogleUser>(credential);
            console.log("Google sign-in success:", decoded);

            const res = await googleLogin(credential);
            if (!res.ok || !res.token) {
                console.error("Backend auth failed", res);
                toast.error("Login failed on server. Check console.");
                return;
            } 
            
            auth.login(res.token, res.user);
            toast.success(`Signed in as ${res.user?.name ?? decoded?.name}`);
            navigate("/wishlist", { replace: true });
        } catch (e) {
            console.error("Failed to decode token:", e);
            toast.error("Login failed - Check console.");
        } finally {
            setLoading(false);
        }
    };

    // If Google popup fails
    const handleError = ()=> {
        console.error("Google login failed");
        toast.error("Google login failed - please try again.");
    };

    return loading ? <Spinner /> : (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
            <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
        </div>
    );
};

export default GoogleSignIn;