import { Milestone,DailyTask,WeeklyTask,EarnTask } from "../models/Task.model.js";
import { ThrowError } from "../utils/ErrorUtils.js";
import { sendSuccessResponse } from "../utils/ResponseUtils.js";


// create daily task

export const createDailyTask = async(req,res)=>{
    try {
        const {title,reward,limit} = req.body;
        const dailytask = await DailyTask.create({
            title,reward,limit
        })
        return sendSuccessResponse(res,"Daily Task Created Successfully",dailytask)
    } catch (error) {
        return ThrowError(res,500,error.message)
    }
}


// create weekly task

export const createWeeklyTask = async(req,res)=>{
    try {
        const {title,reward,limit} = req.body;
        const weeklyTask = await WeeklyTask.create({
            title,reward,limit
        })
        return sendSuccessResponse(res,"Weekly Task Created Successfully",weeklyTask)
    } catch (error) {
        return ThrowError(res,500,error.message)
    }
}


// create weekly task

export const createEarnTask = async(req,res)=>{
    try {
        const {title,reward,limit} = req.body;
        const earnTask = await EarnTask.create({
            title,reward,limit
        })
        return sendSuccessResponse(res,"Earn Task Created Successfully",earnTask)
    } catch (error) {
        return ThrowError(res,500,error.message)
    }
}


// create weekly task

export const createMilestone = async(req,res)=>{
    try {
        const {title,reward,target} = req.body;
        const milestone = await Milestone.create({
            title,reward,target
        })
        return sendSuccessResponse(res,"Mile Stone Created Successfully",milestone)
    } catch (error) {
        return ThrowError(res,500,error.message)
    }
}




export const getAllTask = async(req,res)=>{
    try {
        const dailytask = await DailyTask.find();
        const weeklytask = await WeeklyTask.find();
        const milestone = await Milestone.find();
        const earntask = await EarnTask.find();

        const data = {
            dailytask:dailytask,
            weeklytask:weeklytask,
            milestone:milestone,
            earntask:earntask
        }
        return sendSuccessResponse(res,"Task Fetch Successfully",data)


    } catch (error) {
        return ThrowError (res,500,error.message);
    }
}