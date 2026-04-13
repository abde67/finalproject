import { Routes, Route, Navigate } from 'react-router-dom';

// Placeholder imports for pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/Dashboard';
import TakeQuiz from './pages/student/TakeQuiz';
import TeacherDashboard from './pages/teacher/Dashboard';
import ParentDashboard from './pages/parent/Dashboard';
import Layout from './layouts/DashboardLayout';

// Simple Auth Guard component
const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }
  
  const user = JSON.parse(userStr);
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Dashboard Routes */}
      <Route element={<Layout />}>
        <Route 
          path="/student" 
          element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/student/quiz" 
          element={
            <PrivateRoute allowedRoles={['student']}>
              <TakeQuiz />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/teacher" 
          element={
            <PrivateRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/family" 
          element={
            <PrivateRoute allowedRoles={['family']}>
              <ParentDashboard />
            </PrivateRoute>
          } 
        />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
