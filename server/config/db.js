import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config()

const mongoURI = process.env.MONGO_URI

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI)
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export default connectDB