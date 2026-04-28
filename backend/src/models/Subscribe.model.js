import mongoose from 'mongoose';

const subscribeSchema = mongoose.Schema({
    type: {
        type: String,
        default: 'subscription'
    },
    email: {
        type: String,
    },
    subscribe: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model("subscribe", subscribeSchema);