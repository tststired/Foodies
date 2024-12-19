import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './AuthContext'

const ProtectedRoute = (Component) => {
    const token = localStorage.getItem('token');
    return token ? <Component.Component /> : <Navigate to="/login"/>
}
export default ProtectedRoute;