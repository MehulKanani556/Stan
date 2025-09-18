import ScratchCard from "../models/ScratchCard.model.js";
import Game from "../models/Games.model.js";
import User from "../models/userModel.js";
import { sendSuccessResponse, sendBadRequestResponse, sendNotFoundResponse, sendCreatedResponse } from "../utils/ResponseUtils.js";

// Function to generate reward based on probability
const generateReward = async (amount) => {
    const randomValue = Math.random();
    
     // Define winning chance based on amount
     let winChance = 0.05; // default 5%
     if (amount >= 2000) {
         winChance = 0.15; // 15% for 2000 or more
     } 
     // Reward probabilities
     if (randomValue < winChance) {
        const winningGames = await Game.find({           
            "platforms.windows.available": true,
            "platforms.windows.download_link": { $exists: true, $ne: null }
        }); // Limit to 5 games to choose from

        if (winningGames.length > 0) {
            const selectedGame = winningGames[Math.floor(Math.random() * winningGames.length)];
            return {
                type: 'game',
                message: 'Congratulations! You won a free game!',
                game: {
                    _id: selectedGame._id,
                    title: selectedGame.title,
                    cover_image: selectedGame.cover_image
                }
            };
        }
    } 

    // 70% chance of "Better luck next time"
    return {
        type: 'message',
        message: 'Better luck next time!'
    };
};

export const createScratchCard = async (req, res) => {
    try {
        const {  type ,amount} = req.body;
        const userId = req.user._id;     

        // Generate a unique code for the scratch card
        const uniqueCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        // Generate reward
        const reward = await generateReward(amount);
 
        const scratchCard = await ScratchCard.create({
            user: userId,           
            uniqueCode,
            reward: reward, // Store as JSON string
            
        });
        // Deduct reward points
        const user = await User.findById(userId);
        user.rewards -= amount;
        user.rewardsTransactions = user.rewardsTransactions || [];
        user.rewardsTransactions.push({
            type: 'SPEND',
            amount: amount,
            description: `Scratch card purchase`,
            date: new Date()
        });
         await user.save();
        return sendCreatedResponse(res, "Scratch card created successfully", scratchCard);
    } catch (error) {
        return sendBadRequestResponse(res, error.message);
    }
};

export const claimScratchCardReward = async (req, res) => {
    try {
        const { cardId } = req.body;
        const userId = req.user._id;

        const scratchCard = await ScratchCard.findOne({ 
            _id: cardId, 
            user: userId,
            isRevealed: true,
            isClaimed: false,
            expiresAt: { $gt: new Date() }
        });

        if (!scratchCard) {
            return sendNotFoundResponse(res, 'Invalid or expired scratch card');
        }

        // Parse the reward
        const reward = scratchCard.reward;

        let claimResult = {};
        switch(reward.type) {
            case 'rewards':
                // Update user's balance
                const user = await User.findById(userId);
                user.rewards = (user.rewards || 0) + reward.points;
                user.rewardsTransactions.push({
                    type: 'EARN',
                    amount: reward.points,
                    description: 'Scratch card reward',
                    date: new Date()
                });
                await user.save();
                
                claimResult = {
                    type: 'rewards',
                    rewards: reward.points,
                    message: reward.message,
                    date: new Date()
                };
                break;
            
            case 'game':
                claimResult = {
                    type: 'game',
                    game: reward.game,
                    message: reward.message,
                    date: new Date()
                };
                break;
            
            default:
                claimResult = {
                    type: 'message',
                    message: reward.message,
                    date: new Date()
                };
        }

        // Mark scratch card as claimed
        scratchCard.isClaimed = true;
        await scratchCard.save();

        return sendSuccessResponse(res, 200, true, 'Reward claimed successfully', claimResult);
    } catch (error) {
        return sendBadRequestResponse(res, 'Error claiming reward', error.message);
    }
};

export const revealScratchCard = async (req, res) => {
    try {
        const { cardId } = req.body;
        const userId = req.user._id;
        const scratchCard = await ScratchCard.findOne({ 
            _id: cardId, 
            user: userId,
            isRevealed: false,
        });
        if (!scratchCard) {
            return sendNotFoundResponse(res, 'Invalid or expired scratch card');
        }
        const randomDays = Math.floor(Math.random() * (9 - 3 + 1)) + 3;

        scratchCard.expiresAt = new Date(Date.now() + randomDays * 24 * 60 * 60 * 1000);
        scratchCard.isRevealed = true;
        await scratchCard.save();
        return sendSuccessResponse(res,  'Scratch card revealed successfully', scratchCard);
    } catch (error) {
        return sendBadRequestResponse(res, 'Error revealing scratch card', error.message);
    }
};


export const getUserScratchCards = async (req, res) => {
    try {
        const userId = req.user._id;
        const scratchCards = await ScratchCard.find({ user: userId }).sort({ createdAt: -1 });
        
        // Populate download link for game rewards
        const enrichedScratchCards = await Promise.all(scratchCards.map(async (card) => {
            if (card.reward && card.reward.type === 'game') {
                const game = await Game.findById(card.reward.game._id);
                if (game && game.platforms && game.platforms.windows) {
                    return {
                        ...card.toObject(),
                        reward: {
                            ...card.reward,
                            game: {
                                ...card.reward.game,
                                download_link: game.platforms.windows.download_link || null
                            }
                        }
                    };
                }
            }
            return card;
        }));

        console.log(userId, enrichedScratchCards);        
        return sendSuccessResponse(res, 'User scratch cards fetched successfully', enrichedScratchCards);
    } catch (error) {
        return sendBadRequestResponse(res, error.message);
    }
};