import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuth, loginUser, logoutUser, registerUser } from "@/services/authServices";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext(null)

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true) // for initial loading
    const [signInFormData, setSignInFormData] = useState(initialSignInFormData)
    const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData)

    const verifyUser = async () => {
        try {
            const res = await checkAuth()
            setUser(res?.data?.data?.user)
        } catch (error) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const res = await loginUser(signInFormData)
            setUser(res?.data?.data?.user)
            toast.success(res?.data?.message)
        } catch (error) {
            setUser(null)
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            const res = await registerUser(signUpFormData)
            toast.success(res?.data?.message)
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    }

    const handleLogout = async () => {
        try {
            const res = await logoutUser()
            setUser(null)
            toast.success(res?.data?.data?.message)
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    }

    useEffect(() => {
        if (!user) {
            verifyUser()
        }
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            signInFormData,
            setSignInFormData,
            signUpFormData,
            setSignUpFormData,
            handleRegister,
            handleLogin,
            handleLogout
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext)