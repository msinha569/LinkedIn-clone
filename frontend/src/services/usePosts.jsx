import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const usePosts = (postID) => {
    const queryClient = useQueryClient()
    const {data: posts} = useQuery({
        queryKey: ['posts'],
        queryFn: async() => {
            const response = await axiosInstance.get('/posts')
            return response.data
        }
    })
    
    const {mutateAsync: createPostMutation, isPending: pendingPostCreation} = useMutation({
        mutationFn: async(postData) => {
            console.log(postData);
            
            const response = await axiosInstance.post('/posts/create', postData,{
                headers: {"Content-Type": "application/json"}
            })
            return response.data    
        },
        onSuccess: () => {
            toast.success("Post created successfully")
            queryClient.invalidateQueries({queryKey: ['posts']})
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Something went wrong")
        }
    })

    const {mutate: deletePost, isPending: isDeletingPost} = useMutation({
        mutationFn: async(postId) => {
            await axiosInstance.delete(`/posts/delete/${postId}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['posts']})
            toast.success("post deleted successfully")
        }
    })

    const {mutate: likePost, isPending: isLikingPost} = useMutation({
        mutationFn: async(postId) => {
            await axiosInstance.post(`/posts/${postId}/like`)
            
        },
        onSuccess: (_,variables) => {
            const postId = variables
            console.log(postId);
            
            queryClient.invalidateQueries({queryKey: ['posts']})
            queryClient.invalidateQueries({queryKey: ['post', postId]})
                
        },
        
    })

    const {mutate: createComment, isPending: isAddingComment} = useMutation({
        mutationFn: async({newComment,postId}) => {
            
            await axiosInstance.post(`/posts/${postId}/comment`,{content:newComment})
        },
        onSuccess: async(postId) => {
            await queryClient.invalidateQueries({queryKey: ['posts', postId]})
            toast.success("comment added successfully")
            console.log("succesfully commented");
            
        },
        onError: (err) => {
            console.log("error for failed comment: ",err);
            
            toast.error(err?.response?.data?.message || "Failed to comment")
        },

        
    })
    const { data: post, isLoading: postLoading } = useQuery({
        queryKey: ["post", postID],
        queryFn: async () => {
            //const [, postID] = queryKey;
            console.log("Fetching single post:", postID);
            const response = await axiosInstance.get(`/posts/${postID}`);
            return response;
        },
        enabled: !!postID,
    });
    
    return {posts,pendingPostCreation,post, postLoading, createPostMutation, createComment, isAddingComment, likePost,isLikingPost, deletePost,isDeletingPost}
}