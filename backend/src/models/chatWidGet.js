import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
    {
        role: { type: String, enum: ["user", "assistant"], required: true },
        content: { type: String, required: true },
        results: { type: Array, default: [] }, // optional game results
        suggestions: { type: [String], default: [] },
    },
    { timestamps: true }
);

export default mongoose.model("ChatMessage", chatMessageSchema);
