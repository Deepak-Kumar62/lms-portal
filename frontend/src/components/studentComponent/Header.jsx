import { GraduationCap, TvMinimalPlay } from 'lucide-react';
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button';

const Header = () => {
    const navigate = useNavigate()

    // const location = useLocation()

    // const { resetCredentials } = useContext(AuthContext)

    // const handleLogout = () => {
    //     resetCredentials()
    //     sessionStorage.clear()
    // }

    return (
        <header className="flex items-center justify-between p-4 border-b relative">
            <div className="flex space-x-4 items-center">
                <Link to="" className="flex items-center hover:text-black mr-20">
                    <GraduationCap className="h-8 w-8 mr-4" />
                    <span className="font-extrabold md:text-xl text-[14px]">LMS Learn</span>
                </Link>
                <div className="flex items-center space-x-12">
                    <Link
                        to=""
                        variant="ghost"
                        className="text-[14px] md:text-[16px] font-medium hover:text-gray-600"
                    >
                        Explore Courses
                    </Link>

                    <Link
                        to="/about"
                        variant="ghost"
                        className="text-[14px] md:text-[16px] font-medium hover:text-gray-600"
                    >
                        About Us
                    </Link>

                    <Link
                        to="/contact"
                        variant="ghost"
                        className="text-[14px] md:text-[16px] font-medium hover:text-gray-600"
                    >
                        Contact Us
                    </Link>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex gap-4 items-center">
                    <div
                        onClick={() => navigate("/student-courses")}
                        className="flex cursor-pointer items-center gap-1"
                    >
                        <span className="font-extrabold md:text-xl text-[14px]">My Courses</span>
                        <TvMinimalPlay className="w-8 h-8 cursor-pointer" />
                    </div>
                    <Button>Sign Out</Button>
                </div>
            </div>
        </header>
    )
}

export default Header