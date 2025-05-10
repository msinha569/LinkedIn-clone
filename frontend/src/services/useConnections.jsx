import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "./useAuth"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"


export const useConnections = (userId) => {
    const {authUser} = useAuth()
    const queryClient = useQueryClient()
    const {data: connectionRequests=[]} = useQuery({
        queryKey: ['connectionRequests'],
        queryFn: async() => {
            try {
                const response = await axiosInstance.get('/connections/requests')
                return response.data
            } catch (err) {
                if (err.response?.status === 401) return null;
				toast.error(err.response?.data?.message || "Something went wrong");
				return null;
            }
        },
        enabled: !!authUser
    })
    const unreadConnectionRequestsCount = connectionRequests.length

    const {data: connectionStatus, refetch:refetchConnectionStatus} = useQuery({
        queryKey: ['connectionStatus',userId],
        queryFn: async() => {
            return await axiosInstance.get(`/connections/status/${userId}`)
        },
        enabled: !!userId
    })

    const {mutate: sendConnectionRequest} = useMutation({
        mutationFn: async(userId) => {
            
            await axiosInstance.post(`/connections/requests/${userId}`)
        },
        onSuccess: () => {
            toast.success("Connection request sent successfully")
            queryClient.invalidateQueries({queryKey: ['connectionStatus',userId]})
        },
        onError: (error) => {
            toast.error(error.data.response.message || 'Some error occured')
        }
    })

    const {mutate: acceptRequest} = useMutation({
        mutationFn: async(userId) => {
            await axiosInstance.put(`/connections/accept/${userId}`)
        },
        onSuccess: () => {
            toast.success("Connection request accepted")
            queryClient.invalidateQueries({queryKey: ['connectionStatus'], userId})
        },
        onError: (error) => {
            toast.error(error.data.response.message || 'Some error occured')
        }
    })

    const {mutate: rejectRequest} = useMutation({
        mutationFn: async(userId) => {
            await axiosInstance.put(`/connections/reject/${userId}`)
        },
        onSuccess: () => {
            toast.success("Connection request rejected")
            queryClient.invalidateQueries({queryKey: ['connectionStatus'], userId})
        },
        onError: (error) => {
            toast.error(error.data.response.message || 'Some error occured')
        }
    })

    const { data: connections } = useQuery({
		queryKey: ["connections"],
		queryFn: () => axiosInstance.get("/connections"),
	});

    
    return {connectionRequests,unreadConnectionRequestsCount,rejectRequest,acceptRequest,sendConnectionRequest,connectionStatus,refetchConnectionStatus,connections}
}