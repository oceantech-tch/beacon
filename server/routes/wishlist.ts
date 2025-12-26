import express from "express";
import { getWishlist, addToWishlist, removeFromWishlist } from "../controllers/wishlist.js";
import authMiddleware from "../middlewares/auth.js"; 

const wishlistRouter = express.Router();

wishlistRouter.get("/", authMiddleware, getWishlist);
wishlistRouter.post("/", authMiddleware, addToWishlist);
wishlistRouter.delete("/:model", authMiddleware, removeFromWishlist);

export default wishlistRouter;