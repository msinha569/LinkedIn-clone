import mongoose, { Schema } from "mongoose";


const connectionRequestSchema = new Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: Boolean,
        enum: ['pending','accepted','rejected'],
        default: 'pending'
    }
},{
    timestamps: true
})

export const ConnectionRequest = mongoose.model('ConnectionRequest',connectionRequestSchema)