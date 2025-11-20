import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'
import { ToastContainer } from 'react-toastify'

const StudentView = () => {
    const location = useLocation()
    return (
        <div>
            <ToastContainer position='top-right' autoClose={2000} />
            {!location.pathname.includes("course-progress") ?
                (<Header />) : null
            }
            <Outlet />
            {!location.pathname.includes("course-progress") ?
                (<Footer />) : null
            }
        </div>
    )
}

export default StudentView