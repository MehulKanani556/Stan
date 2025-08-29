import Stripe from "stripe";
import crypto from "crypto";
import Order from "../models/Order.model.js";
import User from "../models/userModel.js";
import Game from '../models/Games.model.js';
import { clearCart } from "./cart.controller.js";
import sendMail from "../helper/sendMail.js";
import { decryptData } from "../middlewares/incrypt.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 1. Create Order and DB Order
export const createOrder = async (req, res) => {
  try {
    const { items, amount } = req.body;
    const userId = req.user._id; // assuming you use auth middleware

    // Create Stripe Payment Intent
      console.log(req.user);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // in cents
      currency: "USD",
      metadata: { orderId: "temp_order_id" }, // Placeholder, will be updated
      receipt_email:decryptData( req.user.email), // Assuming user email is available
    });

    if (paymentIntent && paymentIntent.id) {
      // Save order in DB
      const order = await Order.create({
        user: userId,
        items,
        amount,
        currency: "USD",
        stripePaymentIntentId: paymentIntent.id,
        status: "created",
      });

      return res.json({ order, clientSecret: paymentIntent.client_secret });
    } else {
      return res.status(500).json({ error: "Failed to create Stripe Payment Intent" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const {
      paymentIntentId,
      orderId,
    } = req.body;

    // No signature verification needed on backend for Stripe client-side confirmation
    // Update order in DB
    let order;
    try {
      order = await Order.findByIdAndUpdate(
        orderId,
        {
          stripePaymentIntentId: paymentIntentId,
          status: "paid",
        },
        { new: true }
      );
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
    } catch (err) {
      return res.status(500).json({ error: "Failed to update order: " + err.message });
    }

    // Clear user cart if possible
    const userId = req.user?._id;
    // if (userId) {
    //   try {
    //     const user = await User.findById(userId);
    //     if (user) {
    //       user.cart = [];
    //       await user.save();
    //     }
    //   } catch (err) {
    //     // Log but don't block payment success
    //     console.error("Error clearing user cart:", err);
    //   }
    // }

    // Generate download tokens and send mail
    let mailError = null;
    if (order && order.items && order.items.length > 0) {
      try {
        // For each item, generate a token and update
        for (let item of order.items) {
          item.downloadToken = crypto.randomBytes(32).toString("hex");
          item.downloadTokenUsed = false;
        }
        await order.save();
      } catch (err) {
        return res.status(500).json({ error: "Failed to generate download tokens: " + err.message });
      }

      try {
        const user = await User.findById(order.user);
        if (user && user.email) {
          const decryptedEmail = decryptData(user.email);
          const recipientEmail = decryptedEmail && decryptedEmail.includes("@") ? decryptedEmail : user.email;
          const mailBody = `
                Hi ${user.fullName || user.email},

                Thank you for your purchase on Yoyo Games! 🎮

                Below are your download links for the games you just bought. Each link is unique and can be used only once, so please download your games at your earliest convenience.

                ${order.items
                  .map(
                    (item, idx) =>
                      `${idx + 1}. ${item.name} (${item.platform})
                    Download Link: http://localhost:8000/api/download/${item.downloadToken}
                `).join("\n")}

                If you have any issues with your downloads or need support, feel free to reply to this email.

                Happy gaming!
                The Yoyo Games Team
                `;

          await sendMail(
            recipientEmail,
            "Your Game Download Links - Yoyo Games",
            mailBody
          );
        }
      } catch (err) {
        // Don't block payment, but report mail error
        mailError = "Payment successful, but failed to send email: " + err.message;
        console.error(mailError);
      }
    }

    if (mailError) {
      return res.status(200).json({ 
        success: true, 
        order, 
        warning: mailError 
      });
    } else {
      return res.json({ success: true, order });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get User Orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "items.game",
        select: "title cover_image images",
      });

    if (!orders || orders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No orders found for this user.",
        orders: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Orders fetched successfully.",
      orders: orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user orders.",
      error: err.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add this function
export const retryOrderPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.status === "paid")
      return res.status(400).json({ error: "Order already paid" });

    // Create new Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.amount * 100),
      currency: order.currency,
      metadata: { orderId: order._id.toString() },
    });

    order.stripePaymentIntentId = paymentIntent.id;
    order.status = "created";
    await order.save();

    res.json({ order, clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const downloadGame = async (req, res) => {
  const { token } = req.params;

  const order = await Order.findOne({ "items.downloadToken": token });
  if (!order) {
    return res.status(400).send('Download link is invalid or expired.');
  }

  const item = order.items.find(it => it.downloadToken === token);
  if (!item || item.downloadTokenUsed) {
    return res.status(400).send('Download link is invalid or expired.');
  }

  const { game: gameId, platform } = item;

  const game = await Game.findById(gameId);
  if (!game) {
    return res.status(404).send('Game not found.');
  }

  let downloadLink;
  if (platform === "windows" && game.platforms.windows && game.platforms.windows.download_link) {
    downloadLink = game.platforms.windows.download_link;
  } else if (platform === "ios" && game.platforms.ios && game.platforms.ios.download_link) {
    downloadLink = game.platforms.ios.download_link;
  } else if (platform === "android" && game.platforms.android && game.platforms.android.download_link) {
    downloadLink = game.platforms.android.download_link;
  } else {
    return res.status(404).send('Game file for the selected platform not found.');
  }

  item.downloadTokenUsed = true;
  await order.save();
  // Redirect to the S3 (or other) download link
  return res.redirect(downloadLink);
};
 