const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        products: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true }
            }
        ],
        total: { type: Number, required: [true, "Total is required"] },
        status: { type: String, enum: ["pending", "completed", "cancelled"], default: "pending" }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);