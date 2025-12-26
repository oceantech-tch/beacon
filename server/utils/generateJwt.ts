import jwt from "jsonwebtoken";
import dotenvx from "@dotenvx/dotenvx";

dotenvx.config();

export const signJwt = (payload: object)=> {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT is not set in environment");
    
    const opts: jwt.SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as any,
    };
    return jwt.sign(payload, secret, opts); 
};

// Verify and return decoded
export const verifyJwt = (token: string)=> {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT is not set in environment");
    return jwt.verify(token, secret);
};