import { sendConnectionAcceptedEmail } from "../emails/emailHandlers.js"
import { ConnectionRequest } from "../models/connectionRequest.model.js"
import User from "../models/user.model.js"

export const sendConnectionRequest = async(req,res) => {
    try {
        console.log("here");
        
        const {userId} = req.params
        const senderId = req.user._id;
        console.log("userId",userId);
        console.log("senderid",senderId);
        
        if(userId.toString() == senderId.toString()) return res.status(400).json({message: "you cant send a conn req to yourself"})

        if(req.user.connections.includes(userId)) return res.status(400).json({message: "you are already connected to this person"})

        const existingRequest = await ConnectionRequest.findOne({
            sender: senderId,
            recipient: userId,
            status: "pending"
        })
        if(existingRequest) return res.status(400).json({message: "A connection request already exists"})
        
        const connectionRequest = new ConnectionRequest({
            sender: senderId,
            recipient: userId
        })
        await connectionRequest.save()

        res.status(201).json(connectionRequest)
    } catch (error) {
        console.log("error in connection controller");
        res.status(500).json({message: "server error"})
    }
}

export const acceptConnectionRequest = async(req,res) => {
    try {
        const {requestId} = req.params
        const userId = req.user._id

        const connectionRequest = await ConnectionRequest.findOne(
            {_id: requestId, recipient: userId})
            .populate('sender', 'name email username')
            .populate('recipient', 'name username')

        if (!connectionRequest) return res.status(400).json({message: "No such connection request found"})
        if (connectionRequest.status != 'pending') return res.status(400).json({message: "you cant accept this request"})

        connectionRequest.status = 'accepted'

        await User.findByIdAndUpdate(userId, {$addToSet: {connections: connectionRequest.sender._id}})
        await User.findByIdAndUpdate(connectionRequest.sender._id, {$addToSet: {connections: userId}})

        await connectionRequest.save()

        res.json(201).json({message: "connection accepted successfully"})

        try {
            const senderEmail = connectionRequest.sender.email
            const senderName = connectionRequest.sender.name
            const recipientName = connectionRequest.recipient.name
            const profileUrl = process.env.CLIENT_URL + '/profile/' + connectionRequest.sender.username

            await sendConnectionAcceptedEmail(senderEmail,senderName, recipientName, profileUrl)

        } catch (error) {
            console.log("error sending connectionaccepted email in controller: ",error);
            
        }

    } catch (error) {
        console.log("error in connection controller");
        res.status(500).json({message: "server error"})   
    }
}

export const rejectConnectionRequest = async(req,res) => {
    try {
       const {requestId} = req.params
       const userId = req.user._id

       const request = await ConnectionRequest.findOne({_id: requestId, recipient: userId})
        if(!request) return res.status(400).json({message: "No such request found"})
        
        if(request.status != 'pending') return res.status(400).json({message: "you cant deny this request anymore"})
        
        request.status = 'rejected'
        await request.save()

        res.status(201).json({message: "request rejected"})
    } catch (error) {
        console.log("error in connection handler: ",error);
        res.status(500).json({message: "server error"})
    }
}

export const getConnectionRequests = async(req,res) => {
    try {
        const userId = req.user._id

        const requests = await ConnectionRequest.find({recipient: userId, status:'pending'})
        .populate('sender','username name profilePicture headline connections')

        res.status(201).json(requests)
    } catch (error) {
        console.log("error in connection controller: ",error);
        res.status(500).json({message: "server error"})
    }
}

export const getUserConnections = async(req,res) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId).populate(
			"connections",
			"name username profilePicture headline connections"
		);

		res.status(201).json(user.connections);
    } catch (error) {
        console.log("error in connections controller: ",error);
        res.status(500).json({message: "server error"})
    }
}

export const removeConnection = async(req,res) => {
    try {
        const {userId} = req.params
        const myId = req.user._id
        
        await User.findByIdAndUpdate(myId, {$pull: { connections: userId}})
        await User.findByIdAndUpdate(userId, {$pull: { connections: myId}})

        res.status(201).json({message: "connection removed successfully"})  // TODO - remove that connection from connection model as well
    } catch (error) {
        console.log("error in connections controller: ",error);
        res.status(500).json({message: "server error"})
    }
}


export const getConnectionStatus = async (req, res) => {
	try {
		const targetUserId = req.params.userId;
		const currentUserId = req.user._id;

		const currentUser = req.user;
		if (currentUser.connections.includes(targetUserId)) {
			return res.json({ status: "connected" });
		}

		const pendingRequest = await ConnectionRequest.findOne({
			$or: [
				{ sender: currentUserId, recipient: targetUserId },
				{ sender: targetUserId, recipient: currentUserId },
			],
			status: "pending",
		});

		if (pendingRequest) {
			if (pendingRequest.sender.toString() === currentUserId.toString()) {
				return res.json({ status: "pending" });
			} else {
				return res.json({ status: "received", requestId: pendingRequest._id });
			}
		}

		// if no connection or pending req found
		res.json({ status: "not_connected" });
	} catch (error) {
		console.error("Error in getConnectionStatus controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};