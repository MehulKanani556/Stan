import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { decryptData } from "../middlewares/incrypt.js";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, },
        username: { type: String },
        email: { type: String },
        contactNo: { type: String },
        password: { type: String, required: true },
        profilePic: { type: String, default: null },
        bio: { type: String, maxlength: 160 },
        gender: { type: String, enum: ["male", "female"] },

        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        followings: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

        joinedAt: { type: Date, default: Date.now },

        otp: { type: String },
        otpExpiry: { type: Date },

        // Privacy & Security
        role: { type: String, enum: ["admin", "user"] },
        isAdmin: { type: Boolean, default: false },
        lastLogin: { type: Date, default: null },
    },
    { timestamps: true }
);


// Pre-save middleware to ensure isAdmin is in sync with role
userSchema.pre('save', function (next) {
    this.isAdmin = this.role === 'admin';
    next();
});

//  JWT token create method
userSchema.methods.getJWT = async function () {
    const user = this;
    const token = jwt.sign({
        _id: user._id,
        role: user.role || 'user',
        isAdmin: user.role === 'admin'
    }, process.env.JWT_SECRET);
    return token;
};

//  Password validation method (for encrypted passwords)
userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    try {
        // Decrypt the stored password and compare with input
        const decryptedPassword = decryptData(user.password);
        return decryptedPassword === passwordInputByUser;
    } catch (error) {
        return false;
    }
};

export default mongoose.model("UserStan", userSchema);
