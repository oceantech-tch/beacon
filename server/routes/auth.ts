import express from "express";
import googleAuth from "../controllers/auth.js";

const authRouter = express.Router();
authRouter.post("/google", googleAuth);

export default authRouter;