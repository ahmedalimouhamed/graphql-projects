const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Name is required"], unique: true, index: true },
    description: { type: String, required: [true, "Description is required"], index: true },
    price: { type: Number, required: [true, "Price is required"], index: true },
    stock: { type: Number, required: [true, "Stock is required"], index: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Product", productSchema);