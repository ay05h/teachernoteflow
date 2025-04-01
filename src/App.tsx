
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherCourses from "./pages/teacher/Courses";
import TeacherAssignments from "./pages/teacher/Assignments";
import TeacherCreateCourse from "./pages/teacher/CreateCourse";
import TeacherCreateAssignment from "./pages/teacher/CreateAssignment";
import TeacherAssignmentSubmissions from "./pages/teacher/AssignmentSubmissions";
import StudentDashboard from "./pages/student/Dashboard";
import StudentCourses from "./pages/student/Courses";
import StudentAssignments from "./pages/student/Assignments";
import StudentAssignmentDetail from "./pages/student/AssignmentDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
              <Route path="/teacher" element={<ProtectedRoute userType="teacher" />}>
                <Route path="dashboard" element={<TeacherDashboard />} />
                <Route path="courses" element={<TeacherCourses />} />
                <Route path="courses/create" element={<TeacherCreateCourse />} />
                <Route path="assignments" element={<TeacherAssignments />} />
                <Route path="assignments/create" element={<TeacherCreateAssignment />} />
                <Route path="assignments/:assignmentId/submissions" element={<TeacherAssignmentSubmissions />} />
              </Route>
              
              <Route path="/student" element={<ProtectedRoute userType="student" />}>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="courses" element={<StudentCourses />} />
                <Route path="assignments" element={<StudentAssignments />} />
                <Route path="assignments/:assignmentId" element={<StudentAssignmentDetail />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
