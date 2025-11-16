import React from "react";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
    return (
        <footer className="bg-black text-white py-12 mt-16">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
                {/* Brand Section */}
                <div>
                    <h2 className="text-2xl font-bold mb-3">LMS Learn</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Empowering learners across the globe with world-class education. Join Edvik Online Academy and start your journey today.
                    </p>
                </div>

                {/* Explore Section */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Explore</h3>
                    <ul className="space-y-3 text-gray-300 text-sm">
                        <li><a href="#" className="hover:text-purple-400">Home</a></li>
                        <li><a href="#" className="hover:text-purple-400">Courses</a></li>
                        <li><a href="#" className="hover:text-purple-400">About Us</a></li>
                        <li><a href="#" className="hover:text-purple-400">Contact</a></li>
                    </ul>
                </div>

                {/* Contact Section */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Contact</h3>
                    <ul className="space-y-3 text-gray-300 text-sm">
                        <li className="flex items-center gap-2">
                            <Mail size={16} /> support@edvikacademy.com
                        </li>
                        <li className="flex items-center gap-2">
                            <Phone size={16} /> +91 98765 43210
                        </li>
                        <li className="flex items-center gap-2">
                            <MapPin size={16} /> Ludhiana, Punjab, India
                        </li>
                    </ul>
                </div>

                {/* Newsletter Section */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
                    <p className="text-gray-400 text-sm mb-3">
                        Subscribe to get the latest updates and free lessons.
                    </p>
                    <div className="flex items-center gap-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 rounded-md bg-gray-800 text-sm text-white focus:outline-none"
                        />
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                            Subscribe
                        </Button>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between px-6 max-w-7xl mx-auto">
                <p className="text-gray-400 text-sm text-center md:text-left">
                    © {new Date().getFullYear()} LMS Learn. All rights reserved.
                </p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <a href="#" className="hover:text-purple-400"><Facebook size={18} /></a>
                    <a href="#" className="hover:text-purple-400"><Twitter size={18} /></a>
                    <a href="#" className="hover:text-purple-400"><Instagram size={18} /></a>
                    <a href="#" className="hover:text-purple-400"><Linkedin size={18} /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
