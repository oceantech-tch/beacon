import express, { Application } from "express";
import cors from "cors";
import dotenvx from "@dotenvx/dotenvx";
import connectDb from "./config/connectDb.js";
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";
import cookieParser from "cookie-parser";
import authMiddleware from "./middlewares/auth.js";
import wishlistRouter from "./routes/wishlist.js";

dotenvx.config();
const PORT = process.env.PORT || 5000;
const app: Application = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,                    // required for cookies OR axios withCredentials
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser()); //register before routes that read cookies

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/wishlist", wishlistRouter);

app.get("/", (_, res)=> res.send("G-Shock API running..."));
app.get("/api/me", authMiddleware, async (req, res)=> {
    // req.user already attached
    return res.json({ ok: true, user: (req as any).user });
});

connectDb().then(()=> {
    app.listen(PORT, ()=> console.log(`Server running on port: ${PORT}`));
});