import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useUsers = (username) => {

    const queryClient = useQueryClient()

    const {data: recommendedUsers} = useQuery({
        queryKey: ['recommendedUsers'],
        queryFn: async() => {
            const response = await axiosInstance.get('/users/suggestions')
            return response.data
        }
    })

	const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
		queryKey: ["userProfile", username],
		queryFn:  async({queryKey}) => {
        // const [,username] = queryKey
         console.log(username);
         
         return  await axiosInstance.get(`/users/${username}`)
        },
        enabled: !!username
	});


    const { mutate: updateProfile } = useMutation({
        mutationFn: async (updatedData) => {   
            return await axiosInstance.put("/users/profile", updatedData);
        },
        onSuccess: () => {
            toast.success("Profile updated successfully");
            queryClient.invalidateQueries(["userProfile", username]);
        },
    });

    return {recommendedUsers,userProfile,isUserProfileLoading,updateProfile}
}