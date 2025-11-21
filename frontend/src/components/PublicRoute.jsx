import { useAuthContext } from '@/contexts/AuthContext'
import React from 'react'
import { Navigate } from 'react-router-dom'

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuthContext()

    if (loading) {
        return <div className='text-center mt-5 text-2xl min-h-screen'>Loading</div>
    }

    if (user) {
        return user.role === "instructor"
            ? <Navigate to="/instructor" replace />
            : <Navigate to="/" replace />
    }

    return children
}

export default PublicRoute