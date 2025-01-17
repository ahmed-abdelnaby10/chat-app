import React, { Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Chat from './pages/Chat'
import Login from './pages/Login'
import Register from './pages/Register'
import { Container } from "react-bootstrap"
import { ChatContextProvider } from './contexts/ChatContext'
import { FriendsContextProvider } from './contexts/FriendsContext'
import Account from './pages/Account'
import Friend from './pages/Friend'
import ChangePasswordFrom from './components/account/ChangePasswordFrom'
import { useSelector } from './lib/rtk/index'
import LoadingComponent from './components/Loading'
import FriendRequests from './pages/FriendRequests'
const NavBar = React.lazy(() => import("./components/NavBar"));

function App() {
  const user = useSelector(state => state.user)
  const location = useLocation()
  const pathname = location.pathname

  return (
    <div onContextMenu={(e)=>{e.preventDefault()}}>
      <ChatContextProvider user={user}>
        <FriendsContextProvider>
          <Suspense fallback={<LoadingComponent />}>
            <NavBar />
          </Suspense>
          <Container className='text-secondary mb-3 d-flex align-items-start justify-content-start flex-column' style={{ minHeight: pathname === "/" ? 'calc(100vh - 7rem)' : 'auto' }}>
            <Routes>
              {/* Auth Routes */}
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              {/* App Routes */}
              <Route path='/' element={<Chat />} />
              <Route path='/account' element={<Account />} />
              <Route path='/change-password' element={<ChangePasswordFrom />} />
              <Route path='/friend/:friendId' element={<Friend />} />
              <Route path='/friend-requests/' element={<FriendRequests />} />
            </Routes>
          </Container>
        </FriendsContextProvider>
      </ChatContextProvider>
    </div>
  )
}

export default App
