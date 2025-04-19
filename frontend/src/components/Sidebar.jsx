import React from 'react'
import {Link} from 'react-router-dom'
import {Bell, Home, User, UserPlus}  from 'lucide-react'
const Sidebar = ({user}) => {
  return (
    <div className='bg-secondary shadow-lg'>
        <div className='flex flex-col items-center '>
            <div className='rounded-t-2xl text-center'>   
              <img className='rounded-t-2xl' src={user?.bannerImage || '/banner.png'}/>
              
              </div>
            <div className=' flex flex-col items-center mt-[-40px] text-center '>
            <Link 
              to={`/profile/${user?.username}`}>
              <img className='w-24 h-24 ' src={user?.profilePicture || '/avatar.png'}/>
            </Link>   
                <div>
              {user?.name || 'user name'}
                </div>
                <div className=''>
              {user?.headline || 'user specialization'}
                </div>
                <div>
                  {user?.connections.length || 'connections'} connections
                </div>
            </div>
        </div>
            <div>
              <ul>
                <li>
                <Link
								to='/'
								className='flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors'
							>
								<Home className='mr-2' size={20} /> Home
							</Link>
                </li>
                <li>
                <Link
								to='/network'
								className='flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors'
							>
								<UserPlus className='mr-2' size={20} /> My Network
							</Link>
                </li>
                <li>
                <Link
								to='/notifications'
								className='flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors'
							>
								<Bell className='mr-2' size={20} /> Notifications
							</Link>
                </li>
              </ul>             
             </div>
             <div className='border-t border-base-100 p-4'>
              <Link to={`/profile/${user?.username}`} className='text-sm font-semibold'>
                Visit your profile
              </Link>
			</div>
    </div>
  )
}

export default Sidebar
