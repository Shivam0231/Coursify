import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Course from './components/Course';
import Buy from './components/Buy';
import Purchase from './components/Purchase';
import { Toaster } from 'react-hot-toast';
import Settings from './components/Settings';
import Coursevideos from './components/Coursevideos';
import Adminlogin from './Admin/Adminlogin';
import Adminsignup from './Admin/Adminsignup';
import Dashboard from './Admin/Dashboard';
import Coursecreate from './Admin/Coursecreate';
import Updatecourse from './Admin/Updatecourse';
import Ourcourses from './Admin/Ourcourses';

import { useAuth } from './context/AuthContext'; // 👈 Import the context hook

export default function App() {
 const { admin, user } = useAuth(); // 👈 Get admin and user from context

  return (
   <div>
     <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/login" element={<Login />} />
         <Route path="/signup" element={<Signup />} />
        <Route path="/courses" element={<Course />} />
         <Route path="/buy/:courseid" element={<Buy />} />
        <Route path="/purchases" element={user ? <Purchase /> : <Navigate to="/login" />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/courseVideos" element={<Coursevideos />} />

       {/* Admin routes */}
        <Route path="/admin/login" element={<Adminlogin />} />
        <Route path="/admin/signup" element={<Adminsignup />} />
        <Route path="/admin/dashboard" element={admin ? <Dashboard /> : <Navigate to="/admin/login" />} />
        <Route path="/admin/createcourse" element={admin ? <Coursecreate /> : <Navigate to="/admin/login" />} />
        <Route path="/admin/updatecourse/:id" element={admin ? <Updatecourse /> : <Navigate to="/admin/login" />} />
        <Route path="/admin/ourcourses" element={admin ? <Ourcourses /> : <Navigate to="/admin/login" />} />
        </Routes>
       <Toaster />
   </div>
 );
}