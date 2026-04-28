import mongoose from "mongoose";

const freeGameSchema = mongoose.Schema(
    {
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        image: {
            type: String,
            required: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            required: true,
        },
        iframeSrc: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
    },
    { timestamps: true }
);

export default mongoose.model("FreeGameStan", freeGameSchema);


