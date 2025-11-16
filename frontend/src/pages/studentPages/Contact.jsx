import CommonForm from "@/components/commonForm/CommonForm";
import { contactFormControls } from "@/config";

import React, { useState } from "react";
import { toast } from "react-toastify";


const Contact = () => {
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    // Step 3: Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            toast.error("Please fill all required fields!");
            return;
        }

        // console.log("Contact form data:", formData);
        toast.success("Message sent successfully!");

        // Reset form
        setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
        });
    };

    return (
        <div className="bg-gray-50 min-h-screen py-16 px-6">
            <div className="max-w-4xl mx-auto text-center mb-10">
                <h1 className="text-4xl font-bold text-purple-700 mb-3">Contact Us</h1>
                <p className="text-gray-600 text-lg">
                    We'd love to hear from you! Whether you have a question about courses, pricing, or anything else, our team is ready to answer.
                </p>
            </div>

            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8">
                <CommonForm
                    handleSubmit={handleSubmit}
                    buttonText="Send Message"
                    formControls={contactFormControls}
                    formData={formData}
                    setFormData={setFormData}
                    isButtonDisabled={false}
                />
            </div>
        </div>
    );
};

export default Contact;
