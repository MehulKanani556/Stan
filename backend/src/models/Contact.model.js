import mongoose from 'mongoose';

const contactSchema = mongoose.Schema({
    type: {
        type: String,
        default: 'contact'
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model("Contact", contactSchema, "subscribes");
