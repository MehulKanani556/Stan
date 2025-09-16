import { Milestone, DailyTask, WeeklyTask, EarnTask } from "../models/Task.model.js";
import { ThrowError } from "../utils/ErrorUtils.js";
import { sendSuccessResponse } from "../utils/ResponseUtils.js";
import LoggingHistoryModal from '../models/LoggingHistoryModal.js';
import UserGamePlayModal from "../models/UserGamePlay.model.js";
// create daily task

export const createDailyTask = async (req, res) => {
    try {
        const { title, reward, limit } = req.body;
        const dailytask = await DailyTask.create({
            title, reward, limit
        })
        return sendSuccessResponse(res, "Daily Task Created Successfully", dailytask)
    } catch (error) {
        return ThrowError(res, 500, error.message)
    }
}


// create weekly task

export const createWeeklyTask = async (req, res) => {
    try {
        const { title, reward, limit } = req.body;
        const weeklyTask = await WeeklyTask.create({
            title, reward, limit
        })
        return sendSuccessResponse(res, "Weekly Task Created Successfully", weeklyTask)
    } catch (error) {
        return ThrowError(res, 500, error.message)
    }
}


// create weekly task

export const createEarnTask = async (req, res) => {
    try {
        const { title, reward, limit } = req.body;
        const earnTask = await EarnTask.create({
            title, reward, limit
        })
        return sendSuccessResponse(res, "Earn Task Created Successfully", earnTask)
    } catch (error) {
        return ThrowError(res, 500, error.message)
    }
}


// create weekly task

export const createMilestone = async (req, res) => {
    try {
        const { title, reward, target } = req.body;
        const milestone = await Milestone.create({
            title, reward, target
        })
        return sendSuccessResponse(res, "Mile Stone Created Successfully", milestone)
    } catch (error) {
        return ThrowError(res, 500, error.message)
    }
}




export const getAllTask = async (req, res) => {
    try {
        const dailytask = await DailyTask.find();
        const weeklytask = await WeeklyTask.find();
        const milestone = await Milestone.find();
        const earntask = await EarnTask.find();

        const data = {
            dailytask: dailytask,
            weeklytask: weeklytask,
            milestone: milestone,
            earntask: earntask
        }
        return sendSuccessResponse(res, "Task Fetch Successfully", data)


    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
}

export const getTaskByUser = async (req, res) => {

    try {
        const dailytask = await DailyTask.find();
        const weeklytask = await WeeklyTask.find();
        const milestone = await Milestone.find();
        const earntask = await EarnTask.find();
        const userId = req.user._id
        console.log(userId);
        console.log(dailytask);
    
        let LoggingData = await LoggingHistoryModal.find({ user: userId });

     
        let lastLogging = LoggingData[LoggingData.length - 1]; 
        let lastLoggingDate = new Date(lastLogging.lastLoggingDate);

        let today = new Date();

        let isLoggingToday = lastLoggingDate.getFullYear() === today.getFullYear() &&
            lastLoggingDate.getMonth() === today.getMonth() &&
            lastLoggingDate.getDate() === today.getDate();

        let userGamePlay = await UserGamePlayModal.findOne({ user: userId });

        const timeArray = userGamePlay.time;

       
        function isSameDay(d1, d2) {
            return d1.getFullYear() === d2.getFullYear() &&
                d1.getMonth() === d2.getMonth() &&
                d1.getDate() === d2.getDate();
        }

        
        const totalToday = timeArray
            .filter(entry => isSameDay(new Date(entry.date), today))
            .reduce((sum, entry) => sum + entry.durationMinutes, 0);

        console.log("Total duration for today:", totalToday);
        console.log('timeArray', timeArray);
        const statusMapping = {
            'Login to the app': isLoggingToday,
            'Play any game for 90 minutes': false,
            'Daily Streak Bonus': true
        };


        data.forEach(item => {
            item.status = statusMapping[item.title];
        });

        const userData = await LoggingHistoryModal.find();
        return sendSuccessResponse(res, "Task Fetch Successfully", { userId })
    } catch (error) {
        return ThrowError(res, 500, error.message);
    }
}