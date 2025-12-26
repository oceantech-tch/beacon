import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";
// import dotenvx from "@dotenvx/dotenvx";

// dotenvx.config();
/*
    SendGrid for production
    Mailtrap for Development (sandbox)
*/

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
}


export const sendEmail = async ({
    to,
    subject,
    text,
    html
    }: EmailOptions): Promise<void> => {
        const mailService = (process.env.MAIL_SERVICE || "sendgrid").toLowerCase(); 

        if (mailService === "mailtrap") {
            const transporter = nodemailer.createTransport({
                host: process.env.MAILTRAP_HOST,
                port: Number(process.env.MAILTRAP_PORT || 2525),
                auth: {
                    user: process.env.MAILTRAP_USER,
                    pass: process.env.MAILTRAP_PASS,
                },
            });

            const msg = {
                from: process.env.FROM_EMAIL,
                to,
                subject,
                text,
                html: html ?? `<p>${text}</p>`,
            };

            try {
                const info = await transporter.sendMail(msg);
                console.log(`[Mailtrap] Email sent successfully to ${to}. messageId=(${info.messageId})`);
            } catch (e: any) {
                console.error("[Mailtrap] sendMail error:", e?.message ?? e);
                throw e;
            }
        } else {
            if (!process.env.SENDGRID_API_KEY) {
                throw new Error("SENDGRID_API_KEY is not configured in environment");
            }
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);

            const msg = {
                to,
                from: process.env.FROM_EMAIL as string,
                subject,
                text,
                html: html ?? `<p>${text}</p>`,
            };
            
            try {
                await sgMail.send(msg);
                console.log(`Email sent successfully to ${to}`);
            } catch (e: any) {
                console.error("SendGrid send error:", e?.response?.body ?? e.message);
                throw e;
            }
        }

};

export const sendBatchEmail = async (
    recipients: string[],
    subject: string,
    text: string,
    html?: string
    ): Promise<void> => {

    if (!recipients || recipients.length === 0) {
        console.log("sendBatchEmail: no recipients, skipping send");
        return;
    }
    
    for (const to of recipients) {
        // small delay/ backoff can be added here if you notice rate limits.
        await sendEmail({ to, subject, text, html });
    }
};