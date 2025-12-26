import mongoose, { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
    email: string;
    name: string;
    picture?: string;
    wishlist?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true, index: true },
        name: { type: String, required: true, default: "" },
        picture: { type: String, default: "" },
        wishlist: { type: [String], default: [] },
    },
    { timestamps: true }
);
const Users = model<IUser>("User", userSchema);
export default Users;