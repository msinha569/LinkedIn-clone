
import { Link } from "react-router-dom";
import { useConnections } from "../services/useConnections";

const FriendRequest = ({ request }) => {

    const {acceptRequest:acceptConnectionRequest, rejectRequest:rejectConnectionRequest} = useConnections()

	return (
		<div className='bg-white rounded-lg shadow p-1 md:p-4 flex items-center justify-between transition-all hover:shadow-md'>
			<div className='flex md:items-center  md:gap-4'>
				<Link to={`/profile/${request.sender.username}`}>
					<img
						src={request.sender.profilePicture || "/avatar.png"}
						alt={request.name}
						className='w-10 h-8 md:w-16 mt-2 mr-2 md:h-16 rounded-full  md:object-cover'
					/>
				</Link>

				<div>
					<Link to={`/profile/${request.sender.username}`} className='font-semibold text-lg'>
						{request.sender.name}
					</Link>
					<p className='text-gray-600'>{request.sender.headline}</p>
				</div>
			</div>

			<div className='space-x-2 space-y-2'>
				<button
					className='bg-primary text-white px-1 md:px-4 py-2 rounded-md hover:bg-primary-dark transition-colors'
					onClick={() => acceptConnectionRequest(request._id)}
				>
					Accept
				</button>
				<button
					className='bg-gray-200 text-gray-800 px-2 md:px-4 py-2 rounded-md hover:bg-gray-300 transition-colors'
					onClick={() => rejectConnectionRequest(request._id)}
				>
					Reject
				</button>
			</div>
		</div>
	);
};
export default FriendRequest;