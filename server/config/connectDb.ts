import mongoose from "mongoose";
import dotenvx from "@dotenvx/dotenvx";

dotenvx.config();
const username = process.env.MONGO_USER as string;
const password = process.env.MONGO_PASS as string;

let mongoUri = process.env.MONGO_URI
    .replace("<db_username>", username)
    .replace("<db_password>", password);

const connectDb = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(mongoUri as string);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (e) {
        console.error("MongoDB connection failed:", e);
        process.exit(1);
    }
}
export default connectDb;