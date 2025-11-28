import mongoose from 'mongoose';

const loggingHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Make sure this matches your user collection name
        required: true
    },
    lastLoggingDate: {
        type: Date,
        default: null
    },
    weeklyLogging: {
        type: Number,
        default: 0
    }
});

const LoggingHistoryModel = mongoose.model('LoggingHistory', loggingHistorySchema);

export default LoggingHistoryModel;