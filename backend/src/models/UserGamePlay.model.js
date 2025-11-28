import mongoose from "mongoose";


const UserGamePlaySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }, 
  time:[
    {
        date:{
            type: Date,
        },
        durationMinutes:{
            type: Number,
            default: 0
        }
    }
  ]

}, { timestamps: true });

export default mongoose.model('UserGamePlay', UserGamePlaySchema);

 