
import React, { useState, useCallback, useEffect } from 'react';
import {
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
} from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from 'react-redux';
import { verifyPayment, createPaymentIntent } from "../Redux/Slice/Payment.slice";
import { clearCart } from "../Redux/Slice/cart.slice";
import { FaRegCreditCard } from "react-icons/fa";
import { BsCalendar2Event } from "react-icons/bs";
import { BiLockAlt } from "react-icons/bi";

const CARD_STYLE = {
    style: {
        base: {
            color: "#fff",
            fontSize: "16px",
            fontFamily: "Inter, sans-serif",
            letterSpacing: "0.5px",
            "::placeholder": { color: "#a0aec0" },
        },
        invalid: {
            color: "#ff6b6b",
            iconColor: "#ff6b6b",
        },
    },
};

const PaymentForm = ({
    items,
    amount,
    orderId,
    onPaymentSuccess,
    fromCartPage = false,
    fanCoinsToUse = 0,
    fanCoinsApplied = false
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const { currentUser: authUser } = useSelector(state => state.user);
    const { clientSecret } = useSelector(state => state.payment);

    // State for name and email
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");

    // Payment submission logic
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            console.error('Stripe not loaded');
            alert('Payment system is not ready. Please try again.');
            return;
        }

        try {
            // Create or update payment intent with the final amount (after fan coins applied)
            const intentResult = await dispatch(createPaymentIntent({
                items: items || [],
                amount: amount, // This amount already has fan coins deducted
                orderId,
                metadata: {
                    fanCoinsUsed: fanCoinsToUse,
                    fanCoinsApplied: fanCoinsApplied,
                    customerName: fullName,
                    customerEmail: email
                }
            }));

            // Check if intent creation was successful
            if (!createPaymentIntent.fulfilled.match(intentResult)) {
                console.error('Failed to create/update payment intent', intentResult.payload);
                alert('Failed to initialize payment. Please try again.');
                return;
            }

            // Get the client secret from the intent result
            const currentClientSecret = intentResult.payload?.clientSecret || clientSecret;

            if (!currentClientSecret) {
                console.error('No client secret available');
                alert('Payment initialization failed. Please try again.');
                return;
            }

            const cardNumberElement = elements.getElement(CardNumberElement);

            if (!cardNumberElement) {
                console.error('Card element not found');
                alert('Payment form not properly loaded. Please refresh the page.');
                return;
            }

            console.log('Processing payment with client secret:', currentClientSecret);

            // If the amount is 0 (fully covered by fan coins), skip Stripe payment
            if (amount === 0) {
                console.log('Payment fully covered by Fan Coins, skipping Stripe payment');
                
                // Verify the "free" payment on your backend
                const verificationResult = await dispatch(verifyPayment({
                    paymentIntentId: currentClientSecret, // Special identifier for free payments
                    orderId,
                    fanCoinsUsed: fanCoinsToUse,
                    fanCoinDiscount: fanCoinsToUse, // Discount is equal to fan coins used
                    finalAmount: 0
                }));

                if (verifyPayment.fulfilled.match(verificationResult)) {
                    alert("Order completed successfully with Fan Coins!");

                    if (onPaymentSuccess && typeof onPaymentSuccess === 'function') {
                        onPaymentSuccess({
                            paymentIntentId: 'free_with_fan_coins',
                            amount: 0,
                            fanCoinsUsed: fanCoinsToUse
                        });
                    }
                } else {
                    console.error('Order verification failed:', verificationResult.payload);
                    alert('Order processing failed. Please contact support.');
                }
                return;
            }

            // Confirm the payment with Stripe (for non-zero amounts)
            const { error, paymentIntent } = await stripe.confirmCardPayment(currentClientSecret, {
                payment_method: {
                    card: cardNumberElement,
                    billing_details: {
                        name: fullName || "Guest",
                        email: email || "guest@example.com",
                    },
                },
            });

            if (error) {
                console.error('Payment error:', error);
                alert(error.message || "An unexpected error occurred");
            } else if (paymentIntent?.status === "succeeded") {
                console.log('Payment successful:', paymentIntent.id);

                // Verify payment on your backend
                const verificationResult = await dispatch(verifyPayment({
                    paymentIntentId: paymentIntent.id,
                    orderId,
                    fanCoinsUsed: fanCoinsToUse,
                    fanCoinDiscount: fanCoinsToUse, // Discount is equal to fan coins used
                    finalAmount: amount
                }));

                // Handle verification result
                if (verifyPayment.fulfilled.match(verificationResult)) {
                    alert("Payment Successful!");

                    if (onPaymentSuccess && typeof onPaymentSuccess === 'function') {
                        onPaymentSuccess({
                            paymentIntentId: paymentIntent.id,
                            amount: amount,
                            fanCoinsUsed: fanCoinsToUse
                        });
                    }
                } else {
                    console.error('Payment verification failed:', verificationResult.payload);
                    alert('Payment completed but verification failed. Please contact support.');
                }
            }
        } catch (error) {
            console.error('Payment processing error:', error);
            alert('Payment processing failed. Please try again.');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="sm:px-6 sm:py-6 px-3 py-4  bg-gray-900 rounded-2xl shadow-lg space-y-5 border border-gray-700"
        >
            {/* Card Number - Only show if amount > 0 */}
            {amount > 0 && (
                <div className="relative group">
                    <FaRegCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <div className="p-3 pl-10 rounded-xl border border-gray-700 bg-gray-800 transition-all group-focus-within:border-purple-400 group-focus-within:shadow-[0_0_10px_#621df2]">
                        <label className="absolute -top-2 left-10 text-xs text-purple-300 bg-gray-900 sm:px-1">
                            Card Number
                        </label>
                        <CardNumberElement options={CARD_STYLE} />
                    </div>
                </div>
            )}

            {amount > 0 && (
                <div className="flex gap-3">
                    {/* Expiry Date */}
                    <div className="relative group flex-1">
                        <BsCalendar2Event className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <div className="p-3 pl-10 rounded-xl border border-gray-700 bg-gray-800 transition-all group-focus-within:border-purple-400 group-focus-within:shadow-[0_0_10px_#621df2]">
                            <label className="absolute -top-2 left-10 text-xs text-purple-300 bg-gray-900 sm:px-1">
                                Expiry Date
                            </label>
                            <CardExpiryElement options={CARD_STYLE} />
                        </div>
                    </div>
                    {/* CVV */}
                    <div className="relative group flex-1">
                        <BsCalendar2Event className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <div className="p-3 pl-10 rounded-xl border border-gray-700 bg-gray-800 transition-all group-focus-within:border-purple-400 group-focus-within:shadow-[0_0_10px_#621df2]">
                            <label className="absolute -top-2 left-10 text-xs text-purple-300 bg-gray-900 sm:px-1">
                                CVV
                            </label>
                            <CardCvcElement
                                options={{
                                    ...CARD_STYLE,
                                    placeholder: 'CVV'
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Name and Email Fields */}
            <div className="space-y-4">
                <div className="relative group">
                    <div className="p-3 rounded-xl border border-gray-700 bg-gray-800 transition-all group-focus-within:border-purple-400 group-focus-within:shadow-[0_0_10px_#621df2]">
                        <label className="absolute -top-2 left-3 text-xs text-purple-300 bg-gray-900 px-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full bg-transparent outline-none text-white placeholder-gray-500"
                        />
                    </div>
                </div>

                <div className="relative group">
                    <div className="p-3 rounded-xl border border-gray-700 bg-gray-800 transition-all group-focus-within:border-purple-400 group-focus-within:shadow-[0_0_10px_#621df2]">
                        <label className="absolute -top-2 left-3 text-xs text-purple-300 bg-gray-900 px-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full bg-transparent outline-none text-white placeholder-gray-500"
                        />
                    </div>
                </div>
            </div>

            {/* Fan Coins Applied Display */}
            {fanCoinsApplied && fanCoinsToUse > 0 && (
                <div className="bg-green-800/20 border border-green-500/30 p-4 rounded-xl">
                    <div className="flex items-center justify-between text-green-400">
                        <span className="text-sm font-medium">Fan Coins Applied</span>
                        <span className="text-sm">{fanCoinsToUse} Fan Coins = ${fanCoinsToUse} Discount</span>
                    </div>
                </div>
            )}

            {/* Order Summary */}
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                <h3 className="text-white font-semibold mb-2">Order Summary</h3>
                {fanCoinsApplied && fanCoinsToUse > 0 && (
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Fan Coins Discount:</span>
                        <span className="text-green-400">-${fanCoinsToUse}</span>
                    </div>
                )}
                <div className="flex justify-between text-lg font-bold text-white">
                    <span>Total to Pay:</span>
                    <span>${amount.toFixed(2)}</span>
                </div>
            </div>

            {/* Pay Button */}
            <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#621df2] to-[#b191ff] text-white font-semibold py-3 rounded-xl active:scale-95 transition transform hover:shadow-[0_0_15px_#621df2]"
                disabled={!stripe && amount > 0}
            >
                {amount === 0 
                    ? `Complete Order (Fully Covered by Fan Coins)`
                    : fanCoinsApplied && fanCoinsToUse > 0
                        ? `Pay ${amount.toFixed(2)} (${fanCoinsToUse} Fan Coins Applied)`
                        : `Pay ${amount.toFixed(2)}`
                }
            </button>
        </form>
    );
};

export default PaymentForm;