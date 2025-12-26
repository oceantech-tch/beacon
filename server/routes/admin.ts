import express from "express";
import adminAuth from "../middlewares/admin.js";
import { adminLogin, addProduct, adminSignup, getAllProducts } from "../controllers/admin.js";
import { wishlistSummary, wishlistUsers } from "../controllers/adminInsights.js";
import { disableProduct } from "../controllers/adminDisable.js";

const adminRouter = express.Router();

adminRouter.get("/products", getAllProducts);
adminRouter.post("/signup", adminSignup);
adminRouter.post("/login", adminLogin);
adminRouter.post("/products", adminAuth, addProduct);
adminRouter.patch("/product/:id/disable", adminAuth, disableProduct);

adminRouter.get("/wishlist-summary", adminAuth, wishlistSummary);
adminRouter.get("/wishlist-users/:model", adminAuth, wishlistUsers);


export default adminRouter;