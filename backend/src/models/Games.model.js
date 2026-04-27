import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        cover_image: {
            url: { type: String },
            public_id: { type: String },
        },
        video: {
            url: { type: String },
            public_id: { type: String },
        },
        images: [
            {
                url: { type: String },
                public_id: { type: String }
            }
        ],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            required: true,
        },
        instructions: [{
            type: String,
        }],
        // Add platform availability
        platforms: {
            windows: {
                available: { type: Boolean, default: false },
                price: { type: Number },
                download_link: { type: String },
                size: { type: String },
                system_requirements: {
                    os: { type: String },
                    processor: { type: String },
                    memory: { type: String },
                    graphics: { type: String },
                    storage: { type: String },
                },
                public_id: { type: String },
            },
            vision_pro: {
                available: { type: Boolean, default: false },
                price: { type: Number },
                download_link: { type: String },
                size: { type: String },
                system_requirements: {
                    storage: { type: String },
                },
                public_id: { type: String },
            },
            ps5: {
                available: { type: Boolean, default: false },
                price: { type: Number },
                download_link: { type: String },
                size: { type: String },
                public_id: { type: String },
            },
            xbox: {
                available: { type: Boolean, default: false },
                price: { type: Number },
                download_link: { type: String },
                size: { type: String },
                system_requirements: {
                    device_compatibility: { type: String },
                },
                public_id: { type: String },
            },
            quest: {
                available: { type: Boolean, default: false },
                price: { type: Number },
                download_link: { type: String },
                size: { type: String },
                system_requirements: {
                    supported_Platforms: { type: String },
                    storage: { type: String },
                },
                public_id: { type: String },
            },
            nintendo_switch_1: {
                available: { type: Boolean, default: false },
                price: { type: Number },
                download_link: { type: String },
                size: { type: String },
                Supported_play_modes: { type: String },
                public_id: { type: String },
            },
            nintendo_switch_2: {
                available: { type: Boolean, default: false },
                price: { type: Number },
                download_link: { type: String },
                size: { type: String },
                Supported_play_modes: { type: String },
                public_id: { type: String },
            },
            ios: {
                available: { type: Boolean, default: false },
                price: { type: Number },
                download_link: { type: String },
                size: { type: String },
                // system_requirements: {
                //     ios_version: { type: String },
                //     device_compatibility: { type: String },
                // },
                public_id: { type: String },
            },
            android: {
                available: { type: Boolean, default: false },
                price: { type: Number },
                download_link: { type: String },
                size: { type: String },
                // system_requirements: {
                //     android_version: { type: String },
                //     device_compatibility: { type: String },
                // },
                public_id: { type: String },
            },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        // Popularity metrics
        views: {
            type: Number,
            default: 0,
        },
        downloads: {
            type: Number,
            default: 0,
        },
        // Reviews and ratings
        reviews: {
            count: {
                type: Number,
                default: 0,
            },
            averageRating: {
                type: Number,
                default: 0,
                min: 0,
                max: 5,
            },
            totalRating: {
                type: Number,
                default: 0,
            },
        },
        tags: [{
            type: String,
        }],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("game", gameSchema);