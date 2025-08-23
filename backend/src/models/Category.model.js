// import mongoose from "mongoose";
import mongoose from 'mongoose';

const category = new mongoose.Schema({
    categoryName: {
        type: String,
        unique: true
    },
    category_image: {
        url: { type: String },
        public_id: { type: String }
    },
    category_description: {
        type: String,
    }
}, {
    timestamps: true
})

export default mongoose.model('category', category);