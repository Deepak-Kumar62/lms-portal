import { useAuthContext } from '@/contexts/AuthContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuthContext()

    if (loading) {
        return <div>Loading...</div>
    }

    return user ? children : <Navigate to='/auth' replace />
}

export default ProtectedRoute