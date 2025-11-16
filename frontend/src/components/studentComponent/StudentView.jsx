import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'
import { ToastContainer } from 'react-toastify'

const StudentView = () => {
    return (
        <div>
            <ToastContainer position='top-right' autoClose={2000} />
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}

export default StudentView