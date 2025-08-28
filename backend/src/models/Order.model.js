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
  currency: { type: String, default: "USD" },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  status: {
    type: String,
    enum: ["created", "paid", "failed"],
    default: "created",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("OrderStan", orderSchema);
 