import React, { useState, useCallback } from 'react';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from 'react-redux';
import { verifyPayment } from "../Redux/Slice/Payment.slice";
import { clearCart } from "../Redux/Slice/cart.slice";
import { FaRegCreditCard } from "react-icons/fa";
import { BsCalendar2Event } from "react-icons/bs";
import { BiLockAlt } from "react-icons/bi";
import { useFanCoins } from '../Redux/Slice/user.slice';

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
    clientSecret, 
    amount, 
    orderId, 
    onPaymentSuccess, 
    fromCartPage = false 
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const { fanCoins } = useSelector(state => state.user);
    const { user: authUser } = useSelector(state => state.auth); // Get authenticated user
    
    // Use the useFanCoins hook
    const handleUseFanCoins = useFanCoins();
    
    // State for name and email
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    
    // Fan coin state
    const [useFanCoinsChecked, setUseFanCoinsChecked] = useState(false);
    const [fanCoinsToUse, setFanCoinsToUse] = useState(0);

    // Handle fan coin usage
    const handleFanCoinUsage = useCallback(async () => {
        if (useFanCoinsChecked && fanCoinsToUse > 0) {
            try {
                const resultAction = await dispatch(handleUseFanCoins({
                    userId: authUser._id, 
                    gamePrice: amount, 
                    fanCoinsToUse
                }));

                if (handleUseFanCoins.fulfilled.match(resultAction)) {
                    // Update amount to pay with discounted price
                    amount = resultAction.payload.discountedPrice;
                }
            } catch (error) {
                console.error('Failed to use fan coins:', error);
                // Optionally show error to user
            }
        }
    }, [
        dispatch, 
        handleUseFanCoins, 
        useFanCoinsChecked, 
        fanCoinsToUse, 
        authUser, 
        amount
    ]);

    // Existing payment submission logic
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        // First use fan coins if selected
        await handleFanCoinUsage();

        const cardNumberElement = elements.getElement(CardNumberElement);

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardNumberElement,
                billing_details: {
                    name: fullName || "Guest",
                    email: email || "guest@example.com",
                },
            },
        });

        if (error) {
            alert(error.message || "An unexpected error occurred");
            // setIsLoading(false); // This line was removed from the new_code, so it's removed here.
        } else if (paymentIntent?.status === "succeeded") {
            dispatch(verifyPayment({ paymentIntentId: paymentIntent.id, orderId }));
            if (fromCartPage) {
                dispatch(clearCart());
            }
            alert("Payment Successful!");
            onPaymentSuccess();
            // setIsLoading(false); // This line was removed from the new_code, so it's removed here.
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="sm:px-6 sm:py-6 px-3 py-4  bg-gray-900 rounded-2xl shadow-lg space-y-5 border border-gray-700"
        >
            {/* Card Number */}
            <div className="relative group">
                <FaRegCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <div className="p-3 pl-10 rounded-xl border border-gray-700 bg-gray-800 transition-all group-focus-within:border-purple-400 group-focus-within:shadow-[0_0_10px_#621df2]">
                    <label className="absolute -top-2 left-10 text-xs text-purple-300 bg-gray-900 sm:px-1">
                        Card Number
                    </label>
                    <CardNumberElement options={CARD_STYLE} />
                </div>
            </div>

            {/* Expiry + CVC */}
            <div className="flex gap-3">
                <div className="relative group flex-1">
                    <BsCalendar2Event className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <div className="p-3 pl-10 rounded-xl border border-gray-700 bg-gray-800 transition-all group-focus-within:border-purple-400 group-focus-within:shadow-[0_0_10px_#621df2]">
                        <label className="absolute -top-2 left-10 text-xs text-purple-300 bg-gray-900 sm:px-1">
                            Expiry Date
                        </label>
                        <CardExpiryElement options={CARD_STYLE} />
                    </div>
                </div>

                <div className="relative group flex-1">
                    <BiLockAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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

            {/* Fan Coin Usage Section */}
            <div className="fan-coin-section">
                <label>
                    <input 
                        type="checkbox" 
                        checked={useFanCoinsChecked}
                        onChange={() => setUseFanCoinsChecked(!useFanCoinsChecked)}
                    />
                    Use Fan Coins (Available: {fanCoins})
                </label>
                
                {useFanCoinsChecked && (
                    <input 
                        type="number" 
                        value={fanCoinsToUse}
                        onChange={(e) => {
                            const value = Math.min(
                                Number(e.target.value), 
                                Math.min(fanCoins, amount)
                            );
                            setFanCoinsToUse(value);
                        }}
                        max={Math.min(fanCoins, amount)}
                        min={0}
                        placeholder="Fan Coins to Use"
                    />
                )}
            </div>

            {/* Pay Button */}
            <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#621df2] to-[#b191ff] text-white font-semibold py-3 rounded-xl active:scale-95 transition transform hover:shadow-[0_0_15px_#621df2]"
                disabled={!stripe}
            >
                {/* isLoading ? "Processing..." : `Pay $${amount?.toFixed(2)}` */}
                {/* The new_code removed isLoading state, so this line is removed. */}
                `Pay $${amount?.toFixed(2)}`
            </button>
        </form>
    );
};

export default PaymentForm;
