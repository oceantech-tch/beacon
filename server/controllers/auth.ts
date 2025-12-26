import { Request, Response } from "express";
import verifyGoogleToken from "../utils/verifyGoogleToken.js";
import { signJwt } from "../utils/generateJwt.js";
import User from "../models/Users.js";
// import dotenvx from "@dotenvx/dotenvx";

// dotenvx.config();

/*
FLOW:
1. Receive credential (GOOGLE ID token) from client
2. Verify token with Google (Server-side verification).
3. Upsert (create or update) user in mongoDb.
4. Sign a server-side jwt and return it (and optionally set HttpOnly cookie).

Important: Always verify Google tokens server-side. Never trust client-side decoding alone.
*/

interface GooglePayload {
    sub?: string;
    email?: string;
    name?: string;
    picture?: string;
    email_verified?: boolean | string;
};

/*
googleAuth
POST /api/auth/google
Expects: {credential: string}
Returns: {token: string, user: {...}} and set cookie if enabled.
*/

const googleAuth = async (req: Request, res: Response)=> {
    try {
        const { credential } = req.body;
        if (!credential) return res.status(400).json({ ok: false, message: "Missing credential" });

        // Verify token with Google - return payload on success
        const raw = await verifyGoogleToken(credential);
        const payload = raw as GooglePayload;
        if (!payload || !payload.email) {
            return res.status(401).json({ ok: false, message: "Invalid Google token" });
        }

        // Extracts fields needed
        const email = payload.email;
        const name = payload.name ?? "Unnamed";
        const picture = payload.picture ?? "";
        const googleId = payload.sub ?? undefined;

        // Create user or update
        const user = await User.findOneAndUpdate(
            { email },
            { $set: { name, picture, googleId }, $setOnInsert: { wishlist: [] } },
            { upsert: true, new: true }
        ).lean();

        if (!user) {
            return res.status(500).json({ ok: false, message: "Failed to create or update user" })
        }

        // Sign a server JWT 
        const token = signJwt({ userId: user._id, email: user.email });

        // Set as HttpOnly cookie for improved security
        const setCookie = process.env.SET_HTTPONLY_COOKIE?.toLowerCase() === "true";
        if (setCookie) {
            // httpOnly prevents JS access; secure requires HTTPS in production
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax" as const,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
                // domain/path can be set if necessary
            };
            res.cookie("token", token, cookieOptions);
        }

        // Return token and user to client
        res.json({ ok: true, token, user });
    } catch (e: any) {
        console.error("googleAuth error:", e?.message ?? e);
        return res.status(500).json({ok: false, message: e.message || "Internal server error" });
    }
}
export default googleAuth;