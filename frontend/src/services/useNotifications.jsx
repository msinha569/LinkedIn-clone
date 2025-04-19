import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "../lib/axios";
import { useAuth } from "./useAuth";
import toast from "react-hot-toast";

export const useNotifications = () => {
    const {authUser} = useAuth()
    const queryClient = useQueryClient()
    const {data: notifications=[], isLoading: loadingNotifications} = useQuery({
        queryKey: ['notifications'],
        queryFn: async() => {
            try {
               const response = await axiosInstance.get('/notifications')
               return response.data 
            } catch (err) {
                if (err.response?.status === 401) return null;
				toast.error(err.response?.data?.message || "Something went wrong");
				return null;
            }
        },
        enabled: !!authUser
    })
    const unreadNotificationCount = notifications.length

    const {mutate: markAsReadMutation} = useMutation({
        mutationFn: async(id) => {
            await axiosInstance.put(`/notifications/${id}/read`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['notifications']})
        }
    })

    const {mutate: deleteNotificationMutation} = useMutation({
        mutationFn: async(id) => {
            await axiosInstance.delete(`/notifications/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['notifications']})
        }
    })
    return {notifications,unreadNotificationCount, deleteNotificationMutation,markAsReadMutation, loadingNotifications}
}

