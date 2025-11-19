import { createContext, useContext } from "react"

const StudentContext = createContext(null)

export const StudentContextProvider = ({ children }) => {
    return (
        <StudentContext.Provider value={{}}>
            {children}
        </StudentContext.Provider>
    )
}

export const useStudentContext = () => useContext(StudentContext)