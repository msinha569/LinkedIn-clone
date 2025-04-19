import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from 'dotenv'

dotenv.config()

export const protectRoute = async(req,res,next) => {
    try {
        
        const token = req.cookies['jwt-linkedin']
        
        if(!token) return res.status(400).json({message: "no token found-you're not logged in"})
            
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)
        if(!decodedToken) return res.status(400).json({message: "unauthorized access- token not found"})
                
           
            
        const user = await User.findById(decodedToken.userId).select('-password')
        if(!user) return res.status(400).json({message: "user not found"})

        req.user=user
        next()
    } catch (error) {
        console.log("error in auth middleware:",error);
        res.status(500).json({message:"error with token"})
    }
}