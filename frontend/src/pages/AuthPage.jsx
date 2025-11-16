
import CommonForm from "@/components/commonForm/CommonForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInFormControl, signUpFormControl } from "@/config";
import { useAuthContext } from "@/contexts/authContext";

import { GraduationCap } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState("signin")

    const {
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleLogin,
        handleRegister
    } = useAuthContext()

    const handleTabChange = (value) => {
        setActiveTab(value)
    }

    const checkIfSignInFormIsValid = () => {
        return (
            signInFormData &&
            signInFormData.userEmail !== '' &&
            signInFormData.password !== ""
        )
    }

    const checkIfSignUpFormIsValid = () => {
        return (
            signUpFormData &&
            signUpFormData.userName !== "" &&
            signUpFormData.userEmail !== '' &&
            signUpFormData.password !== ""
        )
    }

    return (
        <div className="flex flex-col min-h-screen">
            <ToastContainer position='top-right' autoClose={2000} />
            <header className="bg-white px-4 lg:px-6 h-14 flex items-center border-b">
                <Link to={"/"} className="flex items-center justify-center">
                    <GraduationCap className="h-8 w-8 mr-4" />
                    <span className="font-extrabold text-xl">LMS LEARN</span>
                </Link>
            </header>
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Tabs
                    value={activeTab}
                    defaultValue="signin"
                    className="w-full max-w-md "
                    onValueChange={handleTabChange}
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Sign up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signin">
                        <Card className="p-6 space-y-4">
                            <CardHeader>
                                <CardTitle>Sign in to your account</CardTitle>
                                <CardDescription>Enter your email and password to access your account</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <CommonForm
                                    formControls={signInFormControl}
                                    buttonText={"Sign In"}
                                    formData={signInFormData}
                                    setFormData={setSignInFormData}
                                    isButtonDisabled={!checkIfSignInFormIsValid()}
                                    handleSubmit={handleLogin}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="signup">
                        <Card className="p-6 space-y-4">
                            <CardHeader>
                                <CardTitle>Create a new account</CardTitle>
                                <CardDescription>Enter your details to get started</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <CommonForm
                                    formControls={signUpFormControl}
                                    buttonText={"Sign Up"}
                                    formData={signUpFormData}
                                    setFormData={setSignUpFormData}
                                    isButtonDisabled={!checkIfSignUpFormIsValid()}
                                    handleSubmit={handleRegister}
                                />
                            </CardContent>
                        </Card>

                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
};

export default AuthPage;
