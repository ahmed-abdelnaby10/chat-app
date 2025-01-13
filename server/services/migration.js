import mongoose from "mongoose";
import connectDB from "../config/db.js";

(async () => {
    await connectDB()

    const collections = ['messages'];

    for (const collectionName of collections) {
        const collection = mongoose.connection.collection(collectionName);
        await collection.deleteMany({});
        console.log(`Cleared data from ${collectionName} collection`);
    }

    mongoose.disconnect();
})();