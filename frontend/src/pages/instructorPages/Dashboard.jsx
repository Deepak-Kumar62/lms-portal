import InstructorCourses from '@/components/instructorComponent/dashboard/InstructorCourses';
import InstructorDashboard from '@/components/instructorComponent/dashboard/InstructorDashboard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useAuthContext } from '@/contexts/AuthContext';
import { useInstructorContext } from '@/contexts/InstructorContext';
import { fetchAllInstructorCourses } from '@/services/instructorCourseService';
import { BarChart, Book, LogOut, Menu, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // 👈 NEW

  const { instructorCoursesList, setInstructorCoursesList } = useInstructorContext()
  const { handleLogout } = useAuthContext()

  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "Dashboard",
      component: <InstructorDashboard listOfCourses={instructorCoursesList} />,
    },
    {
      icon: Book,
      label: "Courses",
      value: "Courses",
      component: <InstructorCourses listOfCourses={instructorCoursesList} />,
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    },
  ];

  const getAllInstructorCourses = async () => {
    try {
      const response = await fetchAllInstructorCourses()

      if (response?.data?.success) {
        setInstructorCoursesList(response?.data?.data)
      }
    } catch (error) {
      setInstructorCoursesList([])
      toast.error("Something went wrong while courses downloading")
    }
  }

  useEffect(() => {
    getAllInstructorCourses()
  }, [])

  return (
    <div className="flex h-full min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* ================= MOBILE TOP BAR ================= */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white shadow-md z-50 p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Instructor View</h2>
        <Menu
          className="h-6 w-6 cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
      </div>

      {/* ================= MOBILE SIDEBAR ================= */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-40 transform transition-transform duration-300 md:hidden ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Instructor View</h2>
          <nav>
            {menuItems.map((menuItem) => (
              <Button
                className="w-full justify-start mb-2"
                key={menuItem.value}
                variant={activeTab === menuItem.value ? "secondary" : "ghost"}
                onClick={() => {
                  if (menuItem.value === "logout") handleLogout();
                  else setActiveTab(menuItem.value);

                  setMobileMenuOpen(false);
                }}
              >
                <menuItem.icon className="mr-2 h-4 w-4" />
                {menuItem.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* ================= DESKTOP COLLAPSIBLE SIDEBAR ================= */}
      <aside
        className={`bg-white shadow-md hidden md:flex flex-col transition-all duration-300 ${collapsed ? "w-20" : "w-64"
          }`}
      >
        {/* Collapse Button */}
        <div className="flex justify-end p-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronsRight className="h-5 w-5" />
            ) : (
              <ChevronsLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className={`p-4 ${collapsed ? "text-center" : ""}`}>
          {!collapsed && (
            <h2 className="text-2xl font-bold mb-4">Instructor View</h2>
          )}

          <nav>
            {menuItems.map((menuItem) => (
              <Button
                key={menuItem.value}
                variant={activeTab === menuItem.value ? "secondary" : "ghost"}
                className={`w-full flex items-center mb-2 ${collapsed ? "justify-center px-2" : "justify-start"
                  }`}
                onClick={
                  menuItem.value === "logout"
                    ? handleLogout
                    : () => setActiveTab(menuItem.value)
                }
              >
                <menuItem.icon className="h-5 w-5" />
                {!collapsed && <span className="ml-2">{menuItem.label}</span>}
              </Button>
            ))}
          </nav>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-8 mt-16 md:mt-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">{activeTab}</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {menuItems.map((menuItem) => (
              <TabsContent value={menuItem.value} key={menuItem.value}>
                {menuItem.component}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;










// import InstructorCourses from '@/components/instructorComponent/dashboard/InstructorCourses';
// import InstructorDashboard from '@/components/instructorComponent/dashboard/InstructorDashboard';
// import { Button } from '@/components/ui/button'
// import { Tabs, TabsContent } from '@/components/ui/tabs';
// import { BarChart, Book, LogOut } from 'lucide-react';
// import { useState } from 'react';
// import { ToastContainer } from 'react-toastify';

// const Dashboard = () => {
//   const [activeTab, setActiveTab] = useState("Dashboard")

//   const menuItems = [
//     {
//       icon: BarChart,
//       label: "Dashboard",
//       value: "Dashboard",
//       component: <InstructorDashboard listOfCourses={[]} />,
//     },
//     {
//       icon: Book,
//       label: "Courses",
//       value: "Courses",
//       component: <InstructorCourses listOfCourses={[]} />,
//     },
//     {
//       icon: LogOut,
//       label: "Logout",
//       value: "logout",
//       component: null,
//     },
//   ];

//   const handleLogout = () => {

//   }

//   return (
//     <div className="flex h-full min-h-screen bg-gray-100">
//       <ToastContainer position='top-right' autoClose={2000} />
//       <aside className="w-64 bg-white shadow-md hidden md:block">
//         <div className="p-4">
//           <h2 className="text-2xl font-bold mb-4">Instructor View</h2>
//           <nav>
//             {menuItems.map((menuItem) => (
//               <Button
//                 className="w-full justify-start mb-2"
//                 key={menuItem.value}
//                 variant={activeTab === menuItem.value ? "secondary" : "ghost"}
//                 onClick={
//                   menuItem.value === "logout"
//                     ? handleLogout
//                     : () => setActiveTab(menuItem.value)
//                 }
//               >
//                 <menuItem.icon className="mr-2 h-4 w-4" />
//                 {menuItem.label}
//               </Button>
//             ))}
//           </nav>
//         </div>
//       </aside>
//       <main className="flex-1 p-8 overflow-y-auto">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-3xl font-bold mb-8">{activeTab}</h1>
//           <Tabs value={activeTab} onValueChange={setActiveTab}>
//             {menuItems.map((menuItem) => (
//               <TabsContent value={menuItem.value} key={menuItem.value}>
//                 {menuItem.component !== null ? menuItem.component : null}
//               </TabsContent>
//             ))}
//           </Tabs>
//         </div>
//       </main>
//     </div>
//   )
// }

// export default Dashboard