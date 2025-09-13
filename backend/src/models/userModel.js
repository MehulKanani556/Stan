import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { decryptData } from "../middlewares/incrypt.js";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, },
        username: { type: String },
        email: { type: String },
        contactNo: { type: String },
        password: { type: String },
        profilePic: { type: String, default: null },
        // bio: { type: String, maxlength: 160 },
        // gender: { type: String, enum: ["male", "female"] },

        // followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        // followings: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

        joinedAt: { type: Date, default: Date.now },

        otp: { type: String },
        otpExpiry: { type: Date },

        // Privacy & Security
        role: { type: String, enum: ["admin", "user"] },
        isAdmin: { type: Boolean, default: false },
        lastLogin: { type: Date, default: null },
        continueLogin:{
            type:Number,default : 0
        },
        wishlist: [
            {
                game: { type: mongoose.Schema.Types.ObjectId, ref: 'game', required: true },
                addedAt: { type: Date, default: Date.now }
            }
        ],
        // Cart field to store cart items
        cart: [{
            game: { type: mongoose.Schema.Types.ObjectId, ref: "game" },
            platform: { type: String, enum: ["windows", "ios", "android"] },
            qty: { type: Number, default: 1, min: 1 },
            price: { type: Number, required: true },
            name: { type: String },
            addedAt: { type: Date, default: Date.now }
        }],
        fanCoins: {
            type: Number,
            default: 0,
            min: 0
        },
        fanCoinTransactions: [{
            type: {
                type: String,
                enum: ['EARN', 'SPEND', 'PURCHASE'],
                required: true
            },
            amount: {
                type: Number,
                required: true
            },
            description: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            }
        }]
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
    }, process.env.JWT_SECRET,
        // { expiresIn: "60m" }
    );
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
