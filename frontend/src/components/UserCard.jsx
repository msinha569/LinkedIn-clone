import { Link } from "react-router-dom";
import { useConnections } from "../services/useConnections";

function UserCard({ user, isConnection }) {
	const {removeConnection, sendConnectionRequest} = useConnections()
	const handleRemoveConnection = async() => {
		await removeConnection(user._id)
	}
	const handleSendConnectionRequest = async() => {
		await sendConnectionRequest(user._id)
	}
	return (
		<div className='bg-white rounded-lg shadow p-4 flex flex-col items-center transition-all hover:shadow-md'>
			<Link to={`/profile/${user.username}`} className='flex flex-col items-center'>
				<img
					src={user.profilePicture || "/avatar.png"}
					alt={user.name}
					className='w-24 h-24 rounded-full object-cover mb-4'
				/>
				<h3 className='font-semibold text-lg text-center'>{user.name}</h3>
			</Link>
			<p className='text-gray-600 text-center'>{user.headline}</p>
			<p className='text-sm text-gray-500 mt-2'>{user.connections?.length} connections</p>
			<button 
			onClick={isConnection ? () => handleRemoveConnection() : () => handleSendConnectionRequest()}
			className='mt-4 bg-red-300 text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors w-full'>
				{isConnection ? "Remove" : "Connect"}
			</button>
		</div>
	);
}

export default UserCard;