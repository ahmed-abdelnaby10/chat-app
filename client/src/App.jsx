import React, { Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Chat from './pages/Chat'
import Login from './pages/Login'
import Register from './pages/Register'
import { Container } from "react-bootstrap"
import { ChatContextProvider } from './contexts/ChatContext'
import Account from './pages/Account'
import Friends from './pages/Friends'
import ChangePasswordFrom from './components/account/ChangePasswordFrom'
import { useSelector } from './lib/rtk/index'
import LoadingComponent from './components/Loading'
const NavBar = React.lazy(() => import("./components/NavBar"));

function App() {
  const user = useSelector(state => state.user)
  const location = useLocation()
  const pathname = location.pathname

  return (
    <ChatContextProvider user={user}>
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
          <Route path='/friends' element={<Friends />} />
        </Routes>
      </Container>
    </ChatContextProvider>
  )
}

export default App
