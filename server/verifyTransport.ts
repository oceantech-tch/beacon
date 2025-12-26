import nodemailer from "nodemailer";
import dotenvx from "@dotenvx/dotenvx";

dotenvx.config();

(async () => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: Number(process.env.MAILTRAP_PORT || 2525),
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS,
            },
        });

        await transporter.verify();
        console.log("Transporter verified");
        process.exit(0);
    } catch (e: any) {
        console.error("Transport verify failed:", e?.message ?? e);
        process.exit(1);
    }
})();