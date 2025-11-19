import { GraduationCap, TvMinimalPlay, Menu, X } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAuthContext } from '@/contexts/authContext';

const Header = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, handleLogout } = useAuthContext()

    return (
        <header className="sticky z-50 top-0 p-4 border-b bg-white shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* ================== LEFT LOGO ================== */}
                <div className="flex items-center">
                    <Link to="/" className="flex items-center hover:text-black">
                        <GraduationCap className="h-8 w-8 mr-3" />
                        <span className="font-extrabold text-lg md:text-xl">LMS Learn</span>
                    </Link>
                </div>

                {/* ================== DESKTOP MENU ================== */}
                <nav className="hidden lg:flex items-center space-x-12 ml-20">
                    <Link
                        to="/home"
                        className="text-sm md:text-[16px] font-medium hover:text-gray-600"
                    >
                        Home
                    </Link>

                    <Link
                        to="/explore-courses"
                        className="text-sm md:text-[16px] font-medium hover:text-gray-600"
                    >
                        Explore Courses
                    </Link>

                    <Link
                        to="/about"
                        className="text-sm md:text-[16px] font-medium hover:text-gray-600"
                    >
                        About Us
                    </Link>

                    <Link
                        to="/contact"
                        className="text-sm md:text-[16px] font-medium hover:text-gray-600"
                    >
                        Contact Us
                    </Link>
                </nav>

                {/* ================== RIGHT DESKTOP SECTION ================== */}
                <div className="hidden lg:flex items-center space-x-6">
                    <div
                        onClick={() => navigate("/my-courses")}
                        className="flex cursor-pointer items-center gap-1 hover:text-gray-700"
                    >
                        <span className="font-semibold md:text-lg">My Courses</span>
                        <TvMinimalPlay className="h-6 w-6" />
                    </div>

                    {!user
                        ? <Button onClick={() => navigate("/auth")}>Sign In</Button>
                        : <Button onClick={() => handleLogout()}>Sign Out</Button>
                    }


                </div>

                {/* ================== MOBILE MENU BUTTON ================== */}
                <button
                    className="lg:hidden flex items-center"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* ================== MOBILE MENU DROPDOWN ================== */}
            {isMenuOpen && (
                <div className="lg:hidden mt-4 bg-white shadow rounded-lg p-4 space-y-4 z-50">

                    <nav className="flex flex-col space-y-4 text-[16px]">
                        <Link
                            to="/explore-courses"
                            className="hover:text-gray-600"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Explore Courses
                        </Link>

                        <Link
                            to="/about"
                            className="hover:text-gray-600"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About Us
                        </Link>

                        <Link
                            to="/contact"
                            className="hover:text-gray-600"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Contact Us
                        </Link>
                    </nav>

                    <div className="border-t pt-4 flex flex-col gap-4">
                        <div
                            onClick={() => {
                                navigate("/my-courses");
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-2 cursor-pointer hover:text-gray-700"
                        >
                            <TvMinimalPlay className="h-6 w-6" />
                            <span className="font-semibold">My Courses</span>
                        </div>

                        {!user
                            ? <Button onClick={() => navigate("/auth")}>Sign In</Button>
                            : <Button onClick={() => handleLogout()}>Sign Out</Button>
                        }
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
