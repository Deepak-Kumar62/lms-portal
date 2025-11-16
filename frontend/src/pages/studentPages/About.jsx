import { Users, BookOpen, Award } from "lucide-react";

const About = () => {
    return (
        <div className="bg-gray-50 text-gray-800 min-h-screen py-16 px-6">
            <div className="max-w-6xl mx-auto text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 text-purple-700">About Edvik Online Academy</h1>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                    At <strong>LMS Learn</strong>, our mission is to make quality education accessible to everyone, everywhere.
                    We believe learning should be flexible, interactive, and affordable — empowering students to shape their future confidently.
                </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
                <div className="bg-white rounded-2xl shadow-md p-8">
                    <Users size={40} className="mx-auto text-purple-600 mb-4" />
                    <h3 className="text-xl font-semibold">100K+ Learners</h3>
                    <p className="text-gray-500 mt-2 text-sm">
                        Students from 50+ countries are growing with us.
                    </p>
                </div>
                <div className="bg-white rounded-2xl shadow-md p-8">
                    <BookOpen size={40} className="mx-auto text-purple-600 mb-4" />
                    <h3 className="text-xl font-semibold">500+ Courses</h3>
                    <p className="text-gray-500 mt-2 text-sm">
                        High-quality lessons crafted by industry experts.
                    </p>
                </div>
                <div className="bg-white rounded-2xl shadow-md p-8">
                    <Award size={40} className="mx-auto text-purple-600 mb-4" />
                    <h3 className="text-xl font-semibold">Certified Programs</h3>
                    <p className="text-gray-500 mt-2 text-sm">
                        Get certified and stand out in your career.
                    </p>
                </div>
            </div>

            {/* Vision Section */}
            <div className="max-w-5xl mx-auto mt-20 text-center">
                <h2 className="text-3xl font-semibold mb-4">Our Vision</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                    We envision a world where anyone can gain the skills they need to succeed — without barriers.
                    With a community of passionate educators and learners, we are building a future of lifelong learning and innovation.
                </p>
            </div>
        </div>
    );
};

export default About;
