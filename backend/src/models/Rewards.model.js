import mongoose from "mongoose";

const rewardsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        description: {
            type: String,
            trim: true,
            maxlength: 500
        },
        image: {
            url: { type: String },
            public_id: { type: String }
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        category: {
            type: String,
            enum: ['gift_card', 'merchandise', 'digital', 'mystery', 'badge'],
            default: 'merchandise'
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'out_of_stock'],
            default: 'active'
        },
        isLimited: {
            type: Boolean,
            default: false
        },
        stock: {
            type: Number,
            default: -1, // -1 means unlimited
            min: -1
        },
        minLevel: {
            type: Number,
            default: 1,
            min: 1
        },
        tags: [{
            type: String,
            trim: true
        }],
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

// Index for efficient queries
rewardsSchema.index({ status: 1, isActive: 1 });
rewardsSchema.index({ category: 1 });
rewardsSchema.index({ price: 1 });

export default mongoose.model("Reward", rewardsSchema);
