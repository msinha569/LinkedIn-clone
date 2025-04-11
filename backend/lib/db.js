import mongoose from "mongoose";

export const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO)
        .then(() => console.log("db connected"))
        .catch(() => console.log("connection failed"))
        
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}