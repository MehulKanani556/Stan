import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserStan',
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserStan',
        required: true,
    },
    message: {
        type: String,
    },
    messageImage: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model('MessageStan', messageSchema);