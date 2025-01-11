import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ACCESS_TOKEN } from '../utils/services';
import Cookies from 'js-cookie';
import LoadingComponent from "../components/Loading"
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from '../lib/rtk/index';
import { setIsAuthenticated } from '../lib/rtk/slices/authSlice';
import { removeUser } from '../lib/rtk/slices/userSlice';

const AuthGuard = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const isAuthenticated = useSelector(state => state.isAuthenticated)
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        const accessToken = Cookies.get(ACCESS_TOKEN);
        if ((accessToken === undefined || !accessToken) && (!location.pathname.includes("login") && !location.pathname.includes("register"))) {
            navigate('/login');
        } else {
            setIsLoading(true)
        }
    }, [navigate, location.pathname, isAuthenticated]);

    useEffect(() => {
        const accessToken = Cookies.get(ACCESS_TOKEN);
        if (accessToken === undefined || !accessToken) {
            dispatch(setIsAuthenticated(false))
            dispatch(removeUser())
        }
    }, [dispatch])

    if (!isLoading) {
        return <LoadingComponent />;
    }

    return <>{children}</>;
};

AuthGuard.propTypes = {
    children: PropTypes.node.isRequired,
};


export default AuthGuard;