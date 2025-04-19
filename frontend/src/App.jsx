import React from 'react'
import Layout from './components/layout'
import {  Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignupPage from './pages/auth/SignupPage'
import LoginPage from './pages/auth/LoginPage'

import { ProtectedRoute, PublicRoute } from './utils/RouteSetup'
import NotificationsPage from './pages/NotificationsPage'
import NetworkPage from './pages/NetworkPage'
import PostPage from './pages/PostPage'
import ProfilePage from './pages/ProfilePage'

const App = () => {
  
  return (
        <Layout>
          <Routes>
            <Route path='/' element={
            <ProtectedRoute>  
              <HomePage/>
            </ProtectedRoute>
            }/>
            <Route path='/network' element={
            <ProtectedRoute>  
              <NetworkPage/>
            </ProtectedRoute>
            }/>
            <Route path='/post/:postId' element={
            <ProtectedRoute>  
              <PostPage/>
            </ProtectedRoute>
            }/>
            <Route path='/profile/:username' element={
            <ProtectedRoute>  
              <ProfilePage/>
            </ProtectedRoute>
            }/>
            <Route path='/notifications' element={
            <ProtectedRoute>  
              <NotificationsPage/>
            </ProtectedRoute>
            }/>
            <Route path='/signup' element={
              <PublicRoute>
                <SignupPage/>
              </PublicRoute>
            }/>
            <Route path='/login' element={
              <PublicRoute>
                <LoginPage/>
              </PublicRoute>
            }/>
          </Routes>
        </Layout>
  )
}

export default App
