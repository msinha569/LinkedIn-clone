import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useAuth = () => {
    const queryClient = useQueryClient()
    const {data: authUser,isLoading } = useQuery({
        queryKey: ['authUser'],
        queryFn: async() => {
           try {
             const response = await axiosInstance.get('/auth/me')

             return response.data
           } catch (err) {
            
            if (err.response?.status === 401) {
				toast.error(err.response?.data?.message || "Something went wrong");
				return null;
           }}
        },
        staleTime: 5 * 60 * 1000, // ✅ consider fresh for 5 mins
        cacheTime: 30 * 60 * 1000, // ✅ keep in memory for 30 mins if unused
        refetchOnWindowFocus: false, // ✅ optional, to avoid spam
    })

    const {mutate: logout} = useMutation({
        mutationFn: () => axiosInstance.post('/auth/logout'),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['authUser']})
    })

    const {mutate: signupMutation, isLoading: signupLoading} = useMutation({
        mutationFn: async(data) => {
            const response = await axiosInstance.post('/auth/signup', data)
            return response.data
        },
        onError: (err) => {
            console.log(err);
            
            toast.error(err.response.data.message || "Something unexpected happened")
        },
        onSuccess: () => {
            console.log("success");
            queryClient.invalidateQueries({queryKey: ['authUser']})
            toast.success("Account created successfully")
        }
    })

    const {mutate: loginMutation, isLoading: loginLoading} = useMutation({
        mutationFn: async(data) => {
            const response = await axiosInstance.post('/auth/login',data)
            return response.data
        },
        onError: (err) => {
            console.log(err);
            toast.error(err.response.data.message || "Something unexpected happened")
        },
        onSuccess: () => {
            toast.success("Loggedin Successfully")
            queryClient.invalidateQueries({queryKey: ['authUser']})
        }
    })

    return {authUser,logout,isLoading,signupLoading,signupMutation, loginLoading, loginMutation}
}