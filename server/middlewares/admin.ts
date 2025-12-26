import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
// import dotenvx from "@dotenvx/dotenvx";

// dotenvx.config();

interface JwtPayloadAdmin {
    role?: string;
    username?: string;
    iat?: number;
    exp?: number;
};

const adminAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ ok: false, message: "Admin auth required" });
        }

        const token = authHeader.slice(7);
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("JWT_SECRET missing");

        const decoded = jwt.verify(token, secret) as JwtPayloadAdmin;
        if (!decoded || decoded.role !== "admin") {
            return res.status(403).json({ ok: false, message: "Forbidden" });
        }

        // attach admin
        (req as any).admin = { username: decoded.username };
        return next();
    } catch (e: any) {
        console.error("adminAuth error:", e?.message ?? e);
        return res.status(401).json({ ok: false, message: "Internal server error" });
    }
}
export default adminAuth;