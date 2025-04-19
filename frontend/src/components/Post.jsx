import { Loader, MessageCircle, Send, Share2, ThumbsUp, Trash2} from 'lucide-react'
import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { usePosts } from '../services/usePosts'
import { useAuth } from '../services/useAuth'
import {formatDistanceToNow} from 'date-fns'
const Post = ({post}) => {
  const {authUser} = useAuth()
 const [comments, setComments] = useState(post?.comments || [])
  const [newComment, setNewComment] = useState('')
  const [showComments, setShowComments] = useState(false)
  const isOwner = authUser._id === post?.author?._id
  const isLiked = post.likes.includes(authUser._id)
  const { createComment, isAddingComment, likePost,isLikingPost, deletePost,isDeletingPost} = usePosts()
  
  const handleDeletePost = () => {
    if (!window.confirm("Do you want to delete this post?")) return
    deletePost(post._id)
  }
  const handleLikePost = () => {
    if (isLikingPost) return
    likePost(post._id)
    
  }

  const handleAddComment = async(e) => {
    e.preventDefault()
    if(newComment.trim()){
      console.log(post._id);
      await createComment({newComment, postId:post._id})
      setNewComment('')
      setComments([
        ...comments,
        {
          content: newComment,
          user: {
            _id: authUser._id,
            profilePicture: authUser.profilePicture,
            name: authUser.name
          },
          createdAt: new Date()
        }
      ])
    }
  }
//  console.log(post._id);
  
  return (
    <div className='bg-secondary rounded space-y-3 p-3 mt-5'>
      <div className='flex justify-between'>
        <Link to={`/profile/${post?.author?.username}`}>
        <div className='flex gap-3'>
          <img 
          className='w-12 h-12'
          src={post.author.profilePicture || '/avatar.png'}/>
          <div className='flex leading-tight flex-col'>
              <div className='font-bold '>{post.author.name}</div>
              <div className='text-sm '>{post.author.headline}</div>
              <div className='text-xs'>{formatDistanceToNow(new Date(post.createdAt),{addSuffix:true})}</div>
          </div>

        </div>
        </Link>
        <div>
          {isOwner && (
            <button 
            onClick={handleDeletePost}
            className='text-red-500 hover:text-red-700'>
              {isDeletingPost ? 
              <Loader size={18} className='animate-spin'/>
              :
              <Trash2 size={18} className='text-red-600'/>}
            </button>

          )}
        </div>
      </div>
      <div className='ml-2 pt-2'>
        {post.content}
      </div>
      {
        post.image && (
          <img 
          onClick={() => window.open(post.image, '_blank')}
          
          className='rounded-lg w-full mb-4 h-52 sm:h-72 cursor-pointer object-scale-down'
          src={post.image}/>
        )
      }
      <div className='flex justify-between cursor-pointer'>
      
        <div 
        onClick={handleLikePost}
        className='flex gap-1'><ThumbsUp className={isLiked? 'text-blue-400 fill-blue-400':''}/>Like ({post.likes.length})</div>

        <div 
        onClick={() => setShowComments(!showComments)}
        className='flex gap-1'><MessageCircle className={showComments? 'text-blue-400 fill-blue-400' : ''}/>Comment ({post.comments.length})</div>

        <div className='flex gap-1'><Share2/>Share</div>
        
      </div>
      {showComments && (
				<div className='px-4 pb-4'>
          
					<form onSubmit={handleAddComment} className='flex items-center'>
						<input
							type='text'
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder='Add a comment...'
							className='flex-grow p-2 rounded-l-full bg-base-100 focus:outline-none focus:ring-primary'
						/>

						<button
							type='submit'
							className='bg-primary text-white p-[10px] rounded-r-full hover:bg-primary-dark transition duration-300'
							disabled={isAddingComment}
						>
							{isAddingComment ? <Loader size={18} className='animate-spin' /> : <Send size={18} />}
						</button>
					</form>

					<div className='mt-4 max-h-60 overflow-y-auto'>
						{post.comments.map((comment) => (
							<div key={comment._id} className='mb-2 bg-base-100 p-2 rounded flex items-start'>
								<img
									src={comment.user.profilePicture || "/avatar.png"}
									alt={comment.user.name}
									className='w-8 h-8 rounded-full mr-2 flex-shrink-0'
								/>
								<div className='flex-grow'>
									<div className='flex items-center mb-1'>
										<span className='font-semibold mr-2 '>{comment.user.name}</span>
										<span className='text-xs'>{formatDistanceToNow(new Date(comment.createdAt),{addSuffix:true})}</span>
									</div>
									<p>{comment.content}</p>
								</div>
							</div>
						))}
					</div>

				</div>
			)}
    </div>
  )
}

export default Post
