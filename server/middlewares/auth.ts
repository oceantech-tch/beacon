import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
// import dotenvx from "@dotenvx/dotenvx";

// dotenvx.config();

interface JwtPayloadMinimal {
    userId?: string;
    email?: string;
    iat?: number;
    exp?: number;
};

const authMiddleware = (req: Request, res: Response, next: NextFunction)=> {
    try {
        // Read from header
        const auth = req.headers.authorization;
        let token: string | undefined;

        if (auth && auth.startsWith("Bearer ")) {
            token = auth.slice(7); // remove bearer
        } else if (req.cookies && req.cookies.token) {
            // fallback to cookie token if cookie auth used
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ ok: false, message: "Authentication required." });
        }

        // Verify
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("JWT secret not set");

        const decoded = jwt.verify(token, secret) as JwtPayloadMinimal;

        // Attach user to request obj for downstream handlers
        (req as any).user = { userId: decoded.userId, email: decoded.email };

        return next();
    } catch (e: any) {
        console.error("authMiddleware error:", e?.message ?? e);
        return res.status(401).json({ ok: false, message: "Invalid or expired token" });
    }
};

export default authMiddleware;