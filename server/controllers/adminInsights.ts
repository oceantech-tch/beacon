// import { Request, Response } from "express";
// import Users from "../models/Users.js";
// import Product from "../models/Product.js";

// export const wishlistSummary = async (req: Request, res: Response) => {
//   try {
//     const base = await Users.aggregate([
//       { $unwind: "$wishlist" },
//       { $group: { _id: "$wishlist", count: { $sum: 1 } } },
//       { $project: { model: "$_id", count: 1, _id: 0 } },
//       { $sort: { count: -1, model: 1 } }
//     ]);

//     // Fetch disabled model states
//     const products = await Product.find({}, { model: 1, disabled: 1 }).lean();

//     const summary = base.map((row) => {
//       const prod = products.find((p) => p.model === row.model);
//       return {
//         ...row,
//         disabled: prod?.disabled ?? false
//       };
//     });

//     return res.json({ ok: true, summary });
//   } catch (e: any) {
//     console.error("WishlistSummary error:", e.message);
//     return res.status(500).json({ ok: false, message: "Internal server error" });
//   }
// };

// // make request to get list of users who have a given model in their wishlist
// export const wishlistUsers = async (req: Request, res: Response) => {
//     try {
//         const rawModel = req.params.model;
//         if (!rawModel) {
//             return res.status(400).json({
//                 ok: false,
//                 message: "Model required"
//             });
//         }

//         // decode if model is URL-encoded
//         const model = decodeURIComponent(rawModel);

//         // find users
//         // project only the needed fields
//         const users = await Users.find(
//             { wishlist: model },
//             { email: 1, name: 1, createdAt: 1 }
//         )
//             .lean()
//             .exec();

//         return res.json({
//             ok: true,
//             users
//         });
//     } catch (e: any) {
//         console.error("wishlistUsers error:", e?.message ?? e);
//         return res.status(500).json({
//             ok: false,
//             message: "Internal server error"
//         });
//     }
// };





// controllers/adminInsights.ts
import { Request, Response } from "express";
import Users from "../models/Users.js";

/**
 * Return aggregated counts for wishlisted models.
 */
export const wishlistSummary = async (req: Request, res: Response) => {
  try {
    const pipeline: any[] = [
      { $unwind: { path: "$wishlist", preserveNullAndEmptyArrays: false } },
      { $group: { _id: "$wishlist", count: { $sum: 1 } } },
      { $project: { model: "$_id", count: 1, _id: 0 } },
      { $sort: { count: -1, model: 1 } },
    ];

    const result = await (Users as any).aggregate(pipeline).exec();
    console.log("SUMMARY RESULT:", result);

    return res.json({ ok: true, summary: result });
  } catch (e: any) {
    console.error("WishlistSummary error:", e?.message ?? e);
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
};

/**
 * Return user list for a particular model
 */
export const wishlistUsers = async (req: Request, res: Response) => {
  try {
    const rawModel = req.params.model;
    if (!rawModel) return res.status(400).json({ ok: false, message: "Model required" });

    const model = decodeURIComponent(rawModel);
    const users = await Users.find({ wishlist: model }, { email: 1, name: 1, createdAt: 1 }).lean().exec();

    console.log("HIT /wishlist-users/", req.params.model);
    return res.json({ ok: true, users });
  } catch (e: any) {
    console.error("wishlistUsers error:", e?.message ?? e);
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
};