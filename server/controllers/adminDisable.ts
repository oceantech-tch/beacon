import { Request, Response } from "express";
import Product from "../models/Product.js";

export const disableProduct = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(401).json({
                ok: false,
                message: "No id found in params"
            });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                ok: false,
                message: "Product not found"
            });
        }

        product.disabled = true;
        await product.save();

        return res.status(200).json({
            ok: true,
            message: "Product disabled",
            product
        });
    } catch (e: any) {
        console.error("disableProduct error:", e);
        return res.status(500).json({
            ok: false,
            message: "internal server error"
        });
    }
};