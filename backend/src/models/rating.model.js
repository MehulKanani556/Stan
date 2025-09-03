import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserStan",
            required: true,
        },
        game: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "game",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        review: {
            type: String,
            maxlength: 1000,
            trim: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
       
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure one user can only rate one game once
ratingSchema.index({ user: 1, game: 1 }, { unique: true });

// Pre-save middleware to calculate helpful count
ratingSchema.pre('save', function(next) {
    this.helpfulCount = this.helpful.length;
    next();
});

// Static method to get average rating for a game
ratingSchema.statics.getAverageRating = async function(gameId) {
    const result = await this.aggregate([
        {
            $match: {
                game: new mongoose.Types.ObjectId(gameId),
                isActive: true
            }
        },
        {
            $group: {
                _id: null,
                averageRating: { $avg: "$rating" },
                totalRatings: { $sum: 1 }
            }
        }
    ]);
    
    return result.length > 0 ? {
        averageRating: Math.round(result[0].averageRating * 10) / 10,
        totalRatings: result[0].totalRatings
    } : { averageRating: 0, totalRatings: 0 };
};

// Instance method to check if user has already rated
ratingSchema.methods.hasUserRated = function(userId) {
    return this.user.toString() === userId.toString();
};

export default mongoose.model("Rating", ratingSchema);
