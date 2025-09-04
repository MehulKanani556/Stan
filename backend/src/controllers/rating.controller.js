import Rating from "../models/rating.model.js";
import Game from "../models/Games.model.js";
import { sendSuccessResponse, sendBadRequestResponse, sendNotFoundResponse, sendCreatedResponse } from "../utils/ResponseUtils.js";

// Create or update a rating and review
export const createOrUpdateRating = async (req, res, next) => {
    try {
        const { gameId } = req.params;
        const { rating, review } = req.body;
        const userId = req.user._id;
        console.log(gameId, rating, review, userId)
        // Validate input
        if (!rating || rating < 1 || rating > 5) {
            return sendBadRequestResponse(res, "Rating must be between 1 and 5");
        }

        // Check if game exists
        const game = await Game.findById(gameId);
        if (!game) {
            return sendNotFoundResponse(res, "Game not found");
        }

        // Check if user has already rated this game
        let existingRating = await Rating.findOne({ user: userId, game: gameId, isActive: true });
        const isUpdate = !!existingRating;

        if (existingRating) {
            // Update existing rating
            existingRating.rating = rating;
            existingRating.review = review || existingRating.review;
            await existingRating.save();
        } else {
            // Create new rating
            console.log('rating ======================================================>', existingRating);

            existingRating = await Rating.create({
                user: userId,
                game: gameId,
                rating,
                review,
            });
            // await existingRating.save();

        }

        // Update game's average rating and review count
        const ratingStats = await Rating.getAverageRating(gameId);
        const averageRating = Number(ratingStats?.averageRating || 0);
        const totalRatings = Number(ratingStats?.totalRatings || 0);
        const totalRating = Math.round(averageRating * totalRatings * 10) / 10;
        await Game.updateOne(
            { _id: gameId },
            {
                $set: {
                    "reviews.averageRating": averageRating,
                    "reviews.count": totalRatings,
                    "reviews.totalRating": totalRating,
                },
            }
        );
        console.log(ratingStats,averageRating,totalRatings,totalRating)
        // Populate user details for response
        await existingRating.populate("user", "name username profilePic");

        if (isUpdate) {
            return sendSuccessResponse(res, "Rating updated successfully", existingRating);
        }
        return sendCreatedResponse(res, "Rating created successfully", existingRating);
    } catch (error) {
        next(error);
    }
};

export const getAllRatingByGame = async (req, res) => {
    try {
      const { gameId } = req.params; // assuming the gameId comes from route params
      const { sort = "createdAt", order = "desc" } = req.query;
  
      // build sorting object dynamically
      const sortOptions = { [sort]: order === "asc" ? 1 : -1 };
  
      // fetch ratings for the given game
      const ratings = await Rating.find({ game: gameId })
        .populate("user","name profilePic ")// optional: populate user fields
        .sort(sortOptions);
  
      res.status(200).json({
        success: true,
        count: ratings.length,
        data: ratings,
      });
    } catch (error) {
      console.error("Error fetching ratings:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching ratings",
      });
    }
  };
// Get all ratings for a specific game
// export const getGameRatings = async (req, res, next) => {
//     try {
//         const { gameId } = req.params;
//         const { page = 1, limit = 10, sort = "createdAt", order = "desc" } = req.query;

//         // Check if game exists
//         const game = await Game.findById(gameId);
//         if (!game) {
//             return next(createError(404, "Game not found"));
//         }

//         const skip = (page - 1) * limit;
//         const sortOrder = order === "asc" ? 1 : -1;

//         // Build sort object
//         let sortObj = {};
//         if (sort === "rating") {
//             sortObj.rating = sortOrder;
//         } else if (sort === "helpful") {
//             sortObj.helpfulCount = sortOrder;
//         } else {
//             sortObj.createdAt = sortOrder;
//         }

//         const ratings = await Rating.find({ game: gameId, isActive: true })
//             .populate("user", "name username profilePic")
//             .sort(sortObj)
//             .skip(skip)
//             .limit(parseInt(limit));

//         const totalRatings = await Rating.countDocuments({ game: gameId, isActive: true });

//         const ratingStats = await Rating.getAverageRating(gameId);

//         res.status(200).json(createResponse("Ratings retrieved successfully", {
//             ratings,
//             pagination: {
//                 currentPage: parseInt(page),
//                 totalPages: Math.ceil(totalRatings / limit),
//                 totalRatings,
//                 hasNext: page * limit < totalRatings,
//                 hasPrev: page > 1
//             },
//             stats: ratingStats
//         }));
//     } catch (error) {
//         next(error);
//     }
// };

// // Get user's rating for a specific game
// export const getUserGameRating = async (req, res, next) => {
//     try {
//         const { gameId } = req.params;
//         const userId = req.user._id;

//         const rating = await Rating.findOne({ user: userId, game: gameId, isActive: true })
//             .populate("user", "name username profilePic");

//         if (!rating) {
//             return res.status(200).json(createResponse("No rating found for this game", null));
//         }

//         res.status(200).json(createResponse("Rating retrieved successfully", rating));
//     } catch (error) {
//         next(error);
//     }
// };

// // Get all ratings by a specific user
// export const getUserRatings = async (req, res, next) => {
//     try {
//         const { userId } = req.params;
//         const { page = 1, limit = 10 } = req.query;

//         const skip = (page - 1) * limit;

//         const ratings = await Rating.find({ user: userId, isActive: true })
//             .populate("game", "title cover_image category")
//             .sort({ createdAt: -1 })
//             .skip(skip)
//             .limit(parseInt(limit));

//         const totalRatings = await Rating.countDocuments({ user: userId, isActive: true });

//         res.status(200).json(createResponse("User ratings retrieved successfully", {
//             ratings,
//             pagination: {
//                 currentPage: parseInt(page),
//                 totalPages: Math.ceil(totalRatings / limit),
//                 totalRatings,
//                 hasNext: page * limit < totalRatings,
//                 hasPrev: page > 1
//             }
//         }));
//     } catch (error) {
//         next(error);
//     }
// };

// // Mark a review as helpful or not helpful
// export const markReviewHelpful = async (req, res, next) => {
//     try {
//         const { ratingId } = req.params;
//         const { isHelpful } = req.body;
//         const userId = req.user._id;

//         if (typeof isHelpful !== "boolean") {
//             return next(createError(400, "isHelpful must be a boolean value"));
//         }

//         const rating = await Rating.findById(ratingId);
//         if (!rating) {
//             return next(createError(404, "Rating not found"));
//         }

//         // Check if user is trying to mark their own review
//         if (rating.user.toString() === userId.toString()) {
//             return next(createError(400, "You cannot mark your own review as helpful"));
//         }

//         // Check if user has already marked this review
//         const existingMark = rating.helpful.find(
//             mark => mark.user.toString() === userId.toString()
//         );

//         if (existingMark) {
//             // Update existing mark
//             existingMark.isHelpful = isHelpful;
//             existingMark.createdAt = new Date();
//         } else {
//             // Add new mark
//             rating.helpful.push({
//                 user: userId,
//                 isHelpful,
//             });
//         }

//         await rating.save();

//         res.status(200).json(createResponse(
//             `Review marked as ${isHelpful ? "helpful" : "not helpful"}`,
//             { helpfulCount: rating.helpfulCount }
//         ));
//     } catch (error) {
//         next(error);
//     }
// };

// // Update a rating (only by the user who created it)
// export const updateRating = async (req, res, next) => {
//     try {
//         const { ratingId } = req.params;
//         const { rating, review } = req.body;
//         const userId = req.user._id;

//         const existingRating = await Rating.findById(ratingId);
//         if (!existingRating) {
//             return next(createError(404, "Rating not found"));
//         }

//         // Check if user owns this rating
//         if (existingRating.user.toString() !== userId.toString()) {
//             return next(createError(403, "You can only update your own ratings"));
//         }

//         // Validate rating value
//         if (rating && (rating < 1 || rating > 5)) {
//             return next(createError(400, "Rating must be between 1 and 5"));
//         }

//         // Update fields
//         if (rating !== undefined) existingRating.rating = rating;
//         if (review !== undefined) existingRating.review = review;

//         await existingRating.save();

//         // Update game's average rating
//         const ratingStats = await Rating.getAverageRating(existingRating.game);
//         await Game.findByIdAndUpdate(existingRating.game, {
//             "reviews.averageRating": ratingStats.averageRating,
//             "reviews.count": ratingStats.totalRatings,
//             "reviews.totalRating": ratingStats.averageRating * ratingStats.totalRatings
//         });

//         await existingRating.populate("user", "name username profilePic");

//         res.status(200).json(createResponse("Rating updated successfully", existingRating));
//     } catch (error) {
//         next(error);
//     }
// };

// // Delete a rating (only by the user who created it or admin)
// export const deleteRating = async (req, res, next) => {
//     try {
//         const { ratingId } = req.params;
//         const userId = req.user._id;
//         const userRole = req.user.role;

//         const existingRating = await Rating.findById(ratingId);
//         if (!existingRating) {
//             return next(createError(404, "Rating not found"));
//         }

//         // Check if user owns this rating or is admin
//         if (existingRating.user.toString() !== userId.toString() && userRole !== "admin") {
//             return next(createError(403, "You can only delete your own ratings"));
//         }

//         // Soft delete by setting isActive to false
//         existingRating.isActive = false;
//         await existingRating.save();

//         // Update game's average rating
//         const ratingStats = await Rating.getAverageRating(existingRating.game);
//         await Game.findByIdAndUpdate(existingRating.game, {
//             "reviews.averageRating": ratingStats.averageRating,
//             "reviews.count": ratingStats.totalRatings,
//             "reviews.totalRating": ratingStats.averageRating * ratingStats.totalRatings
//         });

//         res.status(200).json(createResponse("Rating deleted successfully"));
//     } catch (error) {
//         next(error);
//     }
// };

// // Get rating statistics for a game
// export const getGameRatingStats = async (req, res, next) => {
//     try {
//         const { gameId } = req.params;

//         // Check if game exists
//         const game = await Game.findById(gameId);
//         if (!game) {
//             return next(createError(404, "Game not found"));
//         }

//         const ratingStats = await Rating.getAverageRating(gameId);

//         // Get rating distribution
//         const ratingDistribution = await Rating.aggregate([
//             {
//                 $match: {
//                     game: new mongoose.Types.ObjectId(gameId),
//                     isActive: true
//                 }
//             },
//             {
//                 $group: {
//                     _id: "$rating",
//                     count: { $sum: 1 }
//                 }
//             },
//             {
//                 $sort: { _id: 1 }
//             }
//         ]);

//         // Format rating distribution
//         const distribution = {};
//         for (let i = 1; i <= 5; i++) {
//             distribution[i] = 0;
//         }
//         ratingDistribution.forEach(item => {
//             distribution[item._id] = item.count;
//         });

//         res.status(200).json(createResponse("Rating statistics retrieved successfully", {
//             averageRating: ratingStats.averageRating,
//             totalRatings: ratingStats.totalRatings,
//             distribution,
//             gameTitle: game.title
//         }));
//     } catch (error) {
//         next(error);
//     }
// };

// Admin: Get all ratings with pagination and filters
export const getAllRatings = async (req, res, next) => {
    try {
        const { sort = "createdAt", order = "desc" } = req.query;

        // Build filter object
        let filter = { isActive: true };
        if (req.query.game) filter.game = req.query.game;
        if (req.query.user) filter.user = req.query.user;
        if (req.query.rating) filter.rating = parseInt(req.query.rating);

        // Build sort object
        let sortObj = {};
        if (sort === "rating") {
            sortObj.rating = order === "asc" ? 1 : -1;
        } else {
            sortObj.createdAt = order === "asc" ? 1 : -1;
        }

        // Fetch all ratings that match the filter and sort criteria
        const allRatings = await Rating.find(filter)
            .populate("user","name profilePic ")
            .populate("game", "title cover_image")
            .sort(sortObj);

        // Limit the results to the first 5 ratings using .slice()
        const ratings = allRatings.slice(0, 5);
        const totalRatings = allRatings.length;

        // The rest of the response logic remains the same
        return sendSuccessResponse(res, "All ratings retrieved successfully", {
            ratings,
            pagination: {
                currentPage: 1, // Always 1, as we are only returning the first 5 ratings
                totalPages: Math.ceil(totalRatings / 5),
                totalRatings,
                hasNext: totalRatings > 5,
                hasPrev: false
            }
        });
    } catch (error) {
        next(error);
    }
};