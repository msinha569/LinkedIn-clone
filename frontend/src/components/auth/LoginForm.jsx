import { Loader } from 'lucide-react';
import React, { useState } from 'react'
import { useAuth } from '../../services/useAuth';

const LoginForm = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const {loginMutation, loginLoading: isLoading} = useAuth()
    const handleSubmit = (e) => {
        e.preventDefault()
        loginMutation({username, password})
    }
    return (
		<form onSubmit={handleSubmit} className='space-y-4 w-full max-w-md'>
			<input
				type='text'
				placeholder='Username'
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
			<input
				type='password'
				placeholder='Password'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className='input input-bordered w-full'
				required
			/>

			<button type='submit' className='btn btn-primary w-full'>
				{isLoading ? <Loader className='size-5 animate-spin' /> : "Login"}
			</button>
		</form>
	);
}

export default LoginForm
