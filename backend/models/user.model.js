import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		profilePicture: {
			type: String,
			default: "",
		},
		bannerImg: {
			type: String,
			default: "",
		},
		headline: {
			type: String,
			default: "unlinked User",
		},
		location: {
			type: String,
			default: "Earth",
		},
		about: {
			type: String,
			default: "Write something eye-catching.",
		},
		skills: [String],
		experience: [
			{
				title: String,
				company: String,
				startDate: Date,
				endDate: Date,
				description: String,
			},
		],
		education: [
			{
				school: String,
				fieldOfStudy: String,
				startYear: Number,
				endYear: Number,
			},
		],
		connections: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		refreshToken: {
			type: String
		}
	},
	{ timestamps: true }
);

userSchema.methods.generateAccessToken = function() {
	 return jwt.sign({
				userId: this._id
			},
				process.env.JWT_SECRET
			,{
				expiresIn: process.env.ACCESS_TOKEN_EXPIRY
			})
}
userSchema.methods.generateRefreshToken = function() {
	return jwt.sign({
		userId: this._id
	},
		process.env.JWT_SECRET,
	{
		expiresIn: process.env.REFRESH_TOKEN_EXPIRY
	})
}
const User = mongoose.model("User", userSchema);

export default User;    