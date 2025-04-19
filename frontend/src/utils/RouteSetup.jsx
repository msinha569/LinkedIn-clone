import { Navigate } from "react-router-dom"
import { useAuth } from "../services/useAuth"
import { Loader } from "lucide-react"

export const ProtectedRoute = ({children}) => {
    const {authUser,isLoading} = useAuth()

    if (isLoading) return <Loader className='size-5 animate-spin' />
    
    return authUser ? children : <Navigate to={'/login'}/>
}

export const PublicRoute = ({children}) => {
    const {authUser,isLoading} = useAuth()
    
    if (isLoading) return <Loader className='size-5 animate-spin' />

    return authUser ? <Navigate to={'/'}/> : children
}