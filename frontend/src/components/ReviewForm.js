import React, { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

import { BiCommentDetail } from "react-icons/bi";
import { FaStar } from "react-icons/fa";
import { enqueueSnackbar } from "notistack";
import axiosInstance from "../Utils/axiosInstance";
import { isRejectedWithValue } from "@reduxjs/toolkit";




const ReviewForm = ({ open, onClose, game }) => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            if (onSubmit) {
                onSubmit({ rating, review });
            }
            alert("Review submitted successfully!");
            setFullName("");
            setEmail("");
            setRating(0);
            setReview("");
            setIsLoading(false);
        }, 1000);
    };

    const onSubmit = async ({ rating, review }) => {
        var auth = localStorage.getItem('token');
        try {
            const res = await axiosInstance.post(
                `/ratings/${game}`,
                { rating, review },
                {
                    headers: {
                        Authorization: `Bearer ${auth}` // example
                    }
                }
            );
            console.log(res);
            if (res.data.success) {
                enqueueSnackbar("review added successfully", { variant: "success" });
                onClose();
            }
            return res.data.cart || [];
        } catch (err) {
            // Show specific warning for duplicate items
            enqueueSnackbar(err.response?.data?.message || "Failed to add to cart", { variant: "error" });
            return isRejectedWithValue(err.response?.data?.message || err.message);
        }
    }
    if (!open) return null;
    return (
        <Dialog open={open} onClose={onClose} className="relative z-10">
            <DialogBackdrop className="fixed inset-0 bg-gray-900/50" />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <form
                        onSubmit={handleSubmit}
                        className="md:p-8 p-6 bg-gray-900 rounded-2xl shadow-lg space-y-5 relative"
                    >
                        {/* Close button */}
                        <div className="flex items-center">
                            <p className="m-auto text-2xl font-bold  text-white">Add Review </p>
                            <button
                                type="button"
                                onClick={onClose}
                                className=""
                            >
                                ✕
                            </button>
                        </div>


                        {/* Rating */}
                        <div className="md:p-6 p-3 bg-gray-900 rounded-2xl shadow-lg space-y-5 border border-gray-700">
                            <div className="flex gap-2 items-center justify-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className={`cursor-pointer text-2xl transition ${star <= rating ? "text-yellow-400" : "text-gray-500"
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Review */}
                            <div className="relative group">
                                <BiCommentDetail className="absolute left-3 top-5 text-gray-400" />
                                <div className="p-3 pl-10 rounded-xl border border-gray-700 bg-gray-800 transition-all group-focus-within:border-purple-400 group-focus-within:shadow-[0_0_10px_#621df2]">
                                    <label className="absolute -top-2 left-10 text-xs text-purple-300 bg-gray-900 px-1">
                                        Review
                                    </label>
                                    <textarea
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        placeholder="Write your review..."
                                        className="w-full bg-transparent outline-none text-white placeholder-gray-500 md:w-[300px] w-[180px]"
                                        rows="4"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-[#621df2] to-[#b191ff] text-white font-semibold py-3 rounded-xl active:scale-95 transition transform hover:shadow-[0_0_15px_#621df2]"
                                disabled={isLoading}
                            >
                                {isLoading ? "Submitting..." : "Submit Review"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </Dialog>
    );
};

export default ReviewForm;

