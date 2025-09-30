import mongoose from 'mongoose';


const userTaskClaimSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'UserStan', required: true },
  daily: [
    {
      date: { type: String }, // YYYY-MM-DD
      claimedTasks: [{ type: String }]
    }
  ],
  weekly: [{
    week: { type: String }, // e.g. 2025-W38
    claimedTasks: [{ type: String }]
  }],
  milestone: {
    claimedTasks: [{ type: String }]
  }
}, { timestamps: true });

userTaskClaimSchema.index({ user: 1 }, { unique: true });

export default mongoose.model('UserTaskClaim', userTaskClaimSchema);
