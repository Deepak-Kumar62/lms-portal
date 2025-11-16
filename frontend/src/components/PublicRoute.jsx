import { useAuthContext } from '@/contexts/authContext'
import React from 'react'
import { Navigate } from 'react-router-dom'

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuthContext()

    if (loading) {
        return <div>Loading</div>
    }
    
    return !user ? children : <Navigate to="/" replace />
}

export default PublicRoute