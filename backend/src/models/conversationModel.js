import mongoose from "mongoose";

const ConversationSchema = mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserStan",
        },
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MessageStan",
        },
    ],
});

export default mongoose.model("ConversationStan", ConversationSchema);
