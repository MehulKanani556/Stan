import UserDailyTaskClaim from '../models/UserDailyTaskClaim.model.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/ResponseUtils.js';

// Get daily task claim state for a user (for today)
export const getDailyTaskClaimState = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    let claim = await UserDailyTaskClaim.findOne({ user: userId, date: today });
    if (!claim) {
      claim = { claimedTasks: [] };
    }
    return sendSuccessResponse(res, 'Fetched daily claim state', claim);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

// Mark a daily task as claimed for a user (for today)
export const claimDailyTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const { taskId } = req.body;
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    let claim = await UserDailyTaskClaim.findOne({ user: userId, date: today });
    if (!claim) {
      claim = new UserDailyTaskClaim({ user: userId, date: today, claimedTasks: [taskId] });
    } else {
      if (!claim.claimedTasks.includes(taskId)) {
        claim.claimedTasks.push(taskId);
      }
    }
    await claim.save();
    return sendSuccessResponse(res, 'Task claimed for today', claim);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};
