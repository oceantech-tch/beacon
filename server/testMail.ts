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

        const info = await transporter.sendMail({
            from: process.env.FROM,
            to: "test-user@example.com",
            subject: "Mailtrap quick test",
            text: "This is a quick mailtrap test from backend",
            html: "<b>This is a quick mailtrap test from backend.</b>"
        })
        
        console.log("Test email queued, messageId:", info.messageId);
    } catch (e: any) {
        console.error("Test failed:", e?.message ?? e);
    }
})();