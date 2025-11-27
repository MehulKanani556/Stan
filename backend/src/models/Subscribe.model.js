import mongoose from 'mongoose';

const subscribeSchema = mongoose.Schema({
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