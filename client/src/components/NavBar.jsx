import React, { Suspense, useContext } from "react"
import { Container, Nav, Stack, Navbar, Dropdown, DropdownButton } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import ChatContext from "../contexts/ChatContext"
import avatar from "../assets/avatar.svg"
import logo1 from "../assets/talkie-high-resolution-logo-removebg-preview.png"
import { useDispatch, useSelector } from "../lib/rtk/index"
import Cookies from "js-cookie"
import { ACCESS_TOKEN } from "../utils/services"
import toast from 'react-hot-toast'
import { setIsAuthenticated } from "../lib/rtk/slices/authSlice"
import { removeUser } from "../lib/rtk/slices/userSlice"
import LoadingComponent from "./Loading"
const Notifications = React.lazy(() => import("./chats/Notifications"));

export default function NavBar() {
    const user = useSelector(state => state.user)
    const isAuthenticated = useSelector(state => state.isAuthenticated)
    const { updateOnlineUsersAfterLogout } = useContext(ChatContext)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const welcomeUsername = user?.name.includes(" ") ? 
        user?.name.slice(0, user?.name.indexOf(" ")) :
        user?.name

    const handleLogout = async () => {
        try {
            Cookies.remove(ACCESS_TOKEN)
            dispatch(removeUser())
            dispatch(setIsAuthenticated(false))
            navigate("/login");
        } catch (error) {
            console.error(error.message || "There is something went wrong! Try again.")
            toast.error("There is something went wrong! Try again.")
        }
    }

    return (
        <Navbar bg="dark" className="mb-4 position-sticky top-0 z-3" style={{ height: '3.75rem' }}>
            <Container className="position-relative">
                <Link to='/' className="link-light text-decoration-none font-monospace">
                    <Suspense fallback={<LoadingComponent />}>
                        <img src={logo1} alt="llgo" style={{ width: "150px" }}/>
                    </Suspense>
                </Link>
                {
                    user?._id && (
                        <span className="text-warning navbar-welcome-msg">Hey, {welcomeUsername}!</span>
                    )
                }
                <Nav className="dropdown-account-menu-container">
                    <Stack direction="horizontal" gap={3} className="w-100 h-100">
                        {
                            isAuthenticated ? (
                                <>
                                    <Notifications />
                                    <DropdownButton 
                                        className="w-100 h-100"
                                        variant="none"
                                        title={
                                            <Suspense fallback={<LoadingComponent />}>
                                                <img 
                                                    src={user?.media?.preview_url || avatar}
                                                    alt="user-pic"
                                                    height={30}
                                                    width={30}
                                                    className="user-profile-pic"
                                                    loading="lazy"
                                                />
                                            </Suspense>
                                        }
                                        id="dropdown-item-button"
                                    >
                                        <Dropdown.Item  
                                            as="button"
                                            onClick={() => {
                                                navigate("/")
                                            }}
                                        >
                                            Messenger
                                        </Dropdown.Item>
                                        <Dropdown.Item  
                                            as="button"
                                            onClick={() => {
                                                navigate("/account")
                                            }}
                                        >
                                            Account
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            as="button"
                                            onClick={() => {
                                                navigate("/change-password")
                                            }}
                                        >
                                            Change passwords
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item
                                            as="button"
                                            onClick={()=>{
                                                updateOnlineUsersAfterLogout(user)
                                                handleLogout()
                                            }}
                                            className="d-flex align-items-center justify-content-between"
                                        >
                                            Logout
                                            <i className="bi bi-box-arrow-right"></i>
                                        </Dropdown.Item>
                                    </DropdownButton>
                                </>
                            ): (
                                <>
                                    <Link to='/login' className="link-light text-decoration-none">
                                        Login
                                    </Link>
                                    <Link to='/register' className="link-light text-decoration-none">
                                        Register
                                    </Link>
                                </>
                            )
                        }
                    </Stack>
                </Nav>
            </Container>
        </Navbar>
    )
}
