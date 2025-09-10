import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "game",
        required: true,
      },
      name: { type: String },
      platform: { type: String, required: true },
      price: { type: Number, required: true },
      downloadToken: String,
      downloadTokenUsed: { type: Boolean, default: false }
    },
  ],
  amount: { type: Number, required: true },
  originalAmount: { type: Number, required: true }, // Store original amount before fan coins
  currency: { type: String, default: "USD" },
  stripePaymentIntentId: { type: String },
  status: {
    type: String,
    enum: ["created", "paid", "failed"],
    default: "created",
  },
  fanCoinsUsed: { type: Number, default: 0 }, // Track fan coins used
  fanCoinDiscount: { type: Number, default: 0 }, // Track discount amount from fan coins
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("OrderStan", orderSchema);
 