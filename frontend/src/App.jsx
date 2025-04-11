import React from 'react'
import Layout from './components/layout'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/auth/HomePage'
import SignupPage from './pages/auth/SignupPage'
import LoginPage from './pages/auth/LoginPage'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './lib/axios'
import toast from 'react-hot-toast'

const App = () => {
  
  const {data: authUser} = useQuery({
    queryFn: async() => {
      try {
        const response = await axiosInstance.get('/auth/me')
        return response.data
      } catch (error) {
        if (error.response && error.response.status===401) return null;
  
        toast.error(error.response.data.message || 'Something went wrong')
      }
    },
    queryKey: ['authUser']
  })
  console.log(authUser);
  
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
      </Routes>
    </Layout>
  )
}

export default App
