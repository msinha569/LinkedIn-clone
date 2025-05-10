import cloudinary from "../lib/cloudinary.js";
import { Post } from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import { sendCommentNotificationEmail } from "../emails/emailHandlers.js";


export const getFeedPosts = async(req,res) => {
    try {
        const posts = await Post.find({author: {$in: [...req.user.connections, req.user._id]}})
        .populate("author","name username profilePicture headline")
        .populate("comments.user", "name profilePicture")
        .sort({createdAt: -1})

        res.status(201).json(posts)
    } catch (error) {
        console.log("error in getfeedposts controller",error);
        res.status(500).json({message: "error fetching posts"})
    }
}

export const createPosts = async(req,res) => {
    try {
        
        const {content,image} = req.body
        if(!content) return res.status(400).json({message: "content is required. Only image cant be uploaded."})
        let newPost
        if(image){
            const imageURL = await cloudinary.uploader.upload(image)
            newPost = await Post({
                author: req.user._id,
                content,
                image: imageURL.secure_url
            })
        }else{
            newPost = await Post({
                author: req.user._id,
                content
            })
        }
        await newPost.save()

        res.status(201).json(newPost)
    } catch (error) {
        console.log("error in createposts controller",error);
        res.status(500).json({message: "error creating posts"})
    }
}

export const deletePost = async(req,res) => {
    try {
        const postId = req.params.id
        const userId = req.user._id

        const post = await Post.findById(postId)

        if(!post) return res.status(400).json({message: "post not found"})

        if(post.author.toString() != userId.toString()) return res.status(400).json({message: "you're not authorized to delete this post"})

        if(post.image)
            await cloudinary.uploader.destroy(post.image.split('/').pop().split9('.')[0])
        await Post.findByIdAndDelete(postId)

        res.status(201).json({message: "post deleted"}) //TODO: add a undo feature with a timer
    } catch (error) {
        console.log("error in deletepost",error);
        res.status(500).json({message: "error deleting post"})
    }
}

export const getPostById = async(req,res) => {
    try {
        const postId = req.params.id
        const post = await Post.findById(postId)
        .populate('author', 'username profilePicture name headline')
        .populate('comments.user','name profilePicture username headline')
        if(!post) return res.status(400).json({message: "post not found"})
        
        res.status(201).json(post)
        
    } catch (error) {
        console.log("error in getpostbyid controller",error);
        res.status(500).json({message: "error while fetching this particular post"})
    }
}

export const createComment = async(req,res) => {
    try {
        
        const {content} = req.body
        const postId = req.params.id
        const post = await Post.findByIdAndUpdate(postId, {
            $push: {
                comments: {user: req.user._id, content}
            }
        },{new:true})
        .populate('author','name email username headline profilePicture')

        if(post.author._id.toString() != req.user._id.toString()){   // ._id cuz here author is populated so its a full user obj or else its a objID
            const newNotification =  new Notification({
                recipient: post.author,
                type: "comment",
                relatedUser: req.user._id,
                relatedPost: postId
            })
        

        await newNotification.save()

        try {
          const postUrl = `${process.env.CLIENT_URL}/post/${post._id}`;
          await sendCommentNotificationEmail(
            post.author.email,
            post.author.name,
            req.user.name,  
            content,        
            postUrl  
          ); 
        } catch (error) {
            console.log("error in sending email:",error);
            
        }}

        res.status(201).json(post)
    } catch (error) {
        console.log("error in createcomment controller",error);
        res.status(500).json({message: "server error"})
    }
}

export const likePost = async(req,res) => {
    try {
        const postId = req.params.id
        const post = await Post.findById(postId)
        const userId = req.user._id
        
        if(post.likes.includes(userId)){
            post.likes=post.likes.filter(id => id.toString() != userId)
        }else{
            post.likes.push(userId)

            if(post.author.toString() != userId.toString()){
                const newNotification = new Notification({
                    recipient: post.author,
                    type: "like",
                    relatedUser: userId,
                    relatedPost: postId
                })
                await newNotification.save()
            }
        }
        await post.save()
        res.status(201).json(post)
    } catch (error) {
        console.log("error in likepost controller");
        res.status(500).json({message: "server error"})
    }
}