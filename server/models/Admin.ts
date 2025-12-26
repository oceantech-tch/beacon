import mongoose, { Schema, model, Document } from "mongoose";

export interface AdminDoc extends Document {
    username?: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
};

const AdminSchema = new Schema<AdminDoc>(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true }
    },
    { timestamps: true }
);

const Admin = model<AdminDoc>("Admin", AdminSchema);
export default Admin;