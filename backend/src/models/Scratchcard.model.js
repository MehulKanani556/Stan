import mongoose from "mongoose";

const ScratchCardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserStan",
    required: true,
  },
  reward: {
    type: Object,
  },
  isRevealed: {
    type: Boolean,
    default: false,
  },
  isClaimed: {
    type: Boolean,
    default: false,
  },
  isPurchased: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
    default: Date.now,
  },
  uniqueCode: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
  },
});

export default mongoose.model("ScratchCard", ScratchCardSchema);