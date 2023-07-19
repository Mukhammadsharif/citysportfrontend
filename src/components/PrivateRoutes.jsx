import { Navigate, Outlet } from 'react-router-dom'
import { isAuthenticated } from '../tools/auth'

const PrivateRoutes = () => {
    return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoutes
