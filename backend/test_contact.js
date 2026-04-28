import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Contact from './src/models/Contact.model.js';

dotenv.config();

const testContact = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("Connected to DB");

        const newContact = await Contact.create({
            name: "Test User Merged",
            email: "test_merged@example.com",
            subject: "Test Subject Merged",
            message: "Test Message Merged"
        });

        console.log("Success:", newContact);
        await mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

testContact();
