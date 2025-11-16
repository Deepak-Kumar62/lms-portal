import { Routes, Route } from "react-router-dom"
import Home from "./pages/studentPages/Home"
import About from "./pages/studentPages/About"
import Contact from "./pages/studentPages/Contact"
import Dashboard from "./pages/instructorPages/Dashboard"
import StudentView from "./components/studentComponent/StudentView"

function App() {
  return (
    <Routes>
      <Route path="/" element={<StudentView />}>
        <Route path="" element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      <Route path="/instructor" element={<Dashboard />} />

    </Routes>
  )
}

export default App
