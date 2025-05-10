import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendWelcomeEmail } from "../emails/emailHandlers.js"


export const signup = async(req,res) => {
try {
        const {name, username, email, password} = req.body

        if (!name||!password||!username||!email) return res.status(500).json({message: "All the fields are required"})
    
        const existingUser = await User.findOne({
            $or: [{email},{username}]
        })
        if(existingUser) return res.status(400).json({message: "username/email already in use, Try a different one."})
        
        if(password.length < 6) return res.status(400).json({message: "password must be at lteast 6 digits"})
        
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
    
        const user =  new User({
            name,
            email,
            username,
            password:hashedPassword
        })
        
        const token = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save()
        const options = {
            httpOnly: true,
            maxAge: 3*24*60*60*1000,
            sameSite: "strict",
            secure:process.env.NODE_ENV==="production"
        }
    
        res
        .cookie("refresh-linkedin",refreshToken,options)
        .cookie("jwt-linkedin",token,options)
        .status(201)
        .json({message:"user created successfully"})

        const profileUrl = process.env.CLIENT_URL + '/profile/' + user.username

        try {
            await sendWelcomeEmail(user.email,user.name,profileUrl)
        } catch (error) {
            console.log("error in sending email:",error);
            
        }
} catch (error) {
    console.log("error while creating a user:",error);
    res.status(500).json({message:`error while creating user: ${error}`})
}
}
export const login = async(req,res) => {
    const {username,password} = req.body
    try {
        if(!username || !password) return res.status(400).json({message:"all fields are required"})
        
        const existingUser = await User.findOne({username})
        if(!existingUser) return res.status(400).json({message: "no user found with that username"})
    
        const checkPassword = await bcrypt.compare(password,existingUser.password)
        if(!checkPassword) return res.status(400).json({message: "password is incorrect"})
        
        const token = existingUser.generateAccessToken()
        const refreshToken = existingUser.generateRefreshToken()
        existingUser.refreshToken = refreshToken
        await existingUser.save()
        const options={
            httpOnly: true,
            sameSite: "strict",
            secure:process.env.NODE_ENV==="production",
            maxAge: 3*24*60*60*1000
        }
    
        res
        .cookie('jwt-linkedin',token,options)
        .cookie('refresh-linkedin',refreshToken,options)
        .status(201).
        json({message: "loggedin successfully"})
    } catch (error) {
        console.log("error while logging in:",error);
        res.status(500).json({message: "something unexpected happened while logging in"})
    }
}
export const logout = async(req,res) => {
    try {
        const token = req.cookies['jwt-linkedin']
        if(!token) return res.status(400).json({message: "user already logged out"})
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        await User.findByIdAndUpdate(decodedToken.userId,{
            $set: {
                refreshToken: undefined
            }
        },{
            new: true
        })
        const options={
            httpOnly: true,
            sameSite: "strict",
            secure:process.env.NODE_ENV==="production",
            maxAge: 3*24*60*60*1000
        }
    
        res
        .clearCookie('refresh-linkedin',options)
        .clearCookie('jwt-linkedin',options)
        .status(201)
        .json({message:"user logged out successfully"})
    } catch (error) {
        console.log("error while logging out",error);
        res.status(500).json({message: "error while logging out"})
    }
}

export const getUser = async(req,res) => {
    try {
       res.status(201).json(req.user) 
    } catch (error) {
        console.log("error while fetching user info:",error);
        res.status(500).json({message: "error in getting user info"})
    }
}

export const refreshAccessToken = async(req,res) => {    
    try {
        const incomingRefreshToken = req.cookies['refresh-linkedin'] || req.body['refresh-linkedin']
        if (!incomingRefreshToken) return res.status(400).json({message: 'user cant persist session'})

        const decodedToken = jwt.verify(incomingRefreshToken, process.env.JWT_SECRET)

        const user = await User.findById(decodedToken.userId)
        if (!user) return res.status(400).json({message: 'refreshtoken is invalid'})
        if (incomingRefreshToken !== user.refreshToken) {
            return res.status(401).json({ message: "Refresh token mismatch" });
        }
            
        const options={
            httpOnly: true,
            sameSite: "strict",
            secure:process.env.NODE_ENV==="production",
            maxAge: 3*24*60*60*1000
        }
    
        const token = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save()

        return res
        .status(200)
        .cookie('jwt-linkedin',token,options)
        .cookie('refresh-linkedin',refreshToken,options)
        .json({message: 'token refreshed successfully'})

    } catch (error) {
        console.log("Error in refreshAccessToken controller",error);
        res.status(500).json({message: "Server error"})
    }
}