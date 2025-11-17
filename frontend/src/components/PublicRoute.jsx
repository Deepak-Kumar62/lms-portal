import { useAuthContext } from '@/contexts/authContext'
import React from 'react'
import { Navigate } from 'react-router-dom'

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuthContext()

    if (loading) {
        return <div>Loading</div>
    }

    if (user) {
        return user.role === "instructor"
            ? <Navigate to="/instructor" replace />
            : <Navigate to="/" replace />
    }

    return children
}

export default PublicRoute