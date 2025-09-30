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

// Helper function to get ISO week number
function getISOWeek(date) {
  const tmp = new Date(date.getTime());
  tmp.setHours(0, 0, 0, 0);
  tmp.setDate(tmp.getDate() + 4 - (tmp.getDay() || 7));
  const yearStart = new Date(tmp.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);
  return weekNo;
}

// Helper function to check daily and weekly task completion
const checkTaskCompletion = (claim) => {
  // Ensure we're working with the document's raw data
  const claimData = claim._doc || claim;
  
  if (!claimData || !claimData.daily || !Array.isArray(claimData.daily)) return { 
    dailyTaskCompletionCount: 0, 
    completedDays: [],
    isWeeklyTaskEligible: false 
  };
  const now = new Date();
  const year = now.getFullYear();
  const week = getISOWeek(now);
  const weekStr = `${year}-W${week}`;

  // Track daily task completion for the current week
  const completedDays = claimData.daily.reduce((acc, dayEntry) => {
    // Ensure we're working with the raw day entry data
    const dayData = dayEntry._doc || dayEntry;
    
    // Check if the day entry is from the current week
    const entryDate = new Date(dayData.date);
    const entryWeek = getISOWeek(entryDate);
    const entryWeekStr = `${entryDate.getFullYear()}-W${entryWeek}`;
    
    // Ensure we're looking at the current week and the day has claimed tasks
    // Each dayData is a unique entry for a date, so even if claimedTasks contains the same taskId,
    // different dates are considered unique completions.
    if (entryWeekStr === weekStr && dayData.claimedTasks && dayData.claimedTasks.length > 0) {
      // Get unique task IDs for this day
      const uniqueTaskIds = [...new Set(dayData.claimedTasks)];
      // Log for debugging: show unique task IDs and the day entry

      // Each day is unique by its date, so push it as a completed day if it has at least 1 claimed task
      // (or keep the >=3 check if you want to require 3 unique tasks per day)
      if (uniqueTaskIds.length >= 3) {
        acc.push({
          date: dayData.date,
          taskCount: uniqueTaskIds.length
        });
      }
    }
    return acc;
  }, []);

  // Check if weekly task for completing 3 daily tasks 5 times is already claimed
  const weeklyTaskCompleted = claimData.weekly && 
    claimData.weekly.week === weekStr && 
    claimData.weekly.claimedTasks &&
    claimData.weekly.claimedTasks.some(taskId => taskId === 'daily_completion_5_days');

  return {
    dailyTaskCompletionCount: completedDays.length,
    completedDays,
    isWeeklyTaskEligible: completedDays.length >= 5 && !weeklyTaskCompleted
  };
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
      
      if (!Array.isArray(claim.weekly)) {
        claim.weekly = [];
      }
      let weekEntry = claim.weekly.find(w => w.week === weekStr);
      if (!weekEntry) {
        claim.weekly.push({ week: weekStr, claimedTasks: [] });
      }
      
      
      // Initialize milestone if it doesn't exist
      if (!claim.milestone) {
        claim.milestone = { claimedTasks: [] };
      }
    }
    
    // Check task completion
    const taskCompletion = checkTaskCompletion(claim);
    
    return sendSuccessResponse(res, 'Fetched claim state', {
      claim: claim._doc || claim,
      taskCompletion
    });
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
      if (!Array.isArray(claim.weekly)) {
        claim.weekly = [];
      }
      
      let weekEntry = claim.weekly.find(w => w.week === weekStr);
      if (!weekEntry) {
        // Create new entry for this week
        claim.weekly.push({ week: weekStr, claimedTasks: [taskId] });
      } else {
        // Add task to existing week if not already claimed
        if (!weekEntry.claimedTasks.includes(taskId)) {
          weekEntry.claimedTasks.push(taskId);
        }
      }
      
      // Special handling for weekly task tracking
      if (taskId === 'daily_completion_5_days') {
        // Check if user has completed 3 daily tasks for 5 days this week
        const taskCompletion = checkTaskCompletion(claim);
        if (!taskCompletion.isWeeklyTaskEligible) {
          return sendErrorResponse(res, 400, 'Not eligible for this weekly task');
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