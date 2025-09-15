import mongoose from "mongoose";

// Daily task Schema
const dailytaskSchema = new mongoose.Schema({
  title: String,
  reward:Number,
  limit:String
}, { collection: "dailytask" });

// weekly task Schema
const weeklytaskSchema = new mongoose.Schema({
  title: String,
  reward:Number,
  limit:String
}, { collection: "weeklytask" });

// earn task Schema
const earntaskSchema = new mongoose.Schema({
  title: String,
  reward:Number,
  limit:String
}, { collection: "earntask" });


// Milestone  Schema
const milestoneSchema = new mongoose.Schema({
  title: String,
  reward:Number,
  target:String
}, { collection: "milestone" });

export const DailyTask = mongoose.model("DailyTask", dailytaskSchema);
export const WeeklyTask = mongoose.model("WeeklyTask", weeklytaskSchema);
export const EarnTask = mongoose.model("EarnTask", earntaskSchema);
export const Milestone = mongoose.model("Milestone", milestoneSchema);
