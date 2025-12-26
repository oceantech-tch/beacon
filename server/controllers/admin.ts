import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import dotenvx from "@dotenvx/dotenvx";
import { signJwt } from "../utils/generateJwt.js";
import Product from "../models/Product.js";
import Users from "../models/Users.js";
import Admin from "../models/Admin.js";
import { sendBatchEmail } from "../utils/sendEmail.js";

dotenvx.config();

const envUser = process.env.ADMIN_USERNAME;

interface AdminLoginBody {
    username ?: string;
    password ?: string;
};

export const adminSignup = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ ok: false, message: "Username and Password required" });
        }

        const exists = await Admin.findOne({ username });
        if (exists) {
            return res.status(400).json({ ok: false, message: "Admin already exists" });
        }

        const hash = await bcrypt.hash(password, 10);

        await Admin.create({ username, password: hash });

        return res.json({ ok: true, message: "created successfully" });
    } catch (e: any) {
        console.error("adminSignup error:", e?.message);
        return res.status(500).json({ ok: false, message: "Internal server error" });
    }
}

export const adminLogin = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body as AdminLoginBody;
        if (!username || !password) {
            return res.status(400).json({ ok: false, message: "Username or Password required" });
        }

        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ ok: false, message: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, admin.password);
        if (!match) {
            return res.status(401).json({ ok: false, message: "Incorrect password" });
        }

        const token = signJwt({ role: "admin", username });

        return res.json({ ok: true, token, username: envUser });
    } catch (e: any) {
        console.error("adminLogin error:", e?.message);
        return res.status(500).json({ ok: false, message: "Internal server error" });
    }
}

// Create new product doc. If notify checked, find users with that model in wishlist, send emails. After a success send, mark product.disabled = true and set notifiedAt.
export const addProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { model, price, condition, imageUrl, notify } = req.body;
        if (!model || price == null || !condition) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }

        // Create and save 
        const product = await Product.create({
            model,
            price,
            condition,
            imageUrl,
            notify: !!notify,
            notified: false,
            disabled: false,
            notifiedAt: null,
        });

        console.log(`Product added: ${product.model} (id=${product._id})`);
        
        // If admin chose "notify", send email alerts to users
        if (notify) {
            // find users that have this model in their wishlist
            const users = await Users.find({ wishlist: model }, { email: 1, _id: 0 }).lean();
            const recipients = (users || []).map((u: any) => u.email).filter(Boolean);

            if (!recipients || recipients.length === 0) {
                console.log("No users have this model wishlisted. No notification sent.");
            } else {
                const productUrl = `${process.env.FRONTEND_URL ?? ""}/products/${product._id}`;

                const subject = `Good news - ${product.model} is now available!`;
                const text = `The G-Shock ${product.model} you've been waiting for is now available for ${product.price}. View it: ${productUrl}`;
                const html = `
                    <div>
                        <h3>Good news - ${product.model} is available!</h3>
                        <p>The <strong>G-Shock ${product.model}</strong> you wanted is available for <b>$${product.price}</b>.</p>
                        <img src="${product.imageUrl}" alt="G-Shock ${product.model}" style="width:200px;height:auto;margin:10px 0;"/>
                        <p>Condition: ${product.condition}</p>
                        <p><a href="${productUrl}">Click here to view on our website</a></p>
                    </div>
                `;

                // send email
                await sendBatchEmail(recipients, subject, text, html);
                console.log(`Notification sent to ${recipients.length} users`);
                
                // AFTER NOTIFYING - Mark product as handled
                product.disabled = true;
                product.notified = true;
                product.notifiedAt = new Date();
                await product.save();
                console.log(`Product ${product.model} markeddisabled after notifying users.`);
            }
        }

        res.status(201).json({ 
            message: "Product added successfully", 
            product 
        });
    } catch (e: any) {
        console.error("Error adding product:", e.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 }).lean();

        return res.json({
            ok: true,
            products
        })
    } catch (e: any) {
        console.error("getAllProducts error:", e?.message);
        return res.status(500).json({
            ok: false,
            message: "Internal server error"
        });
    }
}