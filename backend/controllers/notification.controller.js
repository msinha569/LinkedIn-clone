import  Notification  from "../models/notification.model.js";


export const getUserNotifications = async(req,res) => {
    try {
        const userId = req.user._id
        const notifications = await Notification.find({recipient: userId})
        .populate('relatedUser', 'name username profilePicture')
        .populate('relatedPost', 'content image')

        res.status(201).json(notifications)
    } catch (error) {
        console.log("error in notification controller:",error);
        res.status(500).json({message: "server error"})
    }
}

export const markNotificationAsRead = async(req,res) => {
    try {
        const notificationId = req.params.id 
        const userId = req.user._id

        const notification = await Notification.findOneAndUpdate(
            {recipient: userId, _id: notificationId},
            {read: true},
            {new: true}
        )

        res.status(201).json(notification)
    } catch (error) {
        console.log("error in notification controller:",error);
        res.status(500).json({message: "server error"})
    }
}

export const deleteNotification = async(req,res) => {
    try {
        const notificationId = req.params.id
        const userId = req.user._id

        await Notification.findOneAndDelete(
            {recipient: userId, _id: notificationId}
        )

        res.status(201).json({message: "notification deleted successfully"})
    } catch (error) {
        console.log("error in notification controller:",error);
        res.status(500).json({message: "server error"})
    }
}