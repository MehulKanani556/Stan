import mongoose from 'mongoose';

const userDailyTaskClaimSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'UserStan', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  claimedTasks: [{ type: String }] // Array of task IDs claimed for the day
}, { timestamps: true });

userDailyTaskClaimSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model('UserDailyTaskClaim', userDailyTaskClaimSchema);
