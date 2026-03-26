import mongoose from "mongoose";

const connectDB = async () => {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/perplexity";
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
};

export default connectDB;