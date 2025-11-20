import { Routes, Route } from "react-router-dom"
import Home from "./pages/studentPages/Home"
import About from "./pages/studentPages/About"
import Contact from "./pages/studentPages/Contact"
import Dashboard from "./pages/instructorPages/Dashboard"
import StudentView from "./components/studentComponent/StudentView"
import CreateNewCourse from "./pages/instructorPages/CreateNewCourse"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"
import AuthPage from "./pages/AuthPage"
import ExploreCourses from "./pages/studentPages/ExploreCourses"
import MyCourses from "./pages/studentPages/MyCourses"
import CourseDetails from "./pages/studentPages/CourseDetails"
import CapturePaymentAndFinalize from "./pages/studentPages/CapturePaymentAndFinalize"
import PaymentCancel from "./pages/studentPages/PaymentCancel"
import CourseProgress from "./pages/studentPages/CourseProgress"

function App() {
  return (
    <Routes>

      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />

      <Route path="/" element={<StudentView />}>
        <Route path="" element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="explore-courses" element={<ExploreCourses />} />
        <Route path="course/:courseId" element={<CourseDetails />} />
        <Route
          path="my-courses"
          element={
            <ProtectedRoute>
              <MyCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="payment-return"
          element={
            <ProtectedRoute>
              <CapturePaymentAndFinalize />
            </ProtectedRoute>
          }
        />
        <Route
          path="payment-cancel"
          element={
            <ProtectedRoute>
              <PaymentCancel />
            </ProtectedRoute>
          }
        />
        <Route
          path="course-progress/:courseId"
          element={
            <ProtectedRoute>
              <CourseProgress />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path="/instructor"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/create-new-course"
        element={
          <ProtectedRoute>
            <CreateNewCourse />
          </ProtectedRoute>}
      />

      <Route
        path="/instructor/edit-course/:courseId"
        element={
          <ProtectedRoute>
            <CreateNewCourse />
          </ProtectedRoute>}
      />

    </Routes>
  )
}

export default App
