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
    items,
    amount,
    orderId,
    onPaymentSuccess,
    fromCartPage = false
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const { currentUser: authUser } = useSelector(state => state.user);
    const { clientSecret } = useSelector(state => state.payment);
    const fanCoins = authUser?.fanCoins;

    // State for name and email
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [isPaymentIntentCreated, setIsPaymentIntentCreated] = useState(false);

    // Fan coin state
    const [useFanCoinsChecked, setUseFanCoinsChecked] = useState(false);
    const [fanCoinsToUse, setFanCoinsToUse] = useState(0);

    // State for calculating final amount
    const [finalAmount, setFinalAmount] = useState(amount);



    // Handle fan coin checkbox change
    const handleFanCoinCheckboxChange = useCallback((checked) => {
        console.log('Checkbox changed:', checked);

        // Check if user is authenticated before proceeding
        if (!authUser || !authUser._id) {
            console.error('User not authenticated');
            alert('Please login to use Fan Coins');
            return;
        }

        if (!fanCoins || fanCoins <= 0) {
            console.error('No fan coins available');
            alert('You have no Fan Coins available');
            return;
        }

        setUseFanCoinsChecked(checked);

        if (checked) {
            // Calculate maximum applicable Fan Coins
            const maxApplicableCoins = Math.min(fanCoins, amount);
            console.log(maxApplicableCoins, fanCoins, amount);

            setFanCoinsToUse(maxApplicableCoins);
            setFinalAmount(Math.max(0, amount - maxApplicableCoins));
        } else {
            setFanCoinsToUse(0);
            setFinalAmount(amount);
        }
    }, [authUser, fanCoins, amount]);

    // Handle fan coin usage for payment processing
    const handleFanCoinUsage = useCallback(async () => {
        // Check if user is authenticated before applying Fan Coins
        if (!authUser || !authUser._id) {
            console.error('User not authenticated');
            return { success: false, discountedPrice: amount };
        }

        if (useFanCoinsChecked && fanCoinsToUse > 0) {
            try {
                console.log('Applying fan coins:', fanCoinsToUse);

                // eslint-disable-next-line react-hooks/rules-of-hooks
                const resultAction = await dispatch(useFanCoins({
                    userId: authUser._id,
                    gamePrice: amount,
                    fanCoinsToUse
                }));

                if (resultAction.type === 'user/useFanCoins/fulfilled') {
                    console.log('Fan coins applied successfully:', resultAction.payload);
                    return {
                        success: true,
                        discountedPrice: resultAction.payload.discountedPrice || finalAmount
                    };
                } else {
                    console.error('Failed to apply Fan Coins', resultAction);
                    throw new Error(resultAction.error?.message || 'Failed to apply Fan Coins');
                }
            } catch (error) {
                console.error('Failed to use fan coins:', error);
                alert('Failed to apply Fan Coins. Please try again.');
                // Reset fan coin usage on error
                setUseFanCoinsChecked(false);
                setFanCoinsToUse(0);
                setFinalAmount(amount);
                return { success: false, discountedPrice: amount };
            }
        }

        return { success: true, discountedPrice: finalAmount };
    }, [
        dispatch,
        useFanCoinsChecked,
        fanCoinsToUse,
        authUser,
        amount,
        finalAmount
    ]);

    // Payment submission logic
    // Updated handleSubmit function with intent API call
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            console.error('Stripe not loaded');
            alert('Payment system is not ready. Please try again.');
            return;
        }

        try {
            // First apply fan coins if selected
            const fanCoinResult = await handleFanCoinUsage();

            if (!fanCoinResult.success) {
                console.error('Fan coin application failed');
                return;
            }

            // Create or update payment intent with final amount
            const intentResult = await dispatch(createPaymentIntent({
                items,
                amount: finalAmount,
                orderId,
                // Add any additional metadata you need
                metadata: {
                    fanCoinsUsed: fanCoinsToUse,
                    originalAmount: amount,
                    discountApplied: amount - finalAmount,
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

            // Confirm the payment with Stripe
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
                    finalAmount: finalAmount
                }));

                // Handle verification result
                if (verifyPayment.fulfilled.match(verificationResult)) {
                    // if (fromCartPage) {
                    //     dispatch(clearCart());
                    // }

                    alert("Payment Successful!");

                    if (onPaymentSuccess && typeof onPaymentSuccess === 'function') {
                        onPaymentSuccess({
                            paymentIntentId: paymentIntent.id,
                            amount: finalAmount,
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

    // Reset states when amount changes
    useEffect(() => {
        setUseFanCoinsChecked(false);
        setFanCoinsToUse(0);
        setFinalAmount(amount);
        setIsPaymentIntentCreated(false);
    }, [amount]);

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
            <div className="fan-coin-section bg-gray-800 p-4 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="useFanCoins"
                            checked={useFanCoinsChecked}
                            onChange={(e) => handleFanCoinCheckboxChange(e.target.checked)}
                            // disabled={!authUser || !fanCoins || fanCoins <= 0}
                            className="mr-2 text-purple-600 focus:ring-purple-500 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <label
                            htmlFor="useFanCoins"
                            className={`text-white flex items-center ${(!authUser || !fanCoins || fanCoins <= 0) ? 'text-gray-500' : ''}`}
                        >
                            Use Fan Coins
                            <span className="ml-2 text-sm text-gray-400">
                                {!authUser
                                    ? "(Login to use Fan Coins)"
                                    : (!fanCoins || fanCoins <= 0)
                                        ? "(No Fan Coins available)"
                                        : `(Available: ${fanCoins})`
                                }
                            </span>
                        </label>
                    </div>
                    {useFanCoinsChecked && (
                        <div className="text-sm text-green-400">
                            1 Fan Coin = $1 Discount
                        </div>
                    )}
                </div>

                {useFanCoinsChecked && (
                    <div className="relative mt-3">
                        <input
                            type="number"
                            value={fanCoinsToUse}
                            onChange={(e) => {
                                const inputValue = parseFloat(e.target.value) || 0;
                                const maxApplicableCoins = Math.min(fanCoins, amount);

                                // Validate input: cannot exceed available fan coins or game price
                                const validatedCoins = Math.max(0, Math.min(inputValue, maxApplicableCoins));

                                // Always update both states together
                                setFanCoinsToUse(validatedCoins);
                                setFinalAmount(Math.max(0, amount - validatedCoins));
                            }}
                            onBlur={(e) => {
                                // On blur, ensure the input field shows the validated value
                                const inputValue = parseFloat(e.target.value) || 0;
                                const maxApplicableCoins = Math.min(fanCoins, amount);
                                const validatedCoins = Math.max(0, Math.min(inputValue, maxApplicableCoins));

                                // Force update the input value to match the validated state
                                if (validatedCoins !== inputValue) {
                                    e.target.value = validatedCoins;
                                    setFanCoinsToUse(validatedCoins);
                                    setFinalAmount(Math.max(0, amount - validatedCoins));
                                }
                            }}
                            min="0"
                            max={Math.min(fanCoins, amount)}
                            step="1"
                            className="w-full p-2 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-purple-400 focus:ring-purple-500"
                            placeholder={`Max: ${Math.min(fanCoins, amount)}`}
                        />
                        <div className="text-xs text-gray-400 mt-1">
                            Available: {fanCoins} Fan Coins | Max Applicable: {Math.min(fanCoins, amount)}
                            {fanCoinsToUse > 0 && (
                                <span className="text-green-400 ml-2">
                                    Discount: ${fanCoinsToUse} | Final: ${finalAmount.toFixed(2)}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Pay Button */}
            <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#621df2] to-[#b191ff] text-white font-semibold py-3 rounded-xl active:scale-95 transition transform hover:shadow-[0_0_15px_#621df2]"
                disabled={!stripe}
            >
                {useFanCoinsChecked && fanCoinsToUse > 0
                    ? `Pay $${finalAmount.toFixed(2)} (${fanCoinsToUse} Fan Coins Applied)`
                    : `Pay $${amount.toFixed(2)}`
                }
            </button>
        </form>
    );
};

export default PaymentForm;