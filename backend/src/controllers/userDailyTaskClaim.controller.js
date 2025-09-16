import UserTaskClaim from '../models/UserDailyTaskClaim.model.js';
import User from '../models/userModel.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/ResponseUtils.js';


// Helper function to migrate old daily object format to new array format
const migrateDailyFormat = async (claim) => {
  if (claim.daily && !Array.isArray(claim.daily)) {
    // Old format: { date: "2025-09-15", claimedTasks: [...] }
    // New format: [{ date: "2025-09-15", claimedTasks: [...] }]
    const oldDaily = claim.daily;
    if (oldDaily.date && oldDaily.claimedTasks) {
      claim.daily = [{ date: oldDaily.date, claimedTasks: oldDaily.claimedTasks }];
    } else {
      claim.daily = [];
    }
    await claim.save();
  }
};

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
      claim = {
        daily: [{ date: today, claimedTasks: [] }],
        weekly: { week: weekStr, claimedTasks: [] },
        milestone: { claimedTasks: [] }
      };
    } else {
      // Migrate old daily format to new format
      await migrateDailyFormat(claim);

      // Initialize daily as array if it doesn't exist
      if (!Array.isArray(claim.daily)) {
        claim.daily = [];
      }

      // Check if today's entry exists, if not create it
      const todayEntry = claim.daily.find(d => d.date === today);
      if (!todayEntry) {
        claim.daily.push({ date: today, claimedTasks: [] });
      }

      // Handle weekly reset only if week changed
      if (!claim.weekly || claim.weekly.week !== weekStr) {
        claim.weekly = { week: weekStr, claimedTasks: [] };
      }

      // Initialize milestone if it doesn't exist
      if (!claim.milestone) {
        claim.milestone = { claimedTasks: [] };
      }
    }

    return sendSuccessResponse(res, 'Fetched claim state', claim);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

// Mark a daily or weekly task as claimed for a user
export const claimTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const { taskId, type,rewards } = req.body; // type: 'daily' | 'weekly' | 'milestone'

    if (!['daily', 'weekly', 'milestone'].includes(type)) {
      return sendErrorResponse(res, 400, 'Invalid type');
    }

    const today = new Date().toISOString().slice(0, 10);
    const now = new Date();
    const year = now.getFullYear();
    const week = getISOWeek(now);
    const weekStr = `${year}-W${week}`;

    let claim = await UserTaskClaim.findOne({ user: userId });
    if (!claim) {
      claim = new UserTaskClaim({ user: userId });
    }

    // Daily (preserve all previous dates)
    if (type === 'daily') {
      // Migrate old format if needed
      await migrateDailyFormat(claim);

      if (!Array.isArray(claim.daily)) {
        claim.daily = [];
      }

      let dayEntry = claim.daily.find(d => d.date === today);
      if (!dayEntry) {
        // Create new entry for today
        claim.daily.push({ date: today, claimedTasks: [taskId] });
      } else {
        // Add task to existing day if not already claimed
        if (!dayEntry.claimedTasks.includes(taskId)) {
          dayEntry.claimedTasks.push(taskId);
        }
      }
    }

    // Weekly
    if (type === 'weekly') {
      if (!claim.weekly) {
        claim.weekly = { week: weekStr, claimedTasks: [taskId] };
      } else {
        // Reset weekly tasks only if it's a new week
        if (claim.weekly.week !== weekStr) {
          claim.weekly = { week: weekStr, claimedTasks: [taskId] };
        } else {
          // Same week, just add the task
          if (!claim.weekly.claimedTasks.includes(taskId)) {
            claim.weekly.claimedTasks.push(taskId);
          }
        }
      }
    }

    // Milestone (never reset)
    if (type === 'milestone') {
      if (!claim.milestone) {
        claim.milestone = { claimedTasks: [taskId] };
      } else {
        if (!claim.milestone.claimedTasks.includes(taskId)) {
          claim.milestone.claimedTasks.push(taskId);
        }
      }
    }

    await claim.save();
    // Add points to user
    const user = await User.findById(userId);
    user.rewards = (user.rewards || 0) + rewards;
    user.rewardsTransactions.push({
      type: 'EARN',
      amount: rewards,
      description: `Task completed: ${type}`,
      date: new Date()
    });

    await user.save();
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

// Mark a daily task as claimed for a user (for today) - Legacy function
export const claimDailyTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const { taskId } = req.body;
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    let claim = await UserTaskClaim.findOne({ user: userId });
    if (!claim) {
      claim = new UserTaskClaim({
        user: userId,
        daily: [{ date: today, claimedTasks: [taskId] }]
      });
    } else {
      // Migrate old format if needed
      await migrateDailyFormat(claim);

      if (!Array.isArray(claim.daily)) {
        claim.daily = [];
      }

      let dayEntry = claim.daily.find(d => d.date === today);
      if (!dayEntry) {
        claim.daily.push({ date: today, claimedTasks: [taskId] });
      } else {
        if (!dayEntry.claimedTasks.includes(taskId)) {
          dayEntry.claimedTasks.push(taskId);
        }
      }
    }

    await claim.save();
    return sendSuccessResponse(res, 'Task claimed for today', claim);
  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};