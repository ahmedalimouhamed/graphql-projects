const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Name is required"], unique: true, index: true },
    email: { type: String, required: [true, "Email is required"], unique: true, index: true },
    password: { type: String, required: [true, "Password is required"], index: true},
    role: { type: String, enum: ["admin", "user"], default: "user" },
}, {
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);