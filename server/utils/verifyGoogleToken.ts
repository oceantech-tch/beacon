import { OAuth2Client } from "google-auth-library";
// import dotenvx from "@dotenvx/dotenvx";

// dotenvx.config();

const GCI = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(GCI);

const verifyGoogleToken = async (idToken: string)=> {
    const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: GCI
    });

    const payload = ticket.getPayload?.() ?? undefined;
    if (!payload) {
        throw new Error("Failed to parse Google token payload");
    }
    return payload;
};
export default verifyGoogleToken;