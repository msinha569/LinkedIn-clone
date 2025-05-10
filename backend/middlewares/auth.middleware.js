import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from 'dotenv'

dotenv.config()

export const protectRoute = async(req,res,next) => {
    try {
        
        const token = req.cookies['jwt-linkedin']
        
        if(!token) return res.status(400).json({message: "no token found-you're not logged in"})
            
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)                
            
        const user = await User.findById(decodedToken.userId).select('-password')
        if(!user) return res.status(400).json({message: "user not found"})
            
        req.user=user
        next()
    } catch (error) {
        console.log("Error in auth middleware:", error);

        if (error.name === 'TokenExpiredError') {
            console.log("the line is being executed");
            
            return res
            .status(401)
            .set('linkedin-Token-Expired', 'true')
            .json({ message: "Access token expired" });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid access token" });
        } else {
            return res.status(500).json({ message: "Server error with token" });
        }
    }
}