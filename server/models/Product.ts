import mongoose, { Schema } from "mongoose";

export interface Iproduct {
    model: string;
    price: number;
    condition: string;
    imageUrl?: string;
    notify?: boolean;
    notified?: boolean;
    disabled?: boolean;
    notifiedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
};


const productSchema = new Schema<Iproduct>(
    {
        model: { type: String, required: true, index: true },
        price: { type: Number, required: true },
        condition: { type: String, required: true },
        imageUrl: { type: String, default: "" },
        notify: { type: Boolean, default: false },
        notified: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        notifiedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

const Product = mongoose.model<Iproduct>("Product", productSchema);
export default Product;
