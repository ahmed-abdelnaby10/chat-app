import Spinner from 'react-bootstrap/Spinner';
import useMediaQuery from '../hooks/useMediaQuery';

export default function LoadingComponent() {
    const isSmallScreen = useMediaQuery("(max-width: 1024px)") 
    return (
        <div className={`d-flex h-100 justify-content-center align-items-center flex-grow-1 ${isSmallScreen ? 'w-100' : 'w-50'}`}>
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    )
}