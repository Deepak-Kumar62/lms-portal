import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './contexts/authContext'
import { InstructorContextProvider } from './contexts/InstructorContext'
import { StudentContextProvider } from './contexts/StudentContext'

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <AuthContextProvider>
      <StudentContextProvider>
        <InstructorContextProvider>
          <App />
        </InstructorContextProvider>
      </StudentContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
)

/**
 <AuthContextProvider>
  <InstructorContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </InstructorContextProvider>
</AuthContextProvider>
    This is WRONG, because both context providers are OUTSIDE <BrowserRouter>, and therefore:

    useNavigate()
    useLocation()
    useParams()
        will NOT work inside your context providers.
 */