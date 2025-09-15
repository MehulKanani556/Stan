import UserTaskClaim from '../models/UserDailyTaskClaim.model.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/ResponseUtils.js';


// Get task claim state for a user (daily and weekly)
export const getTaskClaimState = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    // Get ISO week string, e.g. 2025-W38
    const now = new Date();
    const year = now.getFullYear();
    const week = getISOWeek(now);
    const weekStr = `${year}-W${week}`;
    let claim = await UserTaskClaim.findOne({ user: userId });
    if (!claim) {
      claim = { daily: { date: today, claimedTasks: [] }, weekly: { week: weekStr, claimedTasks: [] } };
    }
    // Reset if date/week changed
    if (!claim.daily || claim.daily.date !== today) claim.daily = { date: today, claimedTasks: [] };
    if (!claim.weekly || claim.weekly.week !== weekStr) claim.weekly = { week: weekStr, claimedTasks: [] };
    return sendSuccessResponse(res, 'Fetched claim state', claim);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

// Mark a daily or weekly task as claimed for a user
export const claimTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const { taskId, type } = req.body; // type: 'daily' | 'weekly'
    if (!['daily', 'weekly'].includes(type)) return sendErrorResponse(res, 400, 'Invalid type');
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date();
    const year = now.getFullYear();
    const week = getISOWeek(now);
    const weekStr = `${year}-W${week}`;
    let claim = await UserTaskClaim.findOne({ user: userId });
    if (!claim) {
      claim = new UserTaskClaim({ user: userId });
    }
    // Daily
    if (type === 'daily') {
      if (!claim.daily || claim.daily.date !== today) claim.daily = { date: today, claimedTasks: [] };
      if (!claim.daily.claimedTasks.includes(taskId)) claim.daily.claimedTasks.push(taskId);
    }
    // Weekly
    if (type === 'weekly') {
      if (!claim.weekly || claim.weekly.week !== weekStr) claim.weekly = { week: weekStr, claimedTasks: [] };
      if (!claim.weekly.claimedTasks.includes(taskId)) claim.weekly.claimedTasks.push(taskId);
    }
    await claim.save();
    return sendSuccessResponse(res, 'Task claimed', claim);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

// Helper to get ISO week number
function getISOWeek(date) {
  const tmp = new Date(date.getTime());
  tmp.setHours(0, 0, 0, 0);
  tmp.setDate(tmp.getDate() + 4 - (tmp.getDay() || 7));
  const yearStart = new Date(tmp.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);
  return weekNo;
}

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
