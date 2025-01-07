import mongoose from "mongoose";

const connectMongo = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log("MongoDB already connected.");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME, 
        });
        console.log("MongoDB connected successfully.");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error; 
    }
};

export default connectMongo; 