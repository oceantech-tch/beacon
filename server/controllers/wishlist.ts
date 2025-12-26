import { Request, Response } from "express";
import Users from "../models/Users.js";

/*
 * Requires authMiddleware to attach req.user with userId.
 */

interface ReqUser {
  userId?: string;
  email?: string;
}

// Get user wishlist
export const getWishlist = async (req: Request, res: Response) => {
  try {
    const reqUser = (req as any).user as ReqUser;
    if (!reqUser?.userId) return res.status(401).json({ ok: false, message: "Not authenticated" });

    const user = await Users.findById(reqUser.userId).lean();
    if (!user) return res.status(404).json({ ok: false, message: "User not found" });

    return res.json({ ok: true, wishlist: user.wishlist || [], totalList: user.wishlist.length });
  } catch (err: any) {
    console.error("getWishlist error:", err?.message ?? err);
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
};

// Add to wishlist
export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const reqUser = (req as any).user as ReqUser;
    const { model } = req.body;
    if (!reqUser?.userId) return res.status(401).json({ ok: false, message: "Not authenticated" });
    if (!model) return res.status(400).json({ ok: false, message: "Model required" });

    // Add model (avoid duplicates)
    const user = await Users.findByIdAndUpdate(
      reqUser.userId,
      { $addToSet: { wishlist: model } }, // addToSet prevents duplicates
      { new: true }
    ).lean();

    return res.json({ ok: true, message: "Model added successfully", wishlist: user?.wishlist || [], totalList: user?.wishlist.length });
  } catch (err: any) {
    console.error("addToWishlist error:", err?.message ?? err);
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const reqUser = (req as any).user as ReqUser;
    const { model } = req.params;
    if (!reqUser?.userId) return res.status(401).json({ ok: false, message: "Not authenticated" });
    if (!model) return res.status(400).json({ ok: false, message: "Model required" });

    // const existingModel = await Users.findOne({ $pull: { wishlist: model } });
    // if (existingModel) {
    //  
    // }

    const user = await Users.findByIdAndUpdate(
      reqUser.userId,
      { $pull: { wishlist: model } },
      { new: true }
    ).lean();

    if (user) {
      return res.json({ ok: true, message: `Model deleted, you now have ${user?.wishlist.length} model(s) in your wishlist.`, wishlist: user?.wishlist || [] });
    } else {
       return res.status(400).json({ ok: false, message: `Unable to delete model, ${model} does not exist in your wishlist please check your input and try again.` })
    }

  } catch (err: any) {
    console.error("removeFromWishlist error:", err?.message ?? err);
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
};
