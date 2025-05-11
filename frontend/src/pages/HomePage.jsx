import {  Users } from 'lucide-react';
import React from 'react'
import Post from '../components/Post';
import Sidebar from '../components/Sidebar';
import PostCreation from '../components/PostCreation';
import RecommendedUser from '../components/RecommendedUser';
import { useAuth } from '../services/useAuth';
import { usePosts } from '../services/usePosts';
import { useUsers } from '../services/useUsers';

const HomePage = () => {
  const {authUser} = useAuth()
  const {posts} = usePosts()
  const {recommendedUsers} = useUsers()
  
  return (
		<div className='flex justify-center lg:grid lg:grid-cols-4 gap-6'>
			<div className='hidden lg:block lg:col-span-1'>
				<Sidebar user={authUser} />
			</div>

			<div className='col-span-1 lg:col-span-2 order-first lg:order-none'>
				<PostCreation user={authUser} />

				{posts?.map((post) => (
					<Post key={post._id} post={post} />
				))}

				{posts?.length === 0 && (
					<div className='bg-white rounded-lg shadow p-8 text-center'>
						<div className='mb-6'>
							<Users size={64} className='mx-auto text-blue-500' />
						</div>
						<h2 className='text-2xl font-bold mb-4 text-gray-800'>No Posts Yet</h2>
						<p className='text-gray-600 mb-6'>Connect with others to start seeing posts in your feed!</p>
					</div>
				)}
			</div>

			{recommendedUsers?.length > 0 && (
				<div className='col-span-1 lg:col-span-1 hidden lg:block'>
					<div className='bg-secondary rounded-lg shadow p-4'>
						<h2 className='font-semibold mb-4'>People you may know</h2>
						{recommendedUsers?.map((user) => (
							<RecommendedUser key={user._id} user={user} />
						))}
					</div>
				</div>
			)}
		</div>
	);

}

export default HomePage
